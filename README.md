# Prompt Optimizer

> AI driven prompt compiler and session workspace that transforms informal user requests into structured, implementation-ready prompts for AI coding assistants.

<img width="1899" height="894" alt="Screenshot 2026-07-24 142234" src="https://github.com/user-attachments/assets/29a68eb3-952d-4f31-8b79-0e41419a8406" />


---

## 🌟 Overview & Functions

**Prompt Optimizer** is a full-stack, editorial-style workspace designed to bridge the gap between vague, natural language software requests and high-clarity, context-aware prompt specifications for modern AI coding agents.

**Prompt Templating** for specific tasks and target environments.
<img width="400" height="300" alt="Screenshot 2026-07-24 142718" src="https://github.com/user-attachments/assets/48457bbf-d8ec-4c44-a365-43496272d1bd" /> <img width="400" height="300" alt="Screenshot 2026-07-24 142725" src="https://github.com/user-attachments/assets/a70b7235-64b6-4095-9ba2-f79f086f591c" />



### Key Functional Capabilities

1. **AI-Powered Prompt Refinement**:
   - Analyzes raw, informal text input using server-side Gemini 3.6 Flash / Pro models.
   - Evaluates key dimensions: **Readiness**, **Clarity**, **Specificity**, **Architecture**, and **Completeness**.
   - Generates an improved, production-ready prompt optimized for single-pass LLM execution.

2. **Multi-Style Directives**:
   - **Architectural Specification**: Detailed breakdown with explicit stack declarations, data flow, and file targets.
   - **Concise Execution**: Focused, direct task instructions with minimal preamble.
   - **Behavior Driven Development (BDD)**: Expressed through Gherkin-style `Given-When-Then` scenarios.
   - **Chain of Thought**: Explicit step-by-step reasoning and verification phases.

3. **Workspace & Project Profiles**:
   - Manage distinct project contexts including tech stacks (e.g., React, Express, Tailwind, TypeScript), system architectures, goals, and known constraints.
   - Inject live project metadata directly into the optimization pipeline for hyper-contextualized results.

4. **Functional Specification (`functional.md`) Generator**:
   - Compiles session prompt history and architectural decisions into a standardized, complete functional specification markdown document.
   - One-click file saving directly to the workspace server disk or local browser download.
  
   <img width="873" height="718" alt="Screenshot 2026-07-24 142315" src="https://github.com/user-attachments/assets/5187a256-2c84-44e3-833d-3951d7e74ecb" />


5. **Local & Cloud Model Engine Switching**:
   - Seamlessly toggle between Google AI Studio server-side Gemini endpoints and local OpenAI-compatible REST endpoints (e.g., LM Studio or Ollama running on `localhost:1234`).
   - Ping & connection testing utility to verify endpoint availability before running queries.

   <img width="652" height="608" alt="Screenshot 2026-07-24 142249" src="https://github.com/user-attachments/assets/9e613193-e0b4-434a-bab0-7229bb0c267e" />


6. **Historical Archive Log**:
   - Persistent prompt logs allowing session retrieval, search, one-click reload into editor, and comparative review.

---

## 💡 Key Benefits

- **Eliminates AI Slop & Ambiguity**: Transforms ambiguous requests (e.g., *"Make a dashboard"*) into clear, targeted instructions with explicit constraints and technical boundaries.
- **Reduces Iteration Cycles**: Solves task requirements in a single turn by providing complete requirements up front.
- **Project Context Continuity**: Persists workspace parameters so every prompt is generated with full awareness of existing stack choices and constraints.
- **Offline & Local LLM Support**: Supports local LLM instances (LM Studio / Ollama) alongside cloud-based Gemini APIs.
- **Clean Editorial Aesthetic**: Thoughtfully styled with high-contrast neutral themes, warm accent typography, and responsive, scannable panel layouts.

---

## ⚙️ Prerequisites & Setup

### Prerequisites

- **Node.js**: v18.x or v20.x or higher
- **npm**: v9.x or higher
- **Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)

---

## 🚀 Installation Instructions

1. **Clone or Extract the Repository**:
   ```bash
   git clone <repository-url>
   cd prompt-optimizer
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

   Add your secret Gemini API key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   APP_URL="http://localhost:3000"
   ```

---

## 💻 Running the Application

### Development Mode

Start the integrated Express server with Vite middleware in development mode:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Production Build & Execution

To bundle the client SPA and compile the TypeScript backend server into `dist/server.cjs`:

```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Motion Animations
- **Backend**: Express 4, `tsx` / `esbuild` server runner
- **AI SDK**: `@google/genai` (Server-side Gemini 3.6 Flash / Pro)
- **Language**: TypeScript (strict type definitions)
