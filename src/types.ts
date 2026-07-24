export type LLMProvider = 'gemini' | 'local_lm_studio';

export type PromptStyle = 
  | 'google_ai_studio' 
  | 'gemini' 
  | 'claude_code' 
  | 'cursor' 
  | 'copilot';

export type IntentType = 
  | 'Feature request' 
  | 'Bug fix' 
  | 'Refactor' 
  | 'Architecture' 
  | 'UI & Styling' 
  | 'Testing' 
  | 'Documentation' 
  | 'Deployment' 
  | 'Performance' 
  | 'Research';

export interface QualityScores {
  clarity: number;       // 0-100
  completeness: number;  // 0-100
  consistency: number;   // 0-100
  specificity: number;   // 0-100
  ambiguity: number;     // 0-100 (lower is better, or inverted)
  readiness: number;     // 0-100
}

export interface ProjectSessionContext {
  technologyStack: string[];
  architecture: string;
  currentGoals: string[];
  knownConstraints: string[];
  recentFeatures: string[];
  keyDecisions: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  context: ProjectSessionContext;
}

export interface AnalysisResult {
  intent: IntentType;
  understanding: string;
  assumptions: string[];
  missingInformation: string[];
  risks: string[];
  contradictions: string[];
  scores: QualityScores;
  improvedPrompt: string;
}

export interface PromptLogItem {
  id: string;
  projectId: string;
  timestamp: string;
  rawPrompt: string;
  analysis: AnalysisResult;
  accepted?: boolean;
}

export interface AppSettings {
  llmProvider: LLMProvider;
  localEndpoint: string;
  localModelName: string;
  geminiModel: string;
  temperature: number;
  maxTokens: number;
  promptStyle: PromptStyle;
  systemPrompt: string;
  functionalSpecPrompt: string;
  exportPath: string;
  autoSave: boolean;
}
