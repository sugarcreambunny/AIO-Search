import React, { useState, useEffect } from 'react';
import { MediaAsset } from '../types/media';
import { useMediaVaultStore } from '../lib/store/useMediaVaultStore';
import { AudioWaveform } from './AudioWaveform';
import {
  X,
  Download,
  Copy,
  Check,
  FolderPlus,
  FolderCheck,
  Crop,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Tag,
  Maximize2,
  Clock,
  Layers,
} from 'lucide-react';

interface LightboxModalProps {
  asset: MediaAsset;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ asset, onClose }) => {
  const {
    assets,
    setLightboxAsset,
    setCropperAsset,
    toggleBinItem,
    isInBin,
    addToast,
  } = useMediaVaultStore();

  const [copiedType, setCopiedType] = useState<'plain' | 'md' | 'html' | null>(null);
  const [selectedFormat, setSelectedFormat] = useState(
    asset.formats && asset.formats.length > 0 ? asset.formats[0].url : asset.downloadUrl
  );

  const inBin = isInBin(asset.id);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        navigateAsset(1);
      } else if (e.key === 'ArrowLeft') {
        navigateAsset(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [asset, assets]);

  const navigateAsset = (dir: number) => {
    const currentIndex = assets.findIndex((a) => a.id === asset.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + dir + assets.length) % assets.length;
    setLightboxAsset(assets[nextIndex]);
  };

  // Attribution strings
  const plainAttribution = `${asset.title} by ${asset.author} via ${asset.source.toUpperCase()} (${asset.originalUrl || asset.downloadUrl})`;
  const markdownAttribution = `[${asset.title}](${asset.originalUrl || asset.downloadUrl}) by [${asset.author}](${asset.authorUrl || asset.originalUrl || ''}) on ${asset.source.toUpperCase()}`;
  const htmlAttribution = `<a href="${asset.originalUrl || asset.downloadUrl}" target="_blank" rel="noopener noreferrer">${asset.title}</a> by <a href="${asset.authorUrl || ''}" target="_blank" rel="noopener noreferrer">${asset.author}</a> on ${asset.source.toUpperCase()}`;

  const copyToClipboard = async (text: string, type: 'plain' | 'md' | 'html') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      addToast('Attribution Copied!', `${type.toUpperCase()} attribution ready to paste.`, 'success');
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      addToast('Copy failed', 'Please copy manually.', 'error');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = selectedFormat || asset.downloadUrl;
    link.download = `${asset.title.slice(0, 30).replace(/\s+/g, '_')}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Download started', `Downloading ${asset.title}`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-2 sm:p-6 animate-in fade-in duration-200">
      {/* Navigation Chevrons */}
      <button
        onClick={() => navigateAsset(-1)}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full items-center justify-center bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 backdrop-blur transition-all shadow-xl"
        title="Previous Asset (Left Arrow)"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => navigateAsset(1)}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full items-center justify-center bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 backdrop-blur transition-all shadow-xl"
        title="Next Asset (Right Arrow)"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              {asset.source}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
              {asset.mediaType}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 truncate">
              {asset.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleBinItem(asset)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                inBin
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {inBin ? <FolderCheck className="w-4 h-4 text-cyan-400" /> : <FolderPlus className="w-4 h-4" />}
              <span>{inBin ? 'In Bin' : 'Add to Bin'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Media Preview + Details Panel */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-y-auto">
          {/* Media Stage (2 cols on desktop) */}
          <div
            className={`lg:col-span-2 flex items-center justify-center p-4 sm:p-8 relative min-h-[300px] ${
              asset.mediaType === 'sticker'
                ? 'checkerboard-pattern-lg'
                : 'bg-slate-950/80'
            }`}
          >
            {(asset.mediaType === 'photo' || asset.mediaType === 'gif' || asset.mediaType === 'sticker') && (
              <div className="relative flex flex-col items-center">
                <img
                  src={asset.downloadUrl || asset.previewUrl}
                  alt={asset.title}
                  className={`max-h-[60vh] max-w-full object-contain rounded-lg ${
                    asset.mediaType === 'sticker'
                      ? 'drop-shadow-[0_12px_32px_rgba(0,0,0,0.7)] p-4'
                      : 'shadow-2xl'
                  }`}
                />
                {asset.mediaType === 'sticker' && (
                  <span className="mt-2 text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-slate-950/90 text-purple-300 border border-purple-800/80 backdrop-blur-md shadow-md">
                    Transparent Alpha Channel Background
                  </span>
                )}
              </div>
            )}

            {asset.mediaType === 'video' && (
              <video
                src={selectedFormat || asset.downloadUrl || asset.previewUrl}
                controls
                autoPlay
                className="max-h-[62vh] max-w-full rounded-lg shadow-2xl bg-black"
              />
            )}

            {asset.mediaType === 'audio' && (
              <div className="w-full max-w-lg p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">{asset.title}</h3>
                    <p className="text-xs text-slate-400">Creator: {asset.author}</p>
                  </div>
                </div>
                <AudioWaveform asset={asset} />
              </div>
            )}
          </div>

          {/* Asset Meta & Attribution Column */}
          <div className="bg-slate-900/95 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 flex flex-col justify-between space-y-6 overflow-y-auto">
            <div className="space-y-5">
              {/* Creator details */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                    Creator
                  </span>
                  <div className="text-sm font-semibold text-slate-200 mt-0.5">
                    {asset.author}
                  </div>
                </div>
                {asset.authorUrl && (
                  <a
                    href={asset.authorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    <span>Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {asset.width && asset.height && (
                  <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
                    <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Dimensions</span>
                    </div>
                    <div className="font-mono text-slate-200 font-medium">
                      {asset.width} × {asset.height}
                    </div>
                  </div>
                )}

                {asset.duration && (
                  <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
                    <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Duration</span>
                    </div>
                    <div className="font-mono text-slate-200 font-medium">
                      {Math.round(asset.duration)} seconds
                    </div>
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 col-span-2">
                  <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>License</span>
                  </div>
                  <div className="text-slate-200 font-medium truncate">
                    {asset.license || 'Standard Commercial / Free Usage'}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {asset.tags && asset.tags.length > 0 && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-2 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-cyan-400" />
                    <span>Keywords</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {asset.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Attribution Copy Section */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                  Copy Attribution (YouTube, Podcasts, Articles)
                </span>
                
                <div className="flex flex-col gap-2">
                  {/* Plain Text Button */}
                  <button
                    onClick={() => copyToClipboard(plainAttribution, 'plain')}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-xs text-left transition-colors"
                  >
                    <span className="truncate text-slate-300 mr-2">
                      Plain Text: &ldquo;{plainAttribution.slice(0, 32)}...&rdquo;
                    </span>
                    {copiedType === 'plain' ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {/* Markdown Button */}
                  <button
                    onClick={() => copyToClipboard(markdownAttribution, 'md')}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-xs text-left transition-colors"
                  >
                    <span className="truncate text-slate-300 mr-2">
                      Markdown: [Credit Link]
                    </span>
                    {copiedType === 'md' ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Cropper & Download */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              {/* Ratio Cropper button for image/gif/sticker */}
              {(asset.mediaType === 'photo' || asset.mediaType === 'gif' || asset.mediaType === 'sticker') && (
                <button
                  onClick={() => {
                    onClose();
                    setCropperAsset(asset);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-800 transition-all cursor-pointer"
                >
                  <Crop className="w-4 h-4" />
                  <span>Open Quick Ratio Cropper (16:9, 9:16, 1:1)</span>
                </button>
              )}

              {/* Format dropdown if multiple available */}
              {asset.formats && asset.formats.length > 1 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 shrink-0">Quality:</span>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 text-xs outline-none focus:border-cyan-500"
                  >
                    {asset.formats.map((f, i) => (
                      <option key={i} value={f.url}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Download Trigger */}
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Asset Directly</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
