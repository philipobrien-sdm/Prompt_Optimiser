import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  ArrowUpRight, 
  CheckCircle2, 
  Code2
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface ImprovedPromptPanelProps {
  analysis: AnalysisResult | null;
  isAnalyzing: boolean;
  onCopyPrompt: (promptText: string) => void;
  onApplyToSessionContext?: () => void;
}

export const ImprovedPromptPanel: React.FC<ImprovedPromptPanelProps> = ({
  analysis,
  isAnalyzing,
  onCopyPrompt,
  onApplyToSessionContext,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!analysis?.improvedPrompt) return;
    onCopyPrompt(analysis.improvedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!analysis?.improvedPrompt) return;
    const blob = new Blob([analysis.improvedPrompt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized-prompt-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isAnalyzing) {
    return (
      <div className="bg-white border border-[#E0DED7] p-8 flex flex-col items-center justify-center gap-3 min-h-[300px] text-center shadow-sm h-full">
        <Sparkles className="w-8 h-8 text-[#A04A30] animate-pulse" />
        <h4 className="text-sm font-serif italic text-[#1A1A1A]">Generating Refined Specification Prompt...</h4>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white border border-[#E0DED7] p-8 flex flex-col items-center justify-center gap-3 min-h-[300px] text-center text-[#888378] shadow-sm h-full">
        <Code2 className="w-8 h-8 text-[#E0DED7]" />
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A]">03 / Refined Prompt</h4>
          <p className="text-xs font-serif italic text-[#888378] mt-1 max-w-xs">
            The optimized, structured implementation prompt for AI Studio or Gemini will be compiled here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E0DED7] p-6 lg:p-8 flex flex-col gap-4 shadow-sm h-full text-[#1A1A1A]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E0DED7] pb-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#1A1A1A]">
            03 / Refined Prompt
          </h2>
          <p className="text-[10px] font-mono text-[#888378] uppercase tracking-widest">
            Structured Markdown Output
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Download */}
          <button
            onClick={handleDownload}
            className="border border-[#E0DED7] text-[#1A1A1A] hover:border-[#1A1A1A] px-3 py-1 text-[9px] uppercase tracking-widest font-bold transition-colors"
            title="Download prompt as .md"
          >
            <Download className="w-3 h-3 inline mr-1" />
            <span>Download</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`border border-[#1A1A1A] px-4 py-1 text-[9px] uppercase tracking-widest font-bold transition-all ${
              copied
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-[#A04A30] text-white hover:bg-[#863B24]'
            }`}
          >
            {copied ? (
              <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Copied!</span>
            ) : (
              <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copy Prompt</span>
            )}
          </button>
        </div>
      </div>

      {/* Code Text Area */}
      <div className="relative flex-1 min-h-[220px]">
        <textarea
          readOnly
          value={analysis.improvedPrompt}
          className="w-full h-full min-h-[220px] bg-[#F2F0EB] border border-[#E0DED7] p-4 text-xs font-mono text-[#1A1A1A] leading-relaxed focus:outline-none resize-none select-all"
        />
      </div>

      {/* Footer Sync Action */}
      {onApplyToSessionContext && (
        <div className="pt-2 flex items-center justify-between text-[10px] font-mono border-t border-[#E0DED7]">
          <span className="text-[#888378]">Targeting AI Studio System Directive</span>
          <button
            onClick={onApplyToSessionContext}
            className="flex items-center gap-1 text-[#A04A30] hover:text-[#863B24] font-bold uppercase tracking-wider transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sync into Session Context</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

