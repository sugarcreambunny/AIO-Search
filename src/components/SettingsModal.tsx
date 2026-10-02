import React, { useState } from 'react';
import { useMediaVaultStore } from '../lib/store/useMediaVaultStore';
import { testApiKey } from '../lib/api/searchAggregator';
import { MediaSource } from '../types/media';
import {
  X,
  Key,
  ShieldCheck,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Lock,
} from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

interface KeyValidationState {
  status: 'idle' | 'testing' | 'valid' | 'invalid';
  message?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { apiKeys, setApiKeys, addToast, performSearch } = useMediaVaultStore();

  const [keysForm, setKeysForm] = useState({
    pexels: apiKeys.pexels || '',
    pixabay: apiKeys.pixabay || '',
    giphy: apiKeys.giphy || '',
    freesound: apiKeys.freesound || '',
    useDemoMode: apiKeys.useDemoMode ?? true,
  });

  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [validationStates, setValidationStates] = useState<
    Record<MediaSource, KeyValidationState>
  >({
    pexels: { status: 'idle' },
    pixabay: { status: 'idle' },
    giphy: { status: 'idle' },
    freesound: { status: 'idle' },
  });

  const toggleVisibility = (provider: string) => {
    setVisibleKeys((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleValidate = async (provider: MediaSource) => {
    const key = keysForm[provider];
    if (!key.trim()) {
      setValidationStates((prev) => ({
        ...prev,
        [provider]: { status: 'invalid', message: 'Please enter a key first' },
      }));
      return;
    }

    setValidationStates((prev) => ({
      ...prev,
      [provider]: { status: 'testing' },
    }));

    const result = await testApiKey(provider, key);
    setValidationStates((prev) => ({
      ...prev,
      [provider]: {
        status: result.valid ? 'valid' : 'invalid',
        message: result.message,
      },
    }));
  };

  const handleSave = () => {
    setApiKeys(keysForm);
    addToast('Settings Saved', 'Your API keys and mode have been updated in LocalStorage.', 'success');
    performSearch();
    onClose();
  };

  const providerInfo: {
    id: MediaSource;
    name: string;
    description: string;
    url: string;
    placeholder: string;
  }[] = [
    {
      id: 'pexels',
      name: 'Pexels API',
      description: 'Photos and 4K/HD stock video search',
      url: 'https://www.pexels.com/api/',
      placeholder: 'Paste your Pexels Authorization key',
    },
    {
      id: 'pixabay',
      name: 'Pixabay API',
      description: 'Photos, vector illustrations, and videos',
      url: 'https://pixabay.com/api/docs/',
      placeholder: 'Paste your Pixabay API key',
    },
    {
      id: 'giphy',
      name: 'GIPHY API',
      description: 'Animated GIFs and sticker reactions',
      url: 'https://developers.giphy.com/docs/api/',
      placeholder: 'Paste your GIPHY SDK key',
    },
    {
      id: 'freesound',
      name: 'Freesound API',
      description: 'Sound effects, foley, and audio clips',
      url: 'https://freesound.org/apiv2/apply/',
      placeholder: 'Paste your Freesound client token',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                API Key Vault & Settings
                <span className="text-[11px] font-normal text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-800/60 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  LocalStorage Secured
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Connect external providers or explore with curated Demo Mode
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Demo Mode Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-slate-900 border border-cyan-900/50 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                  Curated Demo Mode
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Recommended for instant testing
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  When enabled, MediaVault delivers rich, high-resolution stock photos, real playing videos, audio clips with waveforms, and animated GIFs without needing external API keys.
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={keysForm.useDemoMode}
                onChange={(e) =>
                  setKeysForm({ ...keysForm, useDemoMode: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          {/* Provider Key Inputs */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              External Provider Credentials
            </h4>

            {providerInfo.map((p) => {
              const valState = validationStates[p.id];
              const isVisible = visibleKeys[p.id];
              const currentVal = keysForm[p.id];

              return (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-2">
                        {p.description}
                      </span>
                    </div>

                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <span>Get Free Key</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Input field + actions */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type={isVisible ? 'text' : 'password'}
                        value={currentVal}
                        onChange={(e) => {
                          setKeysForm({ ...keysForm, [p.id]: e.target.value });
                          setValidationStates((prev) => ({
                            ...prev,
                            [p.id]: { status: 'idle' },
                          }));
                        }}
                        placeholder={p.placeholder}
                        className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-500 pr-10 outline-none focus:border-cyan-500 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => toggleVisibility(p.id)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {isVisible ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Validate Button */}
                    <button
                      type="button"
                      onClick={() => handleValidate(p.id)}
                      disabled={valState.status === 'testing' || !currentVal.trim()}
                      className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-40 transition-colors shrink-0 flex items-center gap-1.5"
                    >
                      {valState.status === 'testing' ? (
                        <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5" />
                      )}
                      <span>Validate</span>
                    </button>
                  </div>

                  {/* Validation Status Message */}
                  {valState.status !== 'idle' && (
                    <div className="flex items-center gap-1.5 text-xs pt-0.5">
                      {valState.status === 'valid' && (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">
                            {valState.message || 'Key connected and valid!'}
                          </span>
                        </>
                      )}
                      {valState.status === 'invalid' && (
                        <>
                          <AlertCircle className="w-4 h-4 text-rose-400" />
                          <span className="text-rose-400">
                            {valState.message || 'Validation failed. Check your key.'}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>Keys are never transmitted to any third-party server</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 rounded-xl shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
