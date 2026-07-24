import React, { useState, useEffect } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { SessionSummaryPanel } from './components/SessionSummaryPanel';
import { PromptInputPanel } from './components/PromptInputPanel';
import { AnalysisPanel } from './components/AnalysisPanel';
import { ImprovedPromptPanel } from './components/ImprovedPromptPanel';
import { SettingsModal } from './components/SettingsModal';
import { FunctionalSpecModal } from './components/FunctionalSpecModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ProjectModal } from './components/ProjectModal';
import { ToastContainer, ToastMessage } from './components/Toast';

import { 
  Project, 
  AppSettings, 
  PromptLogItem, 
  AnalysisResult, 
  PromptStyle,
  ProjectSessionContext
} from './types';

import { 
  loadStoredSettings, 
  saveStoredSettings, 
  loadStoredProjects, 
  saveStoredProjects, 
  loadActiveProjectId, 
  saveActiveProjectId, 
  loadPromptHistory, 
  savePromptHistory 
} from './lib/storage';

export default function App() {
  // Application State
  const [settings, setSettings] = useState<AppSettings>(loadStoredSettings);
  const [projects, setProjects] = useState<Project[]>(loadStoredProjects);
  const [activeProjectId, setActiveProjectId] = useState<string>(loadActiveProjectId);
  const [history, setHistory] = useState<PromptLogItem[]>([]);
  
  const [rawPrompt, setRawPrompt] = useState<string>('');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  const [llmStatus, setLlmStatus] = useState<{ ok: boolean; provider: string; model?: string; message?: string } | null>(null);
  const [isPinging, setIsPinging] = useState<boolean>(false);

  // Modals & Drawers
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [exportSpecOpen, setExportSpecOpen] = useState<boolean>(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState<boolean>(false);
  const [projectModalOpen, setProjectModalOpen] = useState<boolean>(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  // Toast Alerts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Find active project
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Load history when active project changes
  useEffect(() => {
    if (activeProject) {
      const loaded = loadPromptHistory(activeProject.id);
      setHistory(loaded);
    }
  }, [activeProjectId]);

  // Ping LLM on mount
  useEffect(() => {
    handlePingLLM();
  }, []);

  // Sync projects with server API
  const handleSaveProjectsToServer = async (updatedProjects: Project[]) => {
    try {
      if (activeProject) {
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(activeProject),
        });
      }
    } catch (e) {
      // Ignore server storage errors in offline mode
    }
  };

  const handlePingLLM = async (customSettings?: AppSettings) => {
    setIsPinging(true);
    const targetSettings = customSettings || settings;
    try {
      const res = await fetch('/api/llm/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: targetSettings.llmProvider,
          localEndpoint: targetSettings.localEndpoint,
          localModelName: targetSettings.localModelName,
          geminiModel: targetSettings.geminiModel,
        }),
      });
      const data = await res.json();
      setLlmStatus(data);
      return data;
    } catch (err: any) {
      const failState = { ok: false, provider: targetSettings.llmProvider, message: 'Could not connect to backend server' };
      setLlmStatus(failState);
      return failState;
    } finally {
      setIsPinging(false);
    }
  };

  // Submit Prompt for Processing (Stages 1-5)
  const handleSubmitPrompt = async () => {
    if (!rawPrompt.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setCurrentAnalysis(null);

    try {
      const res = await fetch('/api/llm/analyze-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawPrompt: rawPrompt.trim(),
          projectContext: activeProject.context,
          settings,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const analysis: AnalysisResult = data.analysis;

      setCurrentAnalysis(analysis);

      if (data.warning) {
        addToast('info', 'Offline Fallback Engine Used', data.warning);
      } else {
        addToast('success', 'Prompt Optimized', `Analyzed as ${analysis.intent} with ${analysis.scores?.readiness || 80}% readiness score.`);
      }

      // Add to prompt history & auto-save session
      const newLogItem: PromptLogItem = {
        id: `log-${Date.now()}`,
        projectId: activeProject.id,
        timestamp: new Date().toISOString(),
        rawPrompt: rawPrompt.trim(),
        analysis,
      };

      const updatedHistory = [newLogItem, ...history];
      setHistory(updatedHistory);
      savePromptHistory(activeProject.id, updatedHistory);

      // Auto-save project state
      if (settings.autoSave) {
        // Optionally update recent features in project context
        const recent = activeProject.context.recentFeatures || [];
        if (!recent.includes(analysis.intent)) {
          const updatedContext = {
            ...activeProject.context,
            recentFeatures: [analysis.intent, ...recent].slice(0, 8),
          };
          handleUpdateProjectContext(updatedContext);
        }
      }
    } catch (err: any) {
      addToast('error', 'Analysis Failed', err.message || 'Error communicating with LLM engine.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Update session context
  const handleUpdateProjectContext = (updatedContext: ProjectSessionContext) => {
    const updatedProject = {
      ...activeProject,
      context: updatedContext,
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = projects.map((p) => (p.id === activeProject.id ? updatedProject : p));
    setProjects(updatedProjects);
    saveStoredProjects(updatedProjects);
    handleSaveProjectsToServer(updatedProjects);
  };

  // Project Switcher / Manager
  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    saveActiveProjectId(id);
    setCurrentAnalysis(null);
    setRawPrompt('');
    addToast('info', 'Switched Project', `Now active in ${projects.find((p) => p.id === id)?.name}`);
  };

  const handleSaveProjectModal = (projectData: Partial<Project>) => {
    if (projectData.id) {
      // Edit existing
      const updatedProjects = projects.map((p) =>
        p.id === projectData.id ? ({ ...p, ...projectData, updatedAt: new Date().toISOString() } as Project) : p
      );
      setProjects(updatedProjects);
      saveStoredProjects(updatedProjects);
      addToast('success', 'Project Updated', `Saved changes to ${projectData.name}`);
    } else {
      // Create new
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        name: projectData.name || 'New Project',
        description: projectData.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        context: projectData.context || {
          technologyStack: ['React', 'TypeScript', 'Tailwind CSS'],
          architecture: 'Client-side SPA architecture',
          currentGoals: ['Initial feature specification'],
          knownConstraints: [],
          recentFeatures: [],
          keyDecisions: [],
        },
      };
      const updatedProjects = [...projects, newProj];
      setProjects(updatedProjects);
      saveStoredProjects(updatedProjects);
      setActiveProjectId(newProj.id);
      saveActiveProjectId(newProj.id);
      addToast('success', 'Project Created', `Started new workspace: ${newProj.name}`);
    }
  };

  // Generate Functional Spec
  const handleGenerateSpec = async () => {
    const res = await fetch('/api/llm/export-spec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project: activeProject,
        history,
        settings,
      }),
    });
    const data = await res.json();
    return data.markdown || '';
  };

  const handleSaveSpecToDisk = async (content: string) => {
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/export-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: `functional-${activeProject.name.toLowerCase().replace(/\s+/g, '-')}.md`,
          content,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        addToast('success', 'Spec File Saved', `Written to ${data.path}`);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Apply analysis assumptions & decisions into Session Context
  const handleApplyToSessionContext = () => {
    if (!currentAnalysis) return;

    const currentDecisions = activeProject.context.keyDecisions || [];
    const newAssumptions = currentAnalysis.assumptions || [];

    const updatedDecisions = Array.from(new Set([...currentDecisions, ...newAssumptions]));

    handleUpdateProjectContext({
      ...activeProject.context,
      keyDecisions: updatedDecisions,
    });

    addToast('success', 'Context Synchronized', 'Added prompt assumptions to project key decisions.');
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#A04A30] selection:text-white">
      {/* Top Header */}
      <HeaderNav
        projects={projects}
        activeProject={activeProject}
        settings={settings}
        llmStatus={llmStatus}
        onSelectProject={handleSelectProject}
        onCreateProject={() => {
          setProjectToEdit(null);
          setProjectModalOpen(true);
        }}
        onEditProject={() => {
          setProjectToEdit(activeProject);
          setProjectModalOpen(true);
        }}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenExportSpec={() => setExportSpecOpen(true)}
        onToggleHistory={() => setHistoryDrawerOpen(!historyDrawerOpen)}
        onPingLLM={() => handlePingLLM()}
        isPinging={isPinging}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-[1800px] w-full mx-auto">
        {/* Left Column: Session Context Summary (Cols 1-3) */}
        <div className="lg:col-span-3 space-y-4">
          <SessionSummaryPanel
            project={activeProject}
            onUpdateContext={handleUpdateProjectContext}
          />
        </div>

        {/* Center Column: Prompt Input & Improved Output (Cols 4-8) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="flex-none">
            <PromptInputPanel
              rawPrompt={rawPrompt}
              onChangePrompt={setRawPrompt}
              onSubmit={handleSubmitPrompt}
              isAnalyzing={isAnalyzing}
              selectedStyle={settings.promptStyle}
              onChangeStyle={(style: PromptStyle) => {
                const newSettings = { ...settings, promptStyle: style };
                setSettings(newSettings);
                saveStoredSettings(newSettings);
              }}
            />
          </div>

          <div className="flex-1 min-h-[300px]">
            <ImprovedPromptPanel
              analysis={currentAnalysis}
              isAnalyzing={isAnalyzing}
              onCopyPrompt={(text) => {
                navigator.clipboard.writeText(text);
                addToast('success', 'Copied to Clipboard', 'Implementation prompt ready for AI Studio!');
              }}
              onApplyToSessionContext={handleApplyToSessionContext}
            />
          </div>
        </div>

        {/* Right Column: Structured Prompt Analysis (Cols 9-12) */}
        <div className="lg:col-span-4">
          <AnalysisPanel
            analysis={currentAnalysis}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </main>

      {/* Modals & Overlay Drawers */}
      {settingsOpen && (
        <SettingsModal
          settings={settings}
          onSave={(newSettings) => {
            setSettings(newSettings);
            saveStoredSettings(newSettings);
            handlePingLLM(newSettings);
            addToast('success', 'Settings Saved', `LLM provider set to ${newSettings.llmProvider}`);
          }}
          onClose={() => setSettingsOpen(false)}
          onPing={handlePingLLM}
        />
      )}

      {exportSpecOpen && (
        <FunctionalSpecModal
          project={activeProject}
          history={history}
          settings={settings}
          onClose={() => setExportSpecOpen(false)}
          onGenerateSpec={handleGenerateSpec}
          onSaveToDisk={handleSaveSpecToDisk}
        />
      )}

      <HistoryDrawer
        history={history}
        isOpen={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        onSelectPrompt={(text) => setRawPrompt(text)}
        onClearHistory={() => {
          setHistory([]);
          savePromptHistory(activeProject.id, []);
          addToast('info', 'History Cleared', 'Prompt log history cleared for this session.');
        }}
      />

      {projectModalOpen && (
        <ProjectModal
          projectToEdit={projectToEdit}
          onSaveProject={handleSaveProjectModal}
          onClose={() => setProjectModalOpen(false)}
        />
      )}

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
