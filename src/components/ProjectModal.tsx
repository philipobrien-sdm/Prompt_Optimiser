import React, { useState } from 'react';
import { 
  X, 
  FolderPlus, 
  Save, 
  Folder, 
  Layers, 
  Code, 
  Target, 
  ShieldAlert 
} from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  projectToEdit?: Project | null;
  onSaveProject: (projectData: Partial<Project>) => void;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  projectToEdit,
  onSaveProject,
  onClose,
}) => {
  const [name, setName] = useState(projectToEdit?.name || '');
  const [description, setDescription] = useState(projectToEdit?.description || '');
  const [stackStr, setStackStr] = useState(projectToEdit?.context?.technologyStack?.join(', ') || 'React, TypeScript, Tailwind CSS, Express');
  const [architecture, setArchitecture] = useState(projectToEdit?.context?.architecture || 'Single-Page React application with server-side proxy layer');
  const [goalsStr, setGoalsStr] = useState(projectToEdit?.context?.currentGoals?.join('; ') || 'Build robust features');
  const [constraintsStr, setConstraintsStr] = useState(projectToEdit?.context?.knownConstraints?.join('; ') || 'Keep secret API keys on server side');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const stack = stackStr.split(/[,;]/).map(s => s.trim()).filter(Boolean);
    const goals = goalsStr.split(/;/).map(s => s.trim()).filter(Boolean);
    const constraints = constraintsStr.split(/;/).map(s => s.trim()).filter(Boolean);

    onSaveProject({
      id: projectToEdit?.id,
      name: name.trim(),
      description: description.trim(),
      context: {
        technologyStack: stack,
        architecture,
        currentGoals: goals,
        knownConstraints: constraints,
        recentFeatures: projectToEdit?.context?.recentFeatures || [],
        keyDecisions: projectToEdit?.context?.keyDecisions || [],
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#1A1A1A] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-[#1A1A1A]">
        <div className="p-6 border-b border-[#E0DED7] flex items-center justify-between bg-[#F9F8F6]">
          <div>
            <h3 className="font-serif text-xl font-bold italic uppercase tracking-tight text-[#1A1A1A]">
              {projectToEdit ? 'Edit Project Profile' : 'Create New Project'}
            </h3>
            <p className="text-[10px] font-mono text-[#888378] uppercase tracking-widest mt-0.5">
              Workspace architectural parameters
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888378] mb-1 font-bold">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F9F8F6] border border-[#E0DED7] p-2.5 font-serif text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              placeholder="e.g. Prompt Optimizer App"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888378] mb-1 font-bold">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F9F8F6] border border-[#E0DED7] p-2.5 font-serif text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              placeholder="Brief summary of what this software does..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888378] mb-1 font-bold flex items-center gap-1">
              <Code className="w-3.5 h-3.5 text-[#A04A30]" /> Technology Stack (comma-separated)
            </label>
            <input
              type="text"
              value={stackStr}
              onChange={(e) => setStackStr(e.target.value)}
              className="w-full bg-[#F9F8F6] border border-[#E0DED7] p-2.5 font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              placeholder="React, TypeScript, Express, Tailwind"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888378] mb-1 font-bold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#A04A30]" /> System Architecture
            </label>
            <input
              type="text"
              value={architecture}
              onChange={(e) => setArchitecture(e.target.value)}
              className="w-full bg-[#F9F8F6] border border-[#E0DED7] p-2.5 font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              placeholder="Full-stack client-server SPA architecture"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888378] mb-1 font-bold flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-[#A04A30]" /> Core Goals (semicolon-separated)
            </label>
            <input
              type="text"
              value={goalsStr}
              onChange={(e) => setGoalsStr(e.target.value)}
              className="w-full bg-[#F9F8F6] border border-[#E0DED7] p-2.5 font-serif text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              placeholder="Goal 1; Goal 2; Goal 3"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888378] mb-1 font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-[#A04A30]" /> Known Constraints (semicolon-separated)
            </label>
            <input
              type="text"
              value={constraintsStr}
              onChange={(e) => setConstraintsStr(e.target.value)}
              className="w-full bg-[#F9F8F6] border border-[#E0DED7] p-2.5 font-serif text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              placeholder="Constraint 1; Constraint 2"
            />
          </div>

          <div className="pt-4 border-t border-[#E0DED7] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-[#1A1A1A] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#A04A30] text-white px-5 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-[#863B24] transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{projectToEdit ? 'Save Changes' : 'Create Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

