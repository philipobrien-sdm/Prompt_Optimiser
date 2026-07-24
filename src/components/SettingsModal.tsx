import React, { useState } from 'react';
import { 
  X, 
  Save, 
  RotateCcw, 
  Cpu, 
  Sparkles, 
  Sliders, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Server
} from 'lucide-react';
import { AppSettings, LLMProvider, PromptStyle } from '../types';
import { DEFAULT_SETTINGS, PROMPT_STYLE_DESCRIPTIONS } from '../lib/defaults';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
  onClose: () => void;
  onPing: (testSettings: AppSettings) => Promise<any>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSave,
  onClose,
  onPing,
}) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [activeTab, setActiveTab] = useState<'provider' | 'prompts' | 'general'>('provider');
  const [pingStatus, setPingStatus] = useState<any>(null);
  const [isPinging, setIsPinging] = useState(false);

  const handleTestPing = async () => {
    setIsPinging(true);
    setPingStatus(null);
    try {
      const res = await onPing(formData);
      setPingStatus(res);
    } catch (err: any) {
      setPingStatus({ ok: false, message: err.message || 'Ping failed' });
    } finally {
      setIsPinging(false);
    }
  };

  const handleReset = () => {
    setFormData(DEFAULT_SETTINGS);
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#1A1A1A] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#1A1A1A]">
        {/* Header */}
        <div className="p-6 border-b border-[#E0DED7] flex items-center justify-between bg-[#F9F8F6]">
          <div>
            <h3 className="font-serif text-xl font-bold italic uppercase tracking-tight text-[#1A1A1A]">
              Settings & Configurations
            </h3>
            <p className="text-[10px] font-mono text-[#888378] uppercase tracking-widest mt-0.5">
              LLM Engine & Workspace System Directives
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors border border-[#1A1A1A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E0DED7] bg-[#F2F0EB] px-6 text-[10px] font-mono uppercase tracking-widest font-bold">
          <button
            onClick={() => setActiveTab('provider')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'provider'
                ? 'border-[#A04A30] text-[#A04A30] bg-white'
                : 'border-transparent text-[#888378] hover:text-[#1A1A1A]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> LLM Provider
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'prompts'
                ? 'border-[#A04A30] text-[#A04A30] bg-white'
                : 'border-transparent text-[#888378] hover:text-[#1A1A1A]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> System Directives
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'general'
                ? 'border-[#A04A30] text-[#A04A30] bg-white'
                : 'border-transparent text-[#888378] hover:text-[#1A1A1A]'
            }`}
          >
            <Server className="w-3.5 h-3.5" /> System Defaults
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#1A1A1A] text-xs">
          {activeTab === 'provider' && (
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[#888378] mb-2 font-bold">
                  Active Model Engine
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, llmProvider: 'gemini' })}
                    className={`p-4 border text-left transition-all flex flex-col gap-1 ${
                      formData.llmProvider === 'gemini'
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : 'bg-[#F9F8F6] border-[#E0DED7] text-[#1A1A1A] hover:border-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-serif italic font-bold text-sm">
                      <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-[#A04A30]" /> Gemini API</span>
                      {formData.llmProvider === 'gemini' && <CheckCircle2 className="w-4 h-4 text-[#A04A30]" />}
                    </div>
                    <p className="text-[10px] font-sans opacity-80 mt-1">Google AI Studio server-side API integration</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, llmProvider: 'local_lm_studio' })}
                    className={`p-4 border text-left transition-all flex flex-col gap-1 ${
                      formData.llmProvider === 'local_lm_studio'
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : 'bg-[#F9F8F6] border-[#E0DED7] text-[#1A1A1A] hover:border-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-serif italic font-bold text-sm">
                      <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-[#A04A30]" /> LM Studio (Local)</span>
                      {formData.llmProvider === 'local_lm_studio' && <CheckCircle2 className="w-4 h-4 text-[#A04A30]" />}
                    </div>
                    <p className="text-[10px] font-sans opacity-80 mt-1">Local REST server on port 1234 or localhost</p>
                  </button>
                </div>
              </div>

              {formData.llmProvider === 'local_lm_studio' ? (
                <div className="space-y-3 bg-[#F9F8F6] p-4 border border-[#E0DED7]">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888378] mb-1 font-bold">
                      Base Endpoint URL
                    </label>
                    <input
                      type="text"
                      value={formData.localEndpoint}
                      onChange={(e) => setFormData({ ...formData, localEndpoint: e.target.value })}
                      className="w-full bg-white border border-[#E0DED7] p-2 font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                      placeholder="http://localhost:1234/v1"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888378] mb-1 font-bold">
                      Model Identifier
                    </label>
                    <input
                      type="text"
                      value={formData.localModelName}
                      onChange={(e) => setFormData({ ...formData, localModelName: e.target.value })}
                      className="w-full bg-white border border-[#E0DED7] p-2 font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                      placeholder="qwen2.5-coder-7b-instruct"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-[#F9F8F6] p-4 border border-[#E0DED7]">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888378] mb-1 font-bold">
                      Gemini Model Alias
                    </label>
                    <select
                      value={formData.geminiModel}
                      onChange={(e) => setFormData({ ...formData, geminiModel: e.target.value })}
                      className="w-full bg-white border border-[#E0DED7] p-2 font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    >
                      <option value="gemini-3.6-flash">gemini-3.6-flash (Fast & Recommended)</option>
                      <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep Reasoning)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Temperature & Max Tokens */}
              <div className="grid grid-cols-2 gap-4 bg-[#F9F8F6] p-4 border border-[#E0DED7]">
                <div>
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-[#888378] font-bold mb-1">
                    <span>Temperature</span>
                    <span className="text-[#A04A30] font-mono">{formData.temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                    className="w-full accent-[#A04A30]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888378] mb-1 font-bold">
                    Max Response Tokens
                  </label>
                  <input
                    type="number"
                    value={formData.maxTokens}
                    onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) || 2048 })}
                    className="w-full bg-white border border-[#E0DED7] p-2 font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </div>

              {/* Ping Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleTestPing}
                  disabled={isPinging}
                  className="border border-[#1A1A1A] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
                >
                  {isPinging ? <RefreshCw className="w-3.5 h-3.5 animate-spin inline mr-1 text-[#A04A30]" /> : <Server className="w-3.5 h-3.5 inline mr-1 text-[#A04A30]" />}
                  <span>Test Connection Endpoint</span>
                </button>

                {pingStatus && (
                  <div className={`text-xs font-mono font-bold ${pingStatus.ok ? 'text-[#1A1A1A]' : 'text-[#A04A30]'}`}>
                    {pingStatus.message || (pingStatus.ok ? 'Connected' : 'Connection Failed')}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'prompts' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888378] mb-1 font-bold">
                  Prompt Style Format
                </label>
                <select
                  value={formData.promptStyle}
                  onChange={(e) => setFormData({ ...formData, promptStyle: e.target.value as PromptStyle })}
                  className="w-full bg-[#F9F8F6] border border-[#E0DED7] p-2 text-xs font-serif text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                >
                  {(Object.keys(PROMPT_STYLE_DESCRIPTIONS) as PromptStyle[]).map((st) => (
                    <option key={st} value={st}>
                      {PROMPT_STYLE_DESCRIPTIONS[st].name} — {PROMPT_STYLE_DESCRIPTIONS[st].tag}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888378] mb-1 font-bold">
                  System Directive
                </label>
                <textarea
                  rows={6}
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                  className="w-full bg-[#F2F0EB] border border-[#E0DED7] p-3 font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888378] mb-1 font-bold">
                  Functional Spec Directive
                </label>
                <textarea
                  rows={5}
                  value={formData.functionalSpecPrompt}
                  onChange={(e) => setFormData({ ...formData, functionalSpecPrompt: e.target.value })}
                  className="w-full bg-[#F2F0EB] border border-[#E0DED7] p-3 font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] leading-relaxed"
                />
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888378] mb-1 font-bold">
                  Export Directory Path
                </label>
                <input
                  type="text"
                  value={formData.exportPath}
                  onChange={(e) => setFormData({ ...formData, exportPath: e.target.value })}
                  className="w-full bg-[#F9F8F6] border border-[#E0DED7] p-2 font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  placeholder="./exports"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F9F8F6] border border-[#E0DED7]">
                <div>
                  <span className="font-serif font-bold text-xs text-[#1A1A1A] block">Auto-Save Session State</span>
                  <span className="text-[10px] font-serif text-[#888378]">Persist history logs automatically after every optimization run.</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoSave}
                  onChange={(e) => setFormData({ ...formData, autoSave: e.target.checked })}
                  className="w-4 h-4 accent-[#A04A30]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#E0DED7] bg-[#F9F8F6] flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-[10px] uppercase font-bold tracking-widest text-[#888378] hover:text-[#1A1A1A] flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-[#1A1A1A] px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-[#A04A30] text-white px-5 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-[#863B24] transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
