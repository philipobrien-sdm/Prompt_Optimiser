import React, { useState } from 'react';
import { 
  Sparkles, 
  FolderPlus, 
  Settings, 
  FileText, 
  History, 
  CheckCircle2, 
  WifiOff, 
  ChevronDown, 
  Folder, 
  Pencil,
  RefreshCw,
  Cpu,
  HelpCircle
} from 'lucide-react';
import { Project, AppSettings } from '../types';

interface HeaderNavProps {
  projects: Project[];
  activeProject: Project;
  settings: AppSettings;
  llmStatus: { ok: boolean; provider: string; model?: string; message?: string } | null;
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
  onEditProject: () => void;
  onOpenSettings: () => void;
  onOpenExportSpec: () => void;
  onToggleHistory: () => void;
  onOpenAbout: () => void;
  onPingLLM: () => void;
  isPinging: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  projects,
  activeProject,
  settings,
  llmStatus,
  onSelectProject,
  onCreateProject,
  onEditProject,
  onOpenSettings,
  onOpenExportSpec,
  onToggleHistory,
  onOpenAbout,
  onPingLLM,
  isPinging,
}) => {
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  return (
    <header className="bg-[#F9F8F6] border-b border-[#E0DED7] px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 select-none">
      {/* Brand & Project Info */}
      <div className="flex items-baseline gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-serif font-black tracking-tighter uppercase italic text-[#1A1A1A]">
            Prompt Optimizer
          </h1>
          <span className="text-[10px] font-mono text-[#888378] tracking-widest uppercase">
            V0.1 / LOCAL_HOST
          </span>
        </div>

        <div className="h-4 w-px bg-[#E0DED7] hidden md:block" />

        {/* Project Selector */}
        <div className="relative">
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="flex items-center gap-2 border border-[#1A1A1A] bg-white px-3 py-1.5 text-xs font-serif italic text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
          >
            <Folder className="w-3.5 h-3.5 text-[#A04A30]" />
            <span className="max-w-[160px] truncate font-bold not-italic text-[11px] uppercase tracking-wider">
              {activeProject.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {projectDropdownOpen && (
            <div 
              className="absolute left-0 mt-2 w-64 bg-white border border-[#1A1A1A] shadow-xl p-2 z-50 text-xs"
              onMouseLeave={() => setProjectDropdownOpen(false)}
            >
              <div className="px-2 py-1 text-[9px] uppercase font-bold tracking-widest text-[#888378] border-b border-[#E0DED7] mb-1">
                Workspace Projects
              </div>
              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p.id);
                      setProjectDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 flex items-center justify-between transition-colors ${
                      p.id === activeProject.id
                        ? 'bg-[#1A1A1A] text-white font-serif italic'
                        : 'text-[#1A1A1A] hover:bg-[#F2F0EB]'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    {p.id === activeProject.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#A04A30]" />}
                  </button>
                ))}
              </div>

              <div className="h-px bg-[#E0DED7] my-1.5" />

              <div className="flex gap-1">
                <button
                  onClick={() => {
                    onCreateProject();
                    setProjectDropdownOpen(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-[#A04A30] text-white text-[10px] uppercase font-bold tracking-widest hover:bg-[#863B24] transition-colors"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  New Project
                </button>
                <button
                  onClick={() => {
                    onEditProject();
                    setProjectDropdownOpen(false);
                  }}
                  className="flex items-center justify-center p-1.5 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
                  title="Edit Project Details"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Session Info */}
        <div className="hidden xl:flex flex-col items-end mr-2">
          <span className="text-[9px] uppercase tracking-widest text-[#888378]">Current Session</span>
          <span className="text-xs font-serif italic font-bold text-[#1A1A1A] truncate max-w-[180px]">
            {activeProject.name}
          </span>
        </div>

        {/* LLM Status Indicator */}
        <button
          onClick={onPingLLM}
          disabled={isPinging}
          className={`flex items-center gap-2 px-3 py-1 border text-[10px] uppercase tracking-widest transition-colors ${
            llmStatus?.ok
              ? 'border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
              : 'border-[#A04A30] bg-[#A04A30]/10 text-[#A04A30] hover:bg-[#A04A30] hover:text-white'
          }`}
          title={llmStatus?.message || 'Click to test LLM connectivity'}
        >
          {isPinging ? (
            <RefreshCw className="w-3 h-3 animate-spin text-[#A04A30]" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-[#A04A30]" />
          )}
          <span className="font-mono">
            LLM: {settings.llmProvider === 'local_lm_studio' ? 'Local LM Studio' : 'Gemini API'}
          </span>
        </button>

        {/* Export Spec */}
        <button
          onClick={onOpenExportSpec}
          className="border border-[#1A1A1A] px-3.5 py-1 text-[10px] uppercase tracking-widest text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors font-semibold"
        >
          Export .MD
        </button>

        {/* History */}
        <button
          onClick={onToggleHistory}
          className="border border-[#1A1A1A] px-3.5 py-1 text-[10px] uppercase tracking-widest text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors font-semibold flex items-center gap-1.5"
        >
          <History className="w-3 h-3" />
          <span>History</span>
        </button>

        {/* About / How it works */}
        <button
          onClick={onOpenAbout}
          className="border border-[#1A1A1A] px-3.5 py-1 text-[10px] uppercase tracking-widest text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors font-semibold flex items-center gap-1.5"
          title="Learn how Prompt Optimizer works under the hood"
        >
          <HelpCircle className="w-3 h-3 text-[#A04A30]" />
          <span>About Engine</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="bg-[#A04A30] text-white px-4 py-1 text-[10px] uppercase tracking-widest font-bold hover:bg-[#863B24] transition-colors shadow-sm flex items-center gap-1.5"
        >
          <Settings className="w-3 h-3" />
          <span>Settings</span>
        </button>
      </div>
    </header>
  );
};

