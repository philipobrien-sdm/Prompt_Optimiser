import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Save, 
  Sparkles,
  Layers,
  Code
} from 'lucide-react';
import { Project, PromptLogItem, AppSettings } from '../types';

interface FunctionalSpecModalProps {
  project: Project;
  history: PromptLogItem[];
  settings: AppSettings;
  onClose: () => void;
  onGenerateSpec: () => Promise<string>;
  onSaveToDisk: (content: string) => Promise<boolean>;
}

export const FunctionalSpecModal: React.FC<FunctionalSpecModalProps> = ({
  project,
  history,
  settings,
  onClose,
  onGenerateSpec,
  onSaveToDisk,
}) => {
  const [markdown, setMarkdown] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedToDisk, setSavedToDisk] = useState(false);

  const fetchSpec = async () => {
    setIsLoading(true);
    setSavedToDisk(false);
    try {
      const specText = await onGenerateSpec();
      setMarkdown(specText);
    } catch (err) {
      console.error('Failed to generate spec', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpec();
  }, []);

  const handleCopy = () => {
    if (!markdown) return;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `functional-${project.name.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveDisk = async () => {
    if (!markdown) return;
    const ok = await onSaveToDisk(markdown);
    if (ok) {
      setSavedToDisk(true);
      setTimeout(() => setSavedToDisk(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#1A1A1A] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col h-[85vh] text-[#1A1A1A]">
        {/* Header */}
        <div className="p-6 border-b border-[#E0DED7] flex items-center justify-between bg-[#F9F8F6]">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#A04A30]" />
            <div>
              <h3 className="font-serif text-xl font-bold italic uppercase tracking-tight text-[#1A1A1A]">
                Export Functional Specification
              </h3>
              <p className="text-[10px] font-mono text-[#888378] uppercase tracking-widest mt-0.5">
                Generates functional.md documentation from session context
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchSpec}
              disabled={isLoading}
              className="p-1.5 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
              title="Regenerate spec"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#A04A30]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 bg-[#F2F0EB] border-b border-[#E0DED7] flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-3 text-[#888378]">
            <span className="font-bold text-[#1A1A1A]">functional.md</span>
            <span>/</span>
            <span>{markdown.length} CHARS</span>
            <span>/</span>
            <span>{history.length} PROMPTS INTEGRATED</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveDisk}
              disabled={isLoading || !markdown}
              className="border border-[#1A1A1A] px-3 py-1.5 font-bold uppercase tracking-widest text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
            >
              {savedToDisk ? <Check className="w-3.5 h-3.5 inline mr-1 text-[#A04A30]" /> : <Save className="w-3.5 h-3.5 inline mr-1 text-[#A04A30]" />}
              <span>{savedToDisk ? 'Saved!' : 'Save file'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isLoading || !markdown}
              className="border border-[#1A1A1A] px-3 py-1.5 font-bold uppercase tracking-widest text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5 inline mr-1 text-[#A04A30]" />
              <span>Download .md</span>
            </button>

            <button
              onClick={handleCopy}
              disabled={isLoading || !markdown}
              className={`px-4 py-1.5 font-bold uppercase tracking-widest transition-all ${
                copied ? 'bg-[#1A1A1A] text-white' : 'bg-[#A04A30] text-white hover:bg-[#863B24]'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 inline mr-1" /> : <Copy className="w-3.5 h-3.5 inline mr-1" />}
              <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="p-6 flex-1 overflow-y-auto bg-[#F2F0EB] font-mono text-xs text-[#1A1A1A] leading-relaxed">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-[#888378]">
              <Sparkles className="w-8 h-8 text-[#A04A30] animate-bounce" />
              <p className="font-serif italic">Compiling session context into functional.md specification...</p>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-mono selection:bg-[#A04A30] selection:text-white select-all">
              {markdown}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

