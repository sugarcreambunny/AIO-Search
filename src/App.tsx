import React, { useEffect } from 'react';
import { useMediaVaultStore } from './lib/store/useMediaVaultStore';
import { Header } from './components/Header';
import { SearchFilters } from './components/SearchFilters';
import { MediaGrid } from './components/MediaGrid';
import { ProjectBinDrawer } from './components/ProjectBinDrawer';
import { SettingsModal } from './components/SettingsModal';
import { LightboxModal } from './components/LightboxModal';
import { RatioCropper } from './components/RatioCropper';
import { ToastContainer } from './components/ToastContainer';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  FolderKanban,
  FileArchive,
  Info,
} from 'lucide-react';

export default function App() {
  const {
    performSearch,
    isBinOpen,
    setBinOpen,
    isSettingsOpen,
    setSettingsOpen,
    lightboxAsset,
    setLightboxAsset,
    cropperAsset,
    setCropperAsset,
    apiKeys,
  } = useMediaVaultStore();

  // Load initial media results on app boot
  useEffect(() => {
    performSearch();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation & Global Search Header */}
      <Header />

      {/* Filter Bar with Provider Checkboxes & Sort */}
      <SearchFilters />

      {/* Main Content: Masonry Grid of Assets */}
      <main className="flex-1">
        <MediaGrid />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">MediaVault</span>
            <span>—</span>
            <span>All-in-One Multi-Provider Search & Management Tool</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setSettingsOpen(true)}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>API Vault</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setBinOpen(true)}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <FileArchive className="w-3.5 h-3.5 text-indigo-400" />
              <span>ZIP Export</span>
            </button>
            <span>•</span>
            <span className="font-mono text-[11px] text-slate-500">
              Pexels • Pixabay • GIPHY • Freesound
            </span>
          </div>
        </div>
      </footer>

      {/* Project Bin Slide-Out Drawer */}
      {isBinOpen && <ProjectBinDrawer onClose={() => setBinOpen(false)} />}

      {/* Settings & API Key Vault Modal */}
      {isSettingsOpen && (
        <SettingsModal onClose={() => setSettingsOpen(false)} />
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxAsset && (
        <LightboxModal
          asset={lightboxAsset}
          onClose={() => setLightboxAsset(null)}
        />
      )}

      {/* Quick Ratio Cropper Modal (16:9, 9:16, 1:1) */}
      {cropperAsset && (
        <RatioCropper
          asset={cropperAsset}
          onClose={() => setCropperAsset(null)}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
