import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Ensure data storage directories exist
const DATA_DIR = path.join(process.cwd(), 'data');
const PROJECTS_DIR = path.join(DATA_DIR, 'projects');
const EXPORTS_DIR = path.join(DATA_DIR, 'exports');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(PROJECTS_DIR)) fs.mkdirSync(PROJECTS_DIR, { recursive: true });
if (!fs.existsSync(EXPORTS_DIR)) fs.mkdirSync(EXPORTS_DIR, { recursive: true });

// Initialize Gemini Client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || 'MISSING_KEY',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiKeyAvailable: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Ping endpoint to test LLM connection
app.post('/api/llm/ping', async (req, res) => {
  const { provider, localEndpoint, localModelName, geminiModel } = req.body;

  if (provider === 'local_lm_studio') {
    try {
      const targetUrl = `${localEndpoint.replace(/\/+$/, '')}/models`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(targetUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        return res.json({
          ok: true,
          provider: 'Local LLM (LM Studio)',
          model: localModelName || 'Connected',
          message: `Successfully connected to ${localEndpoint}`,
          modelsAvailable: data?.data?.map((m: any) => m.id) || [],
        });
      } else {
        return res.json({
          ok: false,
          provider: 'Local LLM (LM Studio)',
          message: `Local LLM returned status ${response.status}`,
        });
      }
    } catch (err: any) {
      return res.json({
        ok: false,
        provider: 'Local LLM (LM Studio)',
        message: `Could not connect to ${localEndpoint}: ${err.message || 'Offline or CORS/network blocked'}`,
      });
    }
  } else {
    // Gemini API
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          ok: false,
          provider: 'Gemini API',
          message: 'GEMINI_API_KEY is not configured in secrets.',
        });
      }
      const ai = getGeminiClient();
      const testModel = geminiModel || 'gemini-3.6-flash';
      const pingRes = await ai.models.generateContent({
        model: testModel,
        contents: 'Reply with the single word: READY',
      });

      return res.json({
        ok: true,
        provider: 'Gemini API',
        model: testModel,
        message: `Successfully connected to Gemini API (${testModel})`,
        sampleResponse: pingRes.text?.trim(),
      });
    } catch (err: any) {
      return res.json({
        ok: false,
        provider: 'Gemini API',
        message: `Gemini API ping error: ${err.message || 'Unknown error'}`,
      });
    }
  }
});

// Fallback Deterministic Offline Analyzer if LLM is unavailable
function generateOfflineAnalysis(rawPrompt: string, projectContext: any) {
  const text = rawPrompt.toLowerCase();
  let intent = 'Feature request';
  if (text.includes('fix') || text.includes('bug') || text.includes('error') || text.includes('crash')) intent = 'Bug fix';
  else if (text.includes('refactor') || text.includes('clean') || text.includes('restructure')) intent = 'Refactor';
  else if (text.includes('style') || text.includes('ui') || text.includes('css') || text.includes('layout')) intent = 'UI & Styling';
  else if (text.includes('test')) intent = 'Testing';
  else if (text.includes('deploy')) intent = 'Deployment';
  else if (text.includes('perf') || text.includes('speed')) intent = 'Performance';
  else if (text.includes('arch') || text.includes('database') || text.includes('schema')) intent = 'Architecture';

  const stackStr = projectContext?.technologyStack?.join(', ') || 'React, TypeScript, Express';

  const analysis = {
    intent,
    understanding: `The user wants to implement: "${rawPrompt.trim()}". This request addresses ${intent.toLowerCase()} within the ${projectContext?.architecture || 'application framework'}.`,
    assumptions: [
      `Assumes application is running on ${stackStr}.`,
      `Assumes state changes must persist within the current session context.`,
      `Inferred that standard UI accessibility and responsive layout patterns apply.`
    ],
    missingInformation: [
      `Exact state handling strategy or error recovery behavior if operations fail.`,
      `Whether mock fallbacks or real backend API integration is expected for this specific action.`
    ],
    risks: [
      `Potential regression in adjacent state handlers if component boundaries are shared.`,
      `Ensure API endpoints guard secret keys and handle missing credentials gracefully.`
    ],
    contradictions: [],
    scores: {
      clarity: rawPrompt.length > 50 ? 82 : 55,
      completeness: rawPrompt.length > 100 ? 78 : 48,
      consistency: 85,
      specificity: rawPrompt.length > 80 ? 75 : 50,
      ambiguity: rawPrompt.length < 40 ? 65 : 25,
      readiness: rawPrompt.length > 60 ? 80 : 52,
    },
    improvedPrompt: `[ROLE & CONTEXT]
You are a senior full-stack engineer implementing a feature in a ${stackStr} codebase.
Current Architecture: ${projectContext?.architecture || 'Full-stack Web App'}

[PRIMARY TASK]
${rawPrompt.trim()}

[EXPLICIT REQUIREMENTS]
1. Implement the requested functional changes cleanly without altering unrelated visual themes or navigation structures.
2. Maintain strict separation between UI presentation components and server API logic.
3. Handle potential error cases gracefully with clear status feedback to the user.
4. Ensure all new components strictly follow existing project TypeScript interfaces and state management conventions.

[CONSTRAINTS & NON-GOALS]
- Do NOT add unrequested visual tabs, marketing banners, or unsolicited sidebars.
- Ensure all environment credentials remain hidden on the server side.
- Verify full build compilation without syntax or lint errors.`
  };

  return analysis;
}

// Stage 1-5 Prompt Processing Pipeline Route
app.post('/api/llm/analyze-prompt', async (req, res) => {
  const { rawPrompt, projectContext, settings } = req.body;

  if (!rawPrompt || typeof rawPrompt !== 'string' || !rawPrompt.trim()) {
    return res.status(400).json({ error: 'rawPrompt is required' });
  }

  const provider = settings?.llmProvider || 'gemini';
  const systemPrompt = settings?.systemPrompt || 'You are Prompt Optimizer...';
  const style = settings?.promptStyle || 'google_ai_studio';

  const pipelineInstruction = `${systemPrompt}

You must process the user's software request through the following 5 stages:
Stage 1: Intent Detection (Identify one of: Feature request, Bug fix, Refactor, Architecture, UI & Styling, Testing, Documentation, Deployment, Performance, Research)
Stage 2: Context Retrieval (Use provided project context)
Stage 3: Prompt Analysis (Identify understanding, explicit assumptions, missing info/ambiguities, risks, and contradictions)
Stage 4: Prompt Rewriting (Produce a structured, implementation-ready prompt formatted for ${style} style)
Stage 5: Quality Assessment (Scores 0-100 for clarity, completeness, consistency, specificity, ambiguity, readiness)

Project Context:
- Tech Stack: ${(projectContext?.technologyStack || []).join(', ')}
- Architecture: ${projectContext?.architecture || 'Full-stack'}
- Current Goals: ${(projectContext?.currentGoals || []).join('; ')}
- Known Constraints: ${(projectContext?.knownConstraints || []).join('; ')}
- Recent Features: ${(projectContext?.recentFeatures || []).join('; ')}
- Key Decisions: ${(projectContext?.keyDecisions || []).join('; ')}

User Request:
"${rawPrompt.trim()}"

OUTPUT REQUIREMENTS:
You MUST respond with a valid JSON object matching this schema EXACTLY:
{
  "intent": "Feature request", // or Bug fix, Refactor, Architecture, UI & Styling, Testing, Documentation, Deployment, Performance, Research
  "understanding": "Short paragraph summarizing intent...",
  "assumptions": ["Assumption 1...", "Assumption 2..."],
  "missingInformation": ["Question 1...", "Missing detail 2..."],
  "risks": ["Risk 1...", "Risk 2..."],
  "contradictions": [], // Any conflicting goals or tech constraints
  "scores": {
    "clarity": 85,
    "completeness": 75,
    "consistency": 90,
    "specificity": 80,
    "ambiguity": 20,
    "readiness": 82
  },
  "improvedPrompt": "Full structured improved prompt text..."
}`;

  if (provider === 'local_lm_studio') {
    try {
      const endpoint = `${(settings?.localEndpoint || 'http://localhost:1234/v1').replace(/\/+$/, '')}/chat/completions`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const fetchRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: settings?.localModelName || 'local-model',
          messages: [
            { role: 'system', content: 'You are a JSON-only prompt optimizer engine.' },
            { role: 'user', content: pipelineInstruction }
          ],
          temperature: settings?.temperature ?? 0.2,
          max_tokens: settings?.maxTokens ?? 3000,
        })
      });
      clearTimeout(timeout);

      if (!fetchRes.ok) {
        throw new Error(`Local LLM HTTP ${fetchRes.status}`);
      }

      const jsonResult = await fetchRes.json();
      const content = jsonResult?.choices?.[0]?.message?.content || '';

      // Try parsing JSON out of codeblock or raw response
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return res.json({ source: 'local_lm_studio', analysis: parsed });
      } else {
        throw new Error('Local LLM response did not contain valid JSON structure');
      }
    } catch (err: any) {
      console.warn('Local LLM call failed or unavailable, falling back to deterministic offline analyzer:', err.message);
      const fallback = generateOfflineAnalysis(rawPrompt, projectContext);
      return res.json({ source: 'offline_fallback', analysis: fallback, warning: `Local LLM unavailable (${err.message}). Used deterministic offline prompt optimizer engine.` });
    }
  } else {
    // Gemini Provider
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY not configured');
      }
      const ai = getGeminiClient();
      const model = settings?.geminiModel || 'gemini-3.6-flash';

      const geminiRes = await ai.models.generateContent({
        model,
        contents: pipelineInstruction,
        config: {
          temperature: settings?.temperature ?? 0.2,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intent: { type: Type.STRING },
              understanding: { type: Type.STRING },
              assumptions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              missingInformation: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              risks: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              contradictions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              scores: {
                type: Type.OBJECT,
                properties: {
                  clarity: { type: Type.NUMBER },
                  completeness: { type: Type.NUMBER },
                  consistency: { type: Type.NUMBER },
                  specificity: { type: Type.NUMBER },
                  ambiguity: { type: Type.NUMBER },
                  readiness: { type: Type.NUMBER }
                },
                required: ['clarity', 'completeness', 'consistency', 'specificity', 'ambiguity', 'readiness']
              },
              improvedPrompt: { type: Type.STRING }
            },
            required: ['intent', 'understanding', 'assumptions', 'missingInformation', 'risks', 'contradictions', 'scores', 'improvedPrompt']
          }
        }
      });

      const textOutput = geminiRes.text;
      if (textOutput) {
        const parsed = JSON.parse(textOutput);
        return res.json({ source: 'gemini', analysis: parsed });
      } else {
        throw new Error('Empty text from Gemini');
      }
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to deterministic offline analyzer:', err.message);
      const fallback = generateOfflineAnalysis(rawPrompt, projectContext);
      return res.json({ source: 'offline_fallback', analysis: fallback, warning: `Gemini API call unavailable (${err.message}). Used deterministic offline prompt optimizer engine.` });
    }
  }
});

// Functional Spec Exporter Route
app.post('/api/llm/export-spec', async (req, res) => {
  const { project, history, settings } = req.body;

  const specPrompt = settings?.functionalSpecPrompt || 'Generate functional.md markdown specification...';

  const contextText = `
Project Name: ${project?.name || 'Untitled Project'}
Description: ${project?.description || 'N/A'}
Tech Stack: ${(project?.context?.technologyStack || []).join(', ')}
Architecture: ${project?.context?.architecture || 'N/A'}
Current Goals: ${(project?.context?.currentGoals || []).join('; ')}
Known Constraints: ${(project?.context?.knownConstraints || []).join('; ')}
Key Decisions: ${(project?.context?.keyDecisions || []).join('; ')}
Recent Features: ${(project?.context?.recentFeatures || []).join('; ')}

Prompts & Analysis History count: ${history?.length || 0}
Recent Prompt Summaries:
${(history || []).slice(-5).map((h: any, idx: number) => `[${idx+1}] Request: ${h.rawPrompt}\n    Intent: ${h.analysis?.intent}\n    Understanding: ${h.analysis?.understanding}`).join('\n\n')}
`;

  const fullPrompt = `${specPrompt}

Project Context & History:
${contextText}

Generate complete, rigorous Markdown for functional.md starting with "# Functional Specification: ${project?.name || 'Project'}"`;

  try {
    if (settings?.llmProvider === 'gemini' && process.env.GEMINI_API_KEY) {
      const ai = getGeminiClient();
      const geminiRes = await ai.models.generateContent({
        model: settings?.geminiModel || 'gemini-3.6-flash',
        contents: fullPrompt,
      });
      return res.json({ markdown: geminiRes.text });
    } else {
      // Local or Fallback spec generator
      const markdown = `# Functional Specification: ${project?.name || 'Project'}

## 1. Executive Summary
This document defines the functional behavior, technical architecture, and implementation decisions for **${project?.name || 'Project'}**.

## 2. System Architecture & Tech Stack
- **Primary Tech Stack**: ${(project?.context?.technologyStack || ['React', 'TypeScript', 'Express']).join(', ')}
- **Architecture Pattern**: ${project?.context?.architecture || 'Single-Page Application with server-side proxy layer'}
- **Known Constraints**:
${(project?.context?.knownConstraints || []).map((c: string) => `  * ${c}`).join('\n')}

## 3. Confirmed Goals & Features
${(project?.context?.currentGoals || []).map((g: string) => `- **Goal**: ${g}`).join('\n')}

### Recent Features Implemented
${(project?.context?.recentFeatures || []).map((f: string) => `- ${f}`).join('\n')}

## 4. Architectural & Design Decisions
${(project?.context?.keyDecisions || []).map((d: string) => `- ${d}`).join('\n')}

## 5. Development Session History
Total Prompts Processed: ${history?.length || 0}
${(history || []).map((item: any, i: number) => `
### Session Prompt #${i + 1} (${new Date(item.timestamp).toLocaleString()})
* **Intent**: ${item.analysis?.intent || 'General'}
* **Raw Request**: "${item.rawPrompt}"
* **Understanding**: ${item.analysis?.understanding || ''}
* **Accepted Assumptions**: ${(item.analysis?.assumptions || []).join('; ')}
`).join('\n')}

---
*Generated automatically by Prompt Optimizer v0.1 on ${new Date().toLocaleDateString()}*`;

      return res.json({ markdown });
    }
  } catch (err: any) {
    return res.status(500).json({ error: `Failed to generate specification: ${err.message}` });
  }
});

// Projects storage API
app.get('/api/projects', (req, res) => {
  try {
    const files = fs.readdirSync(PROJECTS_DIR);
    const projects = files
      .filter(f => f.endsWith('.json'))
      .map(f => {
        try {
          const content = fs.readFileSync(path.join(PROJECTS_DIR, f), 'utf-8');
          return JSON.parse(content);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    res.json(projects);
  } catch (err) {
    res.json([]);
  }
});

app.post('/api/projects', (req, res) => {
  try {
    const project = req.body;
    if (!project?.id) return res.status(400).json({ error: 'Project ID required' });

    const filePath = path.join(PROJECTS_DIR, `${project.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2), 'utf-8');
    res.json({ ok: true, id: project.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Export functional.md file to server disk
app.post('/api/projects/:id/export-file', (req, res) => {
  try {
    const { filename = 'functional.md', content } = req.body;
    const savePath = path.join(EXPORTS_DIR, filename);
    fs.writeFileSync(savePath, content, 'utf-8');
    res.json({ ok: true, path: savePath });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Setup Vite Dev Middleware or Static Production Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Prompt Optimizer Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
