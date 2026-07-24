import { AppSettings, Project, PromptLogItem } from '../types';
import { DEFAULT_SETTINGS, INITIAL_PROJECT } from './defaults';

const SETTINGS_KEY = 'prompt_optimizer_settings';
const PROJECTS_KEY = 'prompt_optimizer_projects';
const ACTIVE_PROJECT_ID_KEY = 'prompt_optimizer_active_project_id';
const PROMPT_HISTORY_PREFIX = 'prompt_optimizer_history_';

export function loadStoredSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (e) {
    console.error('Failed to load settings from storage', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to storage', e);
  }
}

export function loadStoredProjects(): Project[] {
  try {
    const data = localStorage.getItem(PROJECTS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load projects from storage', e);
  }
  return [INITIAL_PROJECT];
}

export function saveStoredProjects(projects: Project[]): void {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects to storage', e);
  }
}

export function loadActiveProjectId(): string {
  try {
    return localStorage.getItem(ACTIVE_PROJECT_ID_KEY) || INITIAL_PROJECT.id;
  } catch (e) {
    return INITIAL_PROJECT.id;
  }
}

export function saveActiveProjectId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROJECT_ID_KEY, id);
  } catch (e) {
    console.error('Failed to save active project id', e);
  }
}

export function loadPromptHistory(projectId: string): PromptLogItem[] {
  try {
    const data = localStorage.getItem(`${PROMPT_HISTORY_PREFIX}${projectId}`);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load prompt history', e);
  }
  return [];
}

export function savePromptHistory(projectId: string, history: PromptLogItem[]): void {
  try {
    localStorage.setItem(`${PROMPT_HISTORY_PREFIX}${projectId}`, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save prompt history', e);
  }
}
