import React, { useState } from 'react';
import { 
  ChevronDown, 
  Wand2, 
  Layers,
  RotateCcw,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { PROMPT_TEMPLATES, PROMPT_STYLE_DESCRIPTIONS } from '../lib/defaults';
import { PromptStyle } from '../types';

interface PromptInputPanelProps {
  rawPrompt: string;
  onChangePrompt: (val: string) => void;
  onSubmit: () => void;
  isAnalyzing: boolean;
  selectedStyle: PromptStyle;
  onChangeStyle: (style: PromptStyle) => void;
}

export const PromptInputPanel: React.FC<PromptInputPanelProps> = ({
  rawPrompt,
  onChangePrompt,
  onSubmit,
  isAnalyzing,
  selectedStyle,
  onChangeStyle,
}) => {
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);

  const handleSelectTemplate = (templatePrompt: string) => {
    onChangePrompt(templatePrompt);
    setTemplateDropdownOpen(false);
  };

  const currentStyleInfo = PROMPT_STYLE_DESCRIPTIONS[selectedStyle] || PROMPT_STYLE_DESCRIPTIONS.google_ai_studio;

  return (
    <div className="bg-white border border-[#E0DED7] p-6 lg:p-8 flex flex-col gap-4 shadow-sm h-full text-[#1A1A1A]">
      {/* Section Header */}
      <div className="flex flex-wrap justify-between items-end pb-3 border-b border-[#E0DED7] gap-2">
        <div>
          <h2 className="text-2xl lg:text-3xl font-serif italic leading-none text-[#1A1A1A]">
            02 / Original Intent
          </h2>
          <p className="text-[10px] font-mono text-[#888378] uppercase tracking-widest mt-1">
            Free-form natural language input
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Templates Menu */}
          <div className="relative">
            <button
              onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)}
              className="flex items-center gap-1 px-3 py-1 bg-[#F9F8F6] border border-[#1A1A1A] text-[10px] uppercase font-bold tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-colors"
            >
              <Wand2 className="w-3 h-3 text-[#A04A30]" />
              <span>Templates</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {templateDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-white border border-[#1A1A1A] shadow-xl p-2 z-50 text-xs"
                onMouseLeave={() => setTemplateDropdownOpen(false)}
              >
                <div className="px-2 py-1 text-[9px] uppercase font-bold tracking-widest text-[#888378] border-b border-[#E0DED7] mb-1">
                  Prompt Templates
                </div>
                <div className="space-y-1 my-1 max-h-56 overflow-y-auto">
                  {PROMPT_TEMPLATES.map((tmpl, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectTemplate(tmpl.prompt)}
                      className="w-full text-left p-2 hover:bg-[#F2F0EB] transition-colors"
                    >
                      <div className="flex items-center justify-between font-serif italic font-bold text-[#1A1A1A]">
                        <span>{tmpl.title}</span>
                        <span className="text-[9px] bg-[#E0DED7] text-[#1A1A1A] px-1 font-mono uppercase">
                          {tmpl.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#888378] truncate mt-0.5 font-sans">{tmpl.prompt}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Style Format Dropdown */}
          <div className="relative">
            <button
              onClick={() => setStyleDropdownOpen(!styleDropdownOpen)}
              className="flex items-center gap-1 px-3 py-1 bg-[#F9F8F6] border border-[#E0DED7] text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
            >
              <Layers className="w-3 h-3 text-[#A04A30]" />
              <span>{currentStyleInfo.name}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {styleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-white border border-[#1A1A1A] shadow-xl p-2 z-50 text-xs"
                onMouseLeave={() => setStyleDropdownOpen(false)}
              >
                <div className="px-2 py-1 text-[9px] uppercase font-bold tracking-widest text-[#888378] border-b border-[#E0DED7] mb-1">
                  Target AI Assistant Format
                </div>
                <div className="space-y-1 my-1">
                  {(Object.keys(PROMPT_STYLE_DESCRIPTIONS) as PromptStyle[]).map((stKey) => {
                    const info = PROMPT_STYLE_DESCRIPTIONS[stKey];
                    return (
                      <button
                        key={stKey}
                        onClick={() => {
                          onChangeStyle(stKey);
                          setStyleDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 transition-colors ${
                          selectedStyle === stKey
                            ? 'bg-[#1A1A1A] text-white font-serif italic'
                            : 'hover:bg-[#F2F0EB] text-[#1A1A1A]'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{info.name}</span>
                          <span className="text-[9px] opacity-75 font-mono">{info.tag}</span>
                        </div>
                        <p className="text-[10px] opacity-80 mt-0.5 leading-snug font-sans">{info.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative flex-1 min-h-[120px] flex flex-col">
        <textarea
          value={rawPrompt}
          onChange={(e) => onChangePrompt(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              if (rawPrompt.trim() && !isAnalyzing) {
                onSubmit();
              }
            }
          }}
          placeholder="Enter your informal, natural language request here... (Press Ctrl + Enter to submit)"
          rows={5}
          className="w-full flex-1 bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-base lg:text-lg font-serif italic placeholder:text-[#1A1A1A]/30 leading-relaxed text-[#1A1A1A]"
        />

        {/* Word / Char Stats Bar */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E0DED7] text-[10px] font-mono text-[#888378]">
          <div className="flex items-center gap-3">
            <span>{rawPrompt.length} CHARS</span>
            <span>/</span>
            <span>{rawPrompt.trim().split(/\s+/).filter(Boolean).length} WORDS</span>
            <span className="hidden sm:inline text-[#888378]/60">(Ctrl + Enter to submit)</span>
          </div>

          {rawPrompt.length > 0 && (
            <button
              type="button"
              onClick={() => onChangePrompt('')}
              className="text-[#888378] hover:text-[#A04A30] transition-colors flex items-center gap-1 uppercase tracking-wider font-bold"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isAnalyzing || !rawPrompt.trim()}
        className={`w-full py-3.5 px-6 text-xs font-mono font-bold uppercase tracking-[0.15em] transition-all duration-200 flex items-center justify-center gap-2 border ${
          isAnalyzing || !rawPrompt.trim()
            ? 'bg-[#E0DED7] text-[#888378] border-[#E0DED7] cursor-not-allowed'
            : 'bg-[#A04A30] text-white border-[#A04A30] hover:bg-[#863B24] shadow-md hover:shadow-lg active:translate-y-0.5'
        }`}
      >
        {isAnalyzing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
            <span>Analyzing & Refining Intent...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Submit & Refine Prompt</span>
          </>
        )}
      </button>
    </div>
  );
};

