import React, { useState } from 'react';
import { useMediaVaultStore } from '../lib/store/useMediaVaultStore';
import { exportAssetsAsZip, triggerBlobDownload, ZipExportProgress } from '../lib/utils/zipExport';
import {
  X,
  Archive,
  Trash2,
  Download,
  FileText,
  Music,
  Video,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { MediaAsset, MediaType } from '../types/media';

interface ProjectBinDrawerProps {
  onClose: () => void;
}

export const ProjectBinDrawer: React.FC<ProjectBinDrawerProps> = ({ onClose }) => {
  const {
    binAssets,
    removeFromBin,
    clearBin,
    setLightboxAsset,
    addToast,
  } = useMediaVaultStore();

  const [activeTab, setActiveTab] = useState<'all' | MediaType>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ZipExportProgress | null>(null);

  const filteredAssets = activeTab === 'all'
    ? binAssets
    : binAssets.filter((a) => a.mediaType === activeTab);

  const handleDownloadZip = async () => {
    if (binAssets.length === 0) return;

    setIsExporting(true);
    setExportProgress({
      current: 0,
      total: binAssets.length,
      percentage: 0,
      currentFilename: 'Initializing zip archive...',
      status: 'fetching',
    });

    try {
      const zipBlob = await exportAssetsAsZip(binAssets, (progress) => {
        setExportProgress(progress);
      });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const zipFilename = `MediaVault_Project_Bin_${timestamp}.zip`;
      triggerBlobDownload(zipBlob, zipFilename);

      addToast(
        'ZIP Archive Ready!',
        `Exported ${binAssets.length} assets + ATTRIBUTIONS.txt`,
        'success'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Export failed';
      addToast('ZIP Export Error', msg, 'error');
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(null);
      }, 1200);
    }
  };

  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case 'audio':
        return <Music className="w-4 h-4 text-cyan-400" />;
      case 'video':
        return <Video className="w-4 h-4 text-indigo-400" />;
      case 'gif':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      default:
        return <ImageIcon className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Project Bin
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {binAssets.length} items
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Session collection ready for download
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {binAssets.length > 0 && (
              <button
                onClick={clearBin}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                title="Clear All"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Type Filter Tabs */}
        {binAssets.length > 0 && (
          <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-1 overflow-x-auto text-xs">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'photo', label: 'Photos' },
                { id: 'video', label: 'Videos' },
                { id: 'audio', label: 'Audio' },
                { id: 'gif', label: 'GIFs' },
                { id: 'sticker', label: 'Stickers' },
              ] as const
            ).map((t) => {
              const count = t.id === 'all' ? binAssets.length : binAssets.filter((a) => a.mediaType === t.id).length;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    activeTab === t.id
                      ? 'bg-slate-800 text-cyan-400 font-semibold border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.label} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Asset List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {binAssets.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500">
                <Archive className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-slate-200 text-sm">
                Your Project Bin is Empty
              </h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Click &ldquo;Add to Bin&rdquo; on any asset card to save it here for bulk export, attribution manifests, and batch downloading.
              </p>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No {activeTab} assets in this project bin.
            </div>
          ) : (
            filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="group flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all"
              >
                {/* Thumbnail / Media icon preview */}
                <div
                  onClick={() => setLightboxAsset(asset)}
                  className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-slate-800 cursor-pointer relative group/thumb ${
                    asset.mediaType === 'sticker' ? 'checkerboard-pattern p-1' : 'bg-slate-950'
                  }`}
                >
                  {asset.mediaType === 'audio' ? (
                    <div className="flex flex-col items-center justify-center text-cyan-400">
                      <Music className="w-6 h-6" />
                      <span className="text-[9px] font-mono mt-0.5">
                        {asset.duration ? `${Math.round(asset.duration)}s` : 'SFX'}
                      </span>
                    </div>
                  ) : asset.mediaType === 'video' ? (
                    <div className="relative w-full h-full">
                      <video
                        src={asset.previewUrl}
                        muted
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={asset.previewUrl}
                      alt={asset.title}
                      className={`w-full h-full ${
                        asset.mediaType === 'sticker'
                          ? 'object-contain drop-shadow group-hover/thumb:scale-110'
                          : 'object-cover group-hover/thumb:scale-105'
                      } transition-transform`}
                    />
                  )}
                </div>

                {/* Details */}
                <div
                  onClick={() => setLightboxAsset(asset)}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                    {asset.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono uppercase text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                      {asset.source}
                    </span>
                    <span className="truncate">{asset.author}</span>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromBin(asset.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition-colors shrink-0"
                  title="Remove from Bin"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Export Progress Overlay */}
        {isExporting && exportProgress && (
          <div className="p-4 bg-slate-950/90 border-t border-cyan-800/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-cyan-400 flex items-center gap-1.5">
                <Archive className="w-3.5 h-3.5 animate-bounce" />
                <span>Generating ZIP Package...</span>
              </span>
              <span className="font-mono text-slate-200">
                {exportProgress.percentage}%
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-200"
                style={{ width: `${exportProgress.percentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {exportProgress.currentFilename}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        {binAssets.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/90 space-y-2.5">
            <button
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download All as ZIP ({binAssets.length} Assets)</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <FileText className="w-3 h-3 text-cyan-400" />
              <span>Includes auto-generated ATTRIBUTIONS.txt manifest</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
