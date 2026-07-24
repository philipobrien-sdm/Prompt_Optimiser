import React, { useState } from 'react';
import { 
  X, 
  History, 
  Search, 
  RotateCcw, 
  Trash2, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles,
  Tag
} from 'lucide-react';
import { PromptLogItem } from '../types';

interface HistoryDrawerProps {
  history: PromptLogItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (promptText: string) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  isOpen,
  onClose,
  onSelectPrompt,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.rawPrompt.toLowerCase().includes(term) ||
      item.analysis?.intent?.toLowerCase().includes(term) ||
      item.analysis?.improvedPrompt?.toLowerCase().includes(term)
    );
  });

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/40 backdrop-blur-sm flex justify-end">
      <div className="bg-white border-l border-[#1A1A1A] w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 text-[#1A1A1A]">
        {/* Top Header */}
        <div className="p-6 border-b border-[#E0DED7] flex items-center justify-between bg-[#F9F8F6]">
          <div>
            <h3 className="font-serif text-lg font-bold italic uppercase tracking-tight text-[#1A1A1A]">
              Prompt Archive Log
            </h3>
            <p className="text-[10px] font-mono text-[#888378] uppercase tracking-widest mt-0.5">
              Historical optimization records
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Action Bar */}
        <div className="p-4 bg-[#F2F0EB] border-b border-[#E0DED7] flex items-center gap-2 text-xs">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#888378] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search prompts or intents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#E0DED7] pl-9 pr-3 py-2 text-xs font-serif text-[#1A1A1A] placeholder-[#888378] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-2 text-[#A04A30] border border-[#E0DED7] bg-white hover:border-[#1A1A1A] transition-colors"
              title="Clear all prompt history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-[#F9F8F6] border border-[#E0DED7] p-4 flex flex-col gap-3 hover:border-[#1A1A1A] transition-all text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-[#1A1A1A] text-white text-[9px] font-mono font-bold uppercase tracking-widest">
                  {item.analysis?.intent || 'Feature request'}
                </span>
                <span className="text-[10px] text-[#888378] font-mono">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div>
                <p className="font-serif italic text-[#1A1A1A] line-clamp-2 leading-relaxed">
                  "{item.rawPrompt}"
                </p>
              </div>

              {item.analysis?.scores && (
                <div className="flex items-center justify-between text-[10px] font-mono text-[#888378] bg-[#F2F0EB] p-2 border border-[#E0DED7]">
                  <span>READINESS: <strong className="text-[#1A1A1A]">{item.analysis.scores.readiness}%</strong></span>
                  <span>CLARITY: <strong className="text-[#A04A30]">{item.analysis.scores.clarity}%</strong></span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#E0DED7]">
                <button
                  onClick={() => handleCopyPrompt(item.id, item.analysis?.improvedPrompt || item.rawPrompt)}
                  className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#888378] hover:text-[#1A1A1A] flex items-center gap-1 transition-colors"
                >
                  {copiedId === item.id ? <Check className="w-3 h-3 text-[#A04A30]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === item.id ? 'Copied!' : 'Copy Rewritten'}</span>
                </button>

                <button
                  onClick={() => {
                    onSelectPrompt(item.rawPrompt);
                    onClose();
                  }}
                  className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#A04A30] hover:text-[#1A1A1A] flex items-center gap-1 transition-colors"
                >
                  <span>Load in Editor</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="text-center py-12 text-[#888378]">
              <History className="w-8 h-8 mx-auto mb-2 text-[#E0DED7]" />
              <p className="font-serif italic text-xs">No prompt records in session history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

