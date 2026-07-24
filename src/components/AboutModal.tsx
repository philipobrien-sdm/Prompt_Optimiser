import React from 'react';
import { X, Cpu, Layers, Sparkles, FileText, CheckCircle2, Terminal, Shield, Workflow, Server } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#1A1A1A] w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#1A1A1A] my-auto">
        {/* Header */}
        <div className="p-6 border-b border-[#E0DED7] flex items-center justify-between bg-[#F9F8F6]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-[#A04A30] text-white font-mono text-[9px] uppercase font-bold tracking-widest">
                Architecture Brief
              </span>
              <span className="text-[10px] font-mono text-[#888378] uppercase tracking-widest">
                V0.1 / Full-Stack Overview
              </span>
            </div>
            <h3 className="font-serif text-2xl font-bold italic uppercase tracking-tight text-[#1A1A1A]">
              About Prompt Optimizer
            </h3>
            <p className="text-xs font-serif italic text-[#888378] mt-0.5">
              Deterministic Prompt Compiler & Technical Specification Engine
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1 text-xs leading-relaxed text-[#1A1A1A]">
          {/* Mission & What it is */}
          <section className="space-y-3 bg-[#F9F8F6] p-5 border border-[#E0DED7]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A04A30]" />
              <h4 className="font-serif font-bold italic text-base uppercase tracking-wider text-[#1A1A1A]">
                What is Prompt Optimizer?
              </h4>
            </div>
            <p className="font-serif text-sm leading-relaxed text-[#1A1A1A]/90">
              Prompt Optimizer is a specialized, full-stack workspace that bridges the gap between vague, informal human intent and high-clarity, context-aware prompt specifications required by advanced AI coding assistants.
            </p>
            <p className="font-sans text-xs text-[#888378] leading-relaxed">
              Instead of feeding AI models underspecified prompts that result in bloated features, visual "AI slop," or missing file structures, Prompt Optimizer compiles your raw thoughts into deterministic, single-pass implementation directives.
            </p>
          </section>

          {/* Under the Hood Pipeline */}
          <section className="space-y-4">
            <div className="border-b border-[#E0DED7] pb-2 flex items-center justify-between">
              <h4 className="font-serif font-bold italic text-lg uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
                <Workflow className="w-4 h-4 text-[#A04A30]" />
                How It Works Under The Hood
              </h4>
              <span className="font-mono text-[10px] text-[#888378] uppercase tracking-widest">
                5-Stage Optimization Engine
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stage 1 */}
              <div className="bg-[#F2F0EB] p-4 border border-[#E0DED7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 bg-[#1A1A1A] text-white">
                    Stage 01
                  </span>
                  <span className="font-mono text-[10px] text-[#888378]">Dimension Scoring</span>
                </div>
                <h5 className="font-serif font-bold text-sm text-[#1A1A1A]">Intent & Quality Diagnostics</h5>
                <p className="text-[11px] font-sans text-[#1A1A1A]/80 leading-snug">
                  The system evaluates raw prompts across 5 key software dimensions: <strong className="text-[#A04A30]">Readiness</strong>, <strong className="text-[#A04A30]">Clarity</strong>, <strong className="text-[#A04A30]">Specificity</strong>, <strong className="text-[#A04A30]">Architecture</strong>, and <strong className="text-[#A04A30]">Completeness</strong>, surfacing clear readiness scores.
                </p>
              </div>

              {/* Stage 2 */}
              <div className="bg-[#F2F0EB] p-4 border border-[#E0DED7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 bg-[#1A1A1A] text-white">
                    Stage 02
                  </span>
                  <span className="font-mono text-[10px] text-[#888378]">Context Fusion</span>
                </div>
                <h5 className="font-serif font-bold text-sm text-[#1A1A1A]">Workspace Profile Injection</h5>
                <p className="text-[11px] font-sans text-[#1A1A1A]/80 leading-snug">
                  Active project parameters (tech stack, system architecture, core goals, known constraints) are dynamically merged into the LLM context to ground every generated directive in your actual environment.
                </p>
              </div>

              {/* Stage 3 */}
              <div className="bg-[#F2F0EB] p-4 border border-[#E0DED7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 bg-[#A04A30] text-white">
                    Stage 03
                  </span>
                  <span className="font-mono text-[10px] text-[#888378]">Dual-Engine Proxy</span>
                </div>
                <h5 className="font-serif font-bold text-sm text-[#1A1A1A]">Gemini API & Local LLM Gateway</h5>
                <p className="text-[11px] font-sans text-[#1A1A1A]/80 leading-snug">
                  Express backend proxies calls to either server-side <strong className="text-[#1A1A1A]">Google Gemini 3.6 Flash / Pro</strong> via <code className="font-mono text-[10px]">@google/genai</code> or local REST endpoints (<code className="font-mono text-[10px]">LM Studio / Ollama</code> on port 1234).
                </p>
              </div>

              {/* Stage 4 */}
              <div className="bg-[#F2F0EB] p-4 border border-[#E0DED7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 bg-[#1A1A1A] text-white">
                    Stage 04
                  </span>
                  <span className="font-mono text-[10px] text-[#888378]">Style Formatting</span>
                </div>
                <h5 className="font-serif font-bold text-sm text-[#1A1A1A]">Structured Prompt Compiler</h5>
                <p className="text-[11px] font-sans text-[#1A1A1A]/80 leading-snug">
                  Compiles output into specialized developer prompt structures: Architectural Specification, Concise Execution, Behavior Driven Development (BDD), or Chain of Thought.
                </p>
              </div>
            </div>
          </section>

          {/* Functional Spec Generator Detail */}
          <section className="bg-[#1A1A1A] text-white p-5 border border-[#1A1A1A] space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#A04A30]" />
              <h4 className="font-serif font-bold italic text-sm uppercase tracking-wider text-white">
                Stage 05: Functional Specification Synthesis (<code className="font-mono text-xs text-[#A04A30]">functional.md</code>)
              </h4>
            </div>
            <p className="text-xs font-serif italic text-[#E0DED7] leading-relaxed">
              In addition to prompt refining, Prompt Optimizer maintains an internal session ledger. The system aggregates all historical prompt iterations, architectural constraints, and stack decisions to compile a comprehensive, standard <code className="font-mono text-xs text-white">functional.md</code> specification that can be written directly to the workspace filesystem disk or downloaded locally.
            </p>
          </section>

          {/* System Highlights Grid */}
          <section className="space-y-3">
            <h4 className="font-serif font-bold italic text-sm uppercase tracking-wider text-[#1A1A1A] border-b border-[#E0DED7] pb-1">
              Core Technical Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#F9F8F6] border border-[#E0DED7]">
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <Shield className="w-3.5 h-3.5 text-[#A04A30]" />
                  <span>Key Isolation</span>
                </div>
                <p className="text-[10px] text-[#888378]">
                  Gemini API keys remain strictly server-side on Node/Express, keeping credentials hidden from the browser.
                </p>
              </div>

              <div className="p-3 bg-[#F9F8F6] border border-[#E0DED7]">
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <Cpu className="w-3.5 h-3.5 text-[#A04A30]" />
                  <span>Local LLM Support</span>
                </div>
                <p className="text-[10px] text-[#888378]">
                  Full compatibility with local offline models (LM Studio, Ollama) via custom REST base URLs.
                </p>
              </div>

              <div className="p-3 bg-[#F9F8F6] border border-[#E0DED7]">
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <Server className="w-3.5 h-3.5 text-[#A04A30]" />
                  <span>Disk Persistence</span>
                </div>
                <p className="text-[10px] text-[#888378]">
                  Direct filesystem export allowing generated specifications to be saved straight to your project root.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#E0DED7] bg-[#F9F8F6] flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#888378] uppercase tracking-widest">
            Prompt Optimizer • Built with React 19, Express & Google GenAI SDK
          </span>
          <button
            onClick={onClose}
            className="bg-[#1A1A1A] text-white px-5 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-[#A04A30] transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
