import React from 'react';
import { 
  Activity, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  FileSearch, 
  Tag, 
  ShieldAlert, 
  Sparkles,
  Info,
  Scale
} from 'lucide-react';
import { AnalysisResult, QualityScores } from '../types';

interface AnalysisPanelProps {
  analysis: AnalysisResult | null;
  isAnalyzing: boolean;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, isAnalyzing }) => {
  if (isAnalyzing) {
    return (
      <div className="bg-white border border-[#E0DED7] p-8 flex flex-col items-center justify-center gap-4 min-h-[300px] text-center shadow-sm h-full text-[#1A1A1A]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-[#A04A30]/20 border-t-[#A04A30] animate-spin" />
          <Sparkles className="w-5 h-5 text-[#A04A30] absolute inset-0 m-auto" />
        </div>
        <div>
          <h4 className="text-sm font-serif italic text-[#1A1A1A]">Executing 5-Stage Diagnostic Pipeline...</h4>
          <p className="text-xs font-mono text-[#888378] mt-1 max-w-xs">
            Intent → Context → Ambiguity → Synthesis → Quality Metrics
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white border border-[#E0DED7] p-8 flex flex-col items-center justify-center gap-3 min-h-[300px] text-center text-[#888378] shadow-sm h-full">
        <FileSearch className="w-8 h-8 text-[#E0DED7]" />
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A]">04 / Diagnostic Analysis</h4>
          <p className="text-xs font-serif italic text-[#888378] mt-1 max-w-xs">
            Diagnostic metrics, quality indices, and missing specifications will be displayed here.
          </p>
        </div>
      </div>
    );
  }

  const scores: QualityScores = analysis.scores || {
    clarity: 80,
    completeness: 70,
    consistency: 85,
    specificity: 75,
    ambiguity: 20,
    readiness: 78,
  };

  const scoreItems = [
    { label: 'Clarity', val: scores.clarity },
    { label: 'Completeness', val: scores.completeness },
    { label: 'Consistency', val: scores.consistency },
    { label: 'Specificity', val: scores.specificity },
    { label: 'Low Ambiguity', val: 100 - (scores.ambiguity || 20) },
    { label: 'Readiness Index', val: scores.readiness },
  ];

  return (
    <div className="bg-white border border-[#E0DED7] p-6 lg:p-8 flex flex-col gap-6 shadow-sm overflow-y-auto max-h-[600px] text-[#1A1A1A]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E0DED7] pb-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#1A1A1A]">
            04 / Diagnostic Analysis
          </h2>
          <p className="text-[10px] font-mono text-[#888378] uppercase tracking-widest">
            Quantitative Quality Assessment
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F2F0EB] border border-[#E0DED7] text-[10px] font-mono font-bold text-[#1A1A1A]">
          <Tag className="w-3 h-3 text-[#A04A30]" />
          <span className="uppercase">{analysis.intent}</span>
        </div>
      </div>

      {/* Quality Index Grid */}
      <div className="p-4 bg-[#F9F8F6] border border-[#E0DED7] space-y-3">
        <div className="flex items-center justify-between text-xs font-serif font-bold text-[#1A1A1A]">
          <span className="uppercase tracking-wider text-[10px] font-mono text-[#888378]">Prompt Quality Metrics</span>
          <span className="text-[#A04A30] font-mono">{scores.readiness}% Overall Index</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
          {scoreItems.map((item) => (
            <div key={item.label} className="bg-white p-2.5 border border-[#E0DED7]">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#888378] uppercase mb-1">
                <span>{item.label}</span>
                <span className="font-bold text-[#1A1A1A]">{item.val}%</span>
              </div>
              <div className="w-full bg-[#E0DED7] h-1">
                <div
                  className="h-full bg-[#A04A30] transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, item.val))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Understanding Section */}
      <div className="space-y-1.5">
        <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#888378]">
          Detected Goal & Scope
        </h4>
        <p className="text-xs font-serif leading-relaxed text-[#1A1A1A] bg-[#F9F8F6] border border-[#E0DED7] p-3">
          {analysis.understanding}
        </p>
      </div>

      {/* Inferred Assumptions */}
      <div className="space-y-1.5">
        <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#888378]">
          Inferred Assumptions ({analysis.assumptions?.length || 0})
        </h4>
        <div className="space-y-1">
          {analysis.assumptions?.map((item, i) => (
            <div key={i} className="flex items-start gap-2 p-2 bg-[#F9F8F6] border border-[#E0DED7] text-xs font-serif text-[#1A1A1A] leading-snug">
              <span className="font-mono text-[9px] bg-[#1A1A1A] text-white px-1 py-0.2 shrink-0 font-bold">
                A{i + 1}
              </span>
              <span>{item}</span>
            </div>
          ))}
          {(!analysis.assumptions || analysis.assumptions.length === 0) && (
            <p className="text-xs font-serif italic text-[#888378]">No assumptions inferred.</p>
          )}
        </div>
      </div>

      {/* Missing Information / Ambiguities */}
      <div className="space-y-1.5">
        <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#A04A30] font-bold">
          Ambiguities & Missing Info ({analysis.missingInformation?.length || 0})
        </h4>
        <div className="space-y-1">
          {analysis.missingInformation?.map((item, i) => (
            <div key={i} className="flex items-start gap-2 p-2 bg-[#A04A30]/5 border border-[#A04A30]/20 text-xs font-serif text-[#A04A30] leading-snug">
              <span className="font-mono text-[9px] bg-[#A04A30] text-white px-1 py-0.2 shrink-0 font-bold">
                ?{i + 1}
              </span>
              <span>{item}</span>
            </div>
          ))}
          {(!analysis.missingInformation || analysis.missingInformation.length === 0) && (
            <p className="text-xs font-serif italic text-[#888378]">No missing details identified.</p>
          )}
        </div>
      </div>

      {/* Risks & Contradictions */}
      <div className="space-y-1.5">
        <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#888378]">
          Technical Risks ({analysis.risks?.length || 0})
        </h4>
        <div className="space-y-1">
          {analysis.risks?.map((item, i) => (
            <div key={i} className="flex items-start gap-2 p-2 bg-[#F9F8F6] border border-[#E0DED7] text-xs font-serif text-[#1A1A1A] leading-snug">
              <AlertTriangle className="w-3.5 h-3.5 text-[#A04A30] shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
          {(!analysis.risks || analysis.risks.length === 0) && (
            <p className="text-xs font-serif italic text-[#888378]">No implementation risks detected.</p>
          )}
        </div>
      </div>
    </div>
  );
};

