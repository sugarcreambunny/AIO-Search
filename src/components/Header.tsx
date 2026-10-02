import React from 'react';
import { useMediaVaultStore } from '../lib/store/useMediaVaultStore';
import { AssetFilterTab } from '../types/media';
import {
  Search,
  X,
  Archive,
  Settings,
  Sparkles,
  Camera,
  Video,
  Music,
  Smile,
  Sticker,
  Layers,
  RotateCcw,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    filters,
    setQuery,
    setTab,
    performSearch,
    clearFilters,
    binAssets,
    setBinOpen,
    setSettingsOpen,
    apiKeys,
    isLoading,
  } = useMediaVaultStore();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const tabs: { id: AssetFilterTab; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Assets', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'photos', label: 'Photos', icon: <Camera className="w-3.5 h-3.5" /> },
    { id: 'videos', label: 'Videos', icon: <Video className="w-3.5 h-3.5" /> },
    { id: 'audio', label: 'Audio / SFX', icon: <Music className="w-3.5 h-3.5" /> },
    { id: 'gifs', label: 'GIFs', icon: <Smile className="w-3.5 h-3.5" /> },
    { id: 'stickers', label: 'Stickers', icon: <Sticker className="w-3.5 h-3.5" /> },
  ];

  const hasActiveFilters =
    Boolean(filters.query) ||
    filters.aspectRatio !== 'all' ||
    filters.audioDuration !== 'all' ||
    filters.giphyRating !== 'all';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Top Bar: Brand, Search, Action Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  MediaVault
                </h1>
                <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-semibold">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                All-in-One Multi-Provider Media Engine
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setBinOpen(true)}
              className="relative p-2 rounded-xl bg-slate-800/80 text-slate-200 border border-slate-700"
            >
              <Archive className="w-4 h-4 text-cyan-400" />
              {binAssets.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {binAssets.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-200 border border-slate-700"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="w-full md:max-w-xl relative flex items-center">
          <div className="relative w-full flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search high-res photos, 4K b-roll, audio FX, loops, and GIFs..."
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-cyan-500 rounded-xl pl-10 pr-24 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all shadow-inner"
            />
            {filters.query && (
              <button
                onClick={() => {
                  setQuery('');
                  performSearch();
                }}
                className="absolute right-14 text-slate-500 hover:text-slate-300 p-1 transition-colors"
                title="Clear text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => performSearch()}
              disabled={isLoading}
              className="absolute right-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white shadow-sm transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>

        {/* Desktop Actions: Bin & Settings */}
        <div className="hidden md:flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
              title="Reset search & filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          {/* Project Bin Button */}
          <button
            onClick={() => setBinOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all cursor-pointer group"
          >
            <Archive className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Project Bin</span>
            <span className="font-mono text-xs px-1.5 py-0.2 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
              {binAssets.length}
            </span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="API Key Vault & Settings"
          >
            <Settings className="w-4 h-4" />
            <span className="text-xs font-medium">Vault</span>
            {apiKeys.useDemoMode && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
            )}
          </button>
        </div>
      </div>

      {/* Media Type Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 border-t border-slate-800/60 flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1 py-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                filters.tab === tab.id
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
