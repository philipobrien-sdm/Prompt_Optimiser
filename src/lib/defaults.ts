import { AppSettings, Project, PromptStyle, AppRequirementItem } from '../types';

export const DEFAULT_APP_REQUIREMENTS: AppRequirementItem[] = [
  {
    id: 'session_json_export_import',
    name: 'Saving & Loading App Sessions via JSON',
    category: 'Persistence',
    description: 'Export and restore entire app state, prompt history, and settings to/from structured .json files.',
    promptInstruction: 'Implement full session import and export capability using structured JSON files with schema validation upon loading.',
    defaultEnabled: true,
  },
  {
    id: 'local_llm_connectivity',
    name: 'Connectivity to Local LLMs (LM Studio / Ollama)',
    category: 'Connectivity',
    description: 'Support local REST LLM endpoints on localhost:1234 or custom base URLs with ping testing.',
    promptInstruction: 'Ensure full compatibility with local OpenAI-compatible REST LLM endpoints (LM Studio / Ollama on port 1234) with ping healthchecks.',
    defaultEnabled: true,
  },
  {
    id: 'clear_app_cache',
    name: 'Clearing App Cache (Blank Slate Reset)',
    category: 'State & Cache',
    description: 'Provide an active hard reset action to clear cached state and restore pristine defaults.',
    promptInstruction: 'Include an explicit "Reset / Clear App Cache" mechanism to wipe cached browser state and restore clean initial defaults upon confirmation.',
    defaultEnabled: true,
  },
  {
    id: 'input_error_handling',
    name: 'Input Error Handling & Form Validation',
    category: 'Error Handling',
    description: 'Validate text inputs, check for empty or invalid strings, and display clear visual error messages.',
    promptInstruction: 'Implement robust frontend input validation, trimming empty user input, verifying length bounds, and providing accessible error feedback.',
    defaultEnabled: true,
  },
  {
    id: 'json_parse_handling',
    name: 'JSON Parse Error Safeguards & Regex Extraction',
    category: 'Error Handling',
    description: 'Safely parse JSON responses using try-catch blocks and fallback markdown codeblock extractors.',
    promptInstruction: 'Guard all JSON parsing operations with try-catch blocks, regex extraction for markdown codeblocks (```json), and safe fallbacks.',
    defaultEnabled: true,
  },
  {
    id: 'llm_failure_retry_handling',
    name: 'LLM Call Failure & Timeout Retry Handling',
    category: 'Error Handling',
    description: 'Detect timeouts, handle API failures gracefully, and provide deterministic offline fallback.',
    promptInstruction: 'Implement network timeout abortion, automatic retry handlers, and graceful deterministic fallback if LLM endpoints fail or rate-limit.',
    defaultEnabled: true,
  },
  {
    id: 'typescript_type_safety',
    name: 'TypeScript Strict Type Safety & Clean Interfaces',
    category: 'Architecture & Types',
    description: 'Enforce strict TypeScript types, explicit interface definitions, and zero implicit any.',
    promptInstruction: 'Maintain strict TypeScript type safety, explicit interface declarations in src/types.ts, and guard against undefined property access.',
    defaultEnabled: true,
  },
  {
    id: 'responsive_layout_rules',
    name: 'Responsive Mobile-First Layout & Touch Targets',
    category: 'Architecture & Types',
    description: 'Ensure 44px+ touch targets, fluid flex/grid layouts, and responsive panel stacking.',
    promptInstruction: 'Adhere to mobile-first responsive Tailwind layouts, minimum 44px touch targets on controls, and fluid container overflow handling.',
    defaultEnabled: true,
  },
  {
    id: 'offline_fallback_mode',
    name: 'Offline Network Degraded Fallback Engine',
    category: 'Connectivity',
    description: 'Detect offline status and offer local deterministic prompt processing when disconnected.',
    promptInstruction: 'Provide an offline fallback mode that uses local browser storage and rule-based processing when internet or remote LLM server is unreachable.',
    defaultEnabled: true,
  },
];

export const DEFAULT_SYSTEM_PROMPT = `You are Prompt Optimizer, an expert prompt engineering assistant for AI coding tools (such as Google AI Studio, Gemini, Claude Code, Cursor, Copilot).

Your goal is to transform informal, incomplete, or ambiguous user software requests into structured, implementation-ready prompts.

Rules:
1. NEVER silently invent requirements or add unsolicited features.
2. Clearly distinguish between confirmed facts, inferred assumptions, and missing information.
3. Identify potential implementation risks, architecture conflicts, or breaking changes.
4. Produce deterministic, highly structured outputs.
5. Generate an improved prompt using explicit language, numbered tasks, stated assumptions, and clear constraints.
6. Assess prompt quality metrics objectively (clarity, completeness, consistency, specificity, readiness 0-100).`;

export const DEFAULT_FUNCTIONAL_SPEC_PROMPT = `You are an expert software architect. Based on the provided project context and prompt history, generate a comprehensive, structured Functional Specification document in Markdown (functional.md).

Include the following sections:
1. Purpose & Overview
2. System Architecture & Tech Stack
3. Core Features & User Workflows
4. Data Models & State Management
5. Non-Functional Requirements & Constraints
6. Key Technical Decisions & History

Keep the specifications precise, unambiguous, and directly derived from confirmed project context.`;

export const DEFAULT_SETTINGS: AppSettings = {
  llmProvider: 'gemini',
  localEndpoint: 'http://localhost:1234/v1',
  localModelName: 'qwen2.5-coder-7b-instruct',
  geminiModel: 'gemini-3.6-flash',
  temperature: 0.2,
  maxTokens: 4096,
  promptStyle: 'google_ai_studio',
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  functionalSpecPrompt: DEFAULT_FUNCTIONAL_SPEC_PROMPT,
  exportPath: './exports',
  autoSave: true,
  activeRequirementIds: DEFAULT_APP_REQUIREMENTS.map((r) => r.id),
};

export const INITIAL_PROJECT: Project = {
  id: 'proj-default-01',
  name: 'AI Studio Web App',
  description: 'Full-stack React & Express web application built with Vite and Gemini API',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  context: {
    technologyStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Express', 'Vite', '@google/genai'],
    architecture: 'Single-Page React frontend with Express server proxy for AI API calls',
    currentGoals: ['Implement Prompt Optimizer v0.1 specification', 'Provide deterministic prompt refactoring'],
    knownConstraints: ['Port 3000 hardcoded', 'Must keep API keys server-side', 'Client-side SPA with Express proxy'],
    recentFeatures: ['Project workspace initialization', 'Session context persistence', 'Settings panel'],
    keyDecisions: ['Use local storage + server backend file storage for projects', 'Standardized 5-stage prompt pipeline'],
  }
};

export const PROMPT_TEMPLATES = [
  {
    title: 'Add Settings Page',
    category: 'Feature request',
    prompt: 'Add a settings page that allows changing the model and saving preferences.'
  },
  {
    title: 'Fix State Synchronization Bug',
    category: 'Bug fix',
    prompt: 'The session context is not updating when a user switches projects. Fix this state sync issue.'
  },
  {
    title: 'Refactor API Handler',
    category: 'Refactor',
    prompt: 'Refactor the backend route handlers in server.ts to extract LLM call logic into a reusable service module.'
  },
  {
    title: 'Add Export to Markdown',
    category: 'Feature request',
    prompt: 'Add an export button that generates functional.md from current session context and allows downloading it.'
  },
  {
    title: 'Optimize Tailwind Layout',
    category: 'UI & Styling',
    prompt: 'Improve the responsive desktop 4-pane grid layout with adjustable panel headers and collapsible sidebar.'
  }
];

export const PROMPT_STYLE_DESCRIPTIONS: Record<PromptStyle, { name: string; tag: string; description: string }> = {
  google_ai_studio: {
    name: 'Google AI Studio',
    tag: 'Structured AI Studio Format',
    description: 'Formatted with clear Intent, Scope translation, Explicit Non-Goals, and Step-by-Step Task Execution suitable for Google AI Studio agent prompts.'
  },
  gemini: {
    name: 'Gemini Direct',
    tag: 'Gemini System / Task Format',
    description: 'Direct task prompt optimized for Gemini models with system instructions, context block, and explicit output schema.'
  },
  claude_code: {
    name: 'Claude Code',
    tag: 'Claude CLI & Artifact Format',
    description: 'Concise specification style with explicit context, numbered architectural constraints, and step-by-step verification criteria.'
  },
  cursor: {
    name: 'Cursor / Copilot Workspace',
    tag: 'Cursor Rules & System Rules',
    description: 'Compact code-generation prompt style highlighting file boundaries, target types, and edge cases.'
  },
  copilot: {
    name: 'GitHub Copilot',
    tag: 'Copilot Chat & Inline Style',
    description: 'Task-focused prompt layout with clear input signature, expected types, and step breakdown.'
  }
};
