import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  Target, 
  ShieldAlert, 
  CheckSquare, 
  Plus, 
  X, 
  Edit3, 
  Code
} from 'lucide-react';
import { Project, ProjectSessionContext } from '../types';

interface SessionSummaryPanelProps {
  project: Project;
  onUpdateContext: (updatedContext: ProjectSessionContext) => void;
}

export const SessionSummaryPanel: React.FC<SessionSummaryPanelProps> = ({
  project,
  onUpdateContext,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [constraintInput, setConstraintInput] = useState('');
  const [decisionInput, setDecisionInput] = useState('');
  const [architectureInput, setArchitectureInput] = useState(project.context.architecture);

  const context = project.context;

  const handleAddTag = (
    field: keyof Omit<ProjectSessionContext, 'architecture'>,
    value: string,
    setValue: (val: string) => void
  ) => {
    if (!value.trim()) return;
    const currentList = context[field] || [];
    if (!currentList.includes(value.trim())) {
      onUpdateContext({
        ...context,
        [field]: [...currentList, value.trim()],
      });
    }
    setValue('');
  };

  const handleRemoveTag = (
    field: keyof Omit<ProjectSessionContext, 'architecture'>,
    tagToRemove: string
  ) => {
    const currentList = context[field] || [];
    onUpdateContext({
      ...context,
      [field]: currentList.filter((item) => item !== tagToRemove),
    });
  };

  const handleSaveArchitecture = () => {
    onUpdateContext({
      ...context,
      architecture: architectureInput,
    });
    setIsEditing(false);
  };

  // Calculate completeness
  const hasTech = (context.technologyStack?.length || 0) > 0;
  const hasArch = !!context.architecture;
  const hasGoals = (context.currentGoals?.length || 0) > 0;
  const hasConstraints = (context.knownConstraints?.length || 0) > 0;
  const completeness = Math.round(([hasTech, hasArch, hasGoals, hasConstraints].filter(Boolean).length / 4) * 100);

  return (
    <div className="bg-white border border-[#E0DED7] p-6 flex flex-col gap-6 shadow-sm text-[#1A1A1A] h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E0DED7] pb-3">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A04A30]">
            01 / Context Summary
          </h2>
          <p className="text-xs font-serif italic text-[#888378]">Session Architecture & Constraints</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] hover:text-[#A04A30] flex items-center gap-1 transition-colors border border-[#1A1A1A] px-2 py-0.5"
        >
          <Edit3 className="w-3 h-3" />
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>

      {/* Tech Stack */}
      <div className="space-y-1.5">
        <p className="text-[9px] uppercase tracking-widest text-[#888378] font-mono">Technology Stack</p>
        <div className="flex flex-wrap gap-1.5">
          {context.technologyStack?.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F2F0EB] text-[#1A1A1A] border border-[#E0DED7] text-[11px] font-mono"
            >
              {tech}
              {isEditing && (
                <button
                  onClick={() => handleRemoveTag('technologyStack', tech)}
                  className="hover:text-[#A04A30] transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
          {context.technologyStack?.length === 0 && (
            <p className="text-xs font-serif italic text-[#888378]">No stack specified</p>
          )}
        </div>
        {isEditing && (
          <div className="flex gap-1 mt-2">
            <input
              type="text"
              placeholder="Add tech..."
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag('technologyStack', techInput, setTechInput)}
              className="flex-1 bg-[#F9F8F6] border border-[#E0DED7] px-2 py-1 text-xs text-[#1A1A1A] font-mono focus:outline-none focus:border-[#1A1A1A]"
            />
            <button
              onClick={() => handleAddTag('technologyStack', techInput, setTechInput)}
              className="px-2 py-1 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Architecture */}
      <div className="space-y-1.5">
        <p className="text-[9px] uppercase tracking-widest text-[#888378] font-mono">Architecture</p>
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={architectureInput}
              onChange={(e) => setArchitectureInput(e.target.value)}
              rows={2}
              className="w-full bg-[#F9F8F6] border border-[#E0DED7] p-2 text-xs font-serif text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            />
            <button
              onClick={handleSaveArchitecture}
              className="text-[9px] uppercase tracking-widest font-bold px-3 py-1 bg-[#1A1A1A] text-white"
            >
              Save Architecture
            </button>
          </div>
        ) : (
          <p className="text-xs font-serif leading-relaxed text-[#1A1A1A]">
            {context.architecture || 'No architecture defined'}
          </p>
        )}
      </div>

      {/* Current Goals */}
      <div className="space-y-1.5">
        <p className="text-[9px] uppercase tracking-widest text-[#888378] font-mono">Current Goals</p>
        <ul className="space-y-1.5 text-xs font-serif">
          {context.currentGoals?.map((goal) => (
            <li key={goal} className="flex items-start justify-between gap-2 leading-snug text-[#1A1A1A]">
              <span>• {goal}</span>
              {isEditing && (
                <button
                  onClick={() => handleRemoveTag('currentGoals', goal)}
                  className="text-[#888378] hover:text-[#A04A30] shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </li>
          ))}
        </ul>
        {isEditing && (
          <div className="flex gap-1 mt-1">
            <input
              type="text"
              placeholder="Add goal..."
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag('currentGoals', goalInput, setGoalInput)}
              className="flex-1 bg-[#F9F8F6] border border-[#E0DED7] px-2 py-1 text-xs text-[#1A1A1A] font-serif focus:outline-none focus:border-[#1A1A1A]"
            />
            <button
              onClick={() => handleAddTag('currentGoals', goalInput, setGoalInput)}
              className="px-2 py-1 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Constraints */}
      <div className="space-y-1.5">
        <p className="text-[9px] uppercase tracking-widest text-[#A04A30] font-mono font-bold">Constraints</p>
        <ul className="space-y-1.5 text-xs font-serif leading-relaxed text-[#A04A30]">
          {context.knownConstraints?.map((c) => (
            <li key={c} className="flex items-start justify-between gap-2">
              <span>• {c}</span>
              {isEditing && (
                <button
                  onClick={() => handleRemoveTag('knownConstraints', c)}
                  className="text-[#888378] hover:text-[#1A1A1A] shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </li>
          ))}
        </ul>
        {isEditing && (
          <div className="flex gap-1 mt-1">
            <input
              type="text"
              placeholder="Add constraint..."
              value={constraintInput}
              onChange={(e) => setConstraintInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag('knownConstraints', constraintInput, setConstraintInput)}
              className="flex-1 bg-[#F9F8F6] border border-[#E0DED7] px-2 py-1 text-xs text-[#1A1A1A] font-serif focus:outline-none focus:border-[#1A1A1A]"
            />
            <button
              onClick={() => handleAddTag('knownConstraints', constraintInput, setConstraintInput)}
              className="px-2 py-1 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Key Decisions */}
      <div className="space-y-1.5">
        <p className="text-[9px] uppercase tracking-widest text-[#888378] font-mono">Key Decisions</p>
        <ul className="space-y-1.5 text-xs font-serif text-[#1A1A1A]">
          {context.keyDecisions?.map((d) => (
            <li key={d} className="flex items-start justify-between gap-2 leading-snug">
              <span>• {d}</span>
              {isEditing && (
                <button
                  onClick={() => handleRemoveTag('keyDecisions', d)}
                  className="text-[#888378] hover:text-[#A04A30] shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </li>
          ))}
        </ul>
        {isEditing && (
          <div className="flex gap-1 mt-1">
            <input
              type="text"
              placeholder="Add decision..."
              value={decisionInput}
              onChange={(e) => setDecisionInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag('keyDecisions', decisionInput, setDecisionInput)}
              className="flex-1 bg-[#F9F8F6] border border-[#E0DED7] px-2 py-1 text-xs text-[#1A1A1A] font-serif focus:outline-none focus:border-[#1A1A1A]"
            />
            <button
              onClick={() => handleAddTag('keyDecisions', decisionInput, setDecisionInput)}
              className="px-2 py-1 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Editorial Health Indicator */}
      <div className="mt-auto pt-4 border-t border-[#E0DED7]">
        <div className="bg-[#F9F8F6] border border-[#E0DED7] p-4">
          <p className="text-[9px] uppercase tracking-widest font-mono text-[#888378] mb-2">Project Context Completeness</p>
          <div className="h-[3px] w-full bg-[#E0DED7] mb-2">
            <div 
              className="h-full bg-[#A04A30] transition-all duration-500" 
              style={{ width: `${Math.max(15, completeness)}%` }} 
            />
          </div>
          <p className="text-[11px] italic font-serif text-[#1A1A1A]">{completeness}% Specification Completeness</p>
        </div>
      </div>
    </div>
  );
};

