import React, { useState, useRef, useEffect } from 'react';
import { MediaAsset } from '../types/media';
import { useMediaVaultStore } from '../lib/store/useMediaVaultStore';
import { AudioWaveform } from './AudioWaveform';
import {
  FolderPlus,
  FolderCheck,
  Copy,
  Check,
  Download,
  Maximize2,
  Crop,
  Play,
  Clock,
  Layers,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface AssetCardProps {
  asset: MediaAsset;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const {
    isInBin,
    toggleBinItem,
    setLightboxAsset,
    setCropperAsset,
    addToast,
  } = useMediaVaultStore();

  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const inBin = isInBin(asset.id);

  // Prevent stuck loading: check if already cached by browser or safety timeout
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setImageLoaded(true);
      return;
    }
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [asset.previewUrl]);

  // Video hover play/pause
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (asset.mediaType === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (asset.mediaType === 'video' && videoRef.current) {
      videoRef.current.pause();
    }
  };

  const copyAttribution = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${asset.title} by ${asset.author} on ${asset.source.toUpperCase()} (${asset.originalUrl || asset.downloadUrl})`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      addToast('Attribution Copied!', `Credit for "${asset.title.slice(0, 24)}..." ready to paste.`, 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = asset.downloadUrl;
    link.download = `${asset.title.slice(0, 25).replace(/\s+/g, '_')}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Download started', `Downloading ${asset.title}`, 'info');
  };

  const openCropper = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCropperAsset(asset);
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'pexels':
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-800/80';
      case 'pixabay':
        return 'text-sky-400 bg-sky-950/80 border-sky-800/80';
      case 'giphy':
        return 'text-pink-400 bg-pink-950/80 border-pink-800/80';
      case 'freesound':
        return 'text-amber-400 bg-amber-950/80 border-amber-800/80';
      default:
        return 'text-slate-300 bg-slate-900 border-slate-700';
    }
  };

  // AUDIO CARD RENDER
  if (asset.mediaType === 'audio') {
    return (
      <div className="break-inside-avoid mb-4 group bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getSourceBadgeColor(
                  asset.source
                )}`}
              >
                {asset.source}
              </span>
              <span className="text-xs text-slate-400 truncate">
                by {asset.author}
              </span>
            </div>
            <h3
              onClick={() => setLightboxAsset(asset)}
              className="text-sm font-semibold text-slate-100 hover:text-cyan-400 truncate cursor-pointer transition-colors"
              title={asset.title}
            >
              {asset.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Add to Bin */}
            <button
              onClick={() => toggleBinItem(asset)}
              className={`p-2 rounded-xl border transition-all ${
                inBin
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-700'
              }`}
              title={inBin ? 'Remove from Bin' : 'Add to Bin'}
            >
              {inBin ? <FolderCheck className="w-4 h-4 text-cyan-400" /> : <FolderPlus className="w-4 h-4" />}
            </button>

            {/* Lightbox */}
            <button
              onClick={() => setLightboxAsset(asset)}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
              title="Expand Details"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Audio Waveform */}
        <AudioWaveform asset={asset} />

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-xs text-slate-400">
          <button
            onClick={copyAttribution}
            className="flex items-center gap-1.5 hover:text-slate-200 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copied!' : 'Copy Attribution'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    );
  }

  // PHOTO / VIDEO / GIF CARD RENDER
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => setLightboxAsset(asset)}
      className="break-inside-avoid mb-4 group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 shadow-md hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer"
    >
      {/* Media Container */}
      <div
        className={`relative w-full overflow-hidden min-h-[160px] flex items-center justify-center ${
          asset.mediaType === 'sticker'
            ? 'checkerboard-pattern p-6'
            : 'bg-slate-950'
        }`}
      >
        {/* Skeleton while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center pointer-events-none transition-opacity duration-300 z-10">
            <div className="w-5 h-5 border-2 border-slate-600 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        )}

        {/* VIDEO ASSET */}
        {asset.mediaType === 'video' ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={asset.previewUrl}
              poster={asset.previewUrl}
              muted
              loop
              playsInline
              preload="metadata"
              onLoadedData={() => setImageLoaded(true)}
              onLoadedMetadata={() => setImageLoaded(true)}
              onCanPlay={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              className="w-full h-auto block object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Video overlay badges */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
              {asset.duration && (
                <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950/80 text-slate-200 border border-slate-800 backdrop-blur-sm">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{Math.round(asset.duration)}s</span>
                </span>
              )}
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-950/90 text-indigo-300 border border-indigo-800/80 backdrop-blur-sm">
                VIDEO
              </span>
            </div>

            {/* Play hover hint */}
            {!isHovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-cyan-400 backdrop-blur-sm shadow-lg">
                  <Play className="w-4 h-4 translate-x-0.5" />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* PHOTO, GIF, OR STICKER ASSET */
          <div
            className={`relative flex items-center justify-center ${
              asset.mediaType === 'sticker' ? 'w-full py-2' : 'w-full'
            }`}
          >
            <img
              ref={imgRef}
              src={asset.previewUrl}
              alt={asset.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              className={`block transition-all duration-300 ${
                asset.mediaType === 'sticker'
                  ? 'max-h-[190px] max-w-[85%] object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] group-hover:scale-110'
                  : 'w-full h-auto object-cover group-hover:scale-105'
              } ${imageLoaded ? 'opacity-100' : 'opacity-80'}`}
            />
            {asset.mediaType === 'gif' && (
              <div className="absolute top-2.5 right-2.5 z-10">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-pink-950/80 text-pink-300 border border-pink-800/80 backdrop-blur-sm">
                  GIF {asset.rating && `• ${asset.rating}`}
                </span>
              </div>
            )}
            {asset.mediaType === 'sticker' && (
              <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-purple-950/90 text-purple-300 border border-purple-800/80 backdrop-blur-sm shadow-sm">
                  STICKER
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700 backdrop-blur-sm">
                  ALPHA
                </span>
              </div>
            )}
          </div>
        )}

        {/* Source Badge (Top Left) */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border backdrop-blur-sm shadow-md ${getSourceBadgeColor(
              asset.source
            )}`}
          >
            {asset.source}
          </span>
        </div>

        {/* Add to Bin Floating Bookmark (Top Right) */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBinItem(asset);
            }}
            className={`p-2 rounded-xl backdrop-blur-md shadow-lg transition-all ${
              inBin
                ? 'bg-cyan-500 text-slate-950 border border-cyan-400'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700'
            }`}
            title={inBin ? 'In Project Bin' : 'Add to Project Bin'}
          >
            {inBin ? <FolderCheck className="w-4 h-4" /> : <FolderPlus className="w-4 h-4" />}
          </button>
        </div>

        {/* Hover Overlay with Metadata and Action Bar */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex flex-col justify-end p-4 z-10 pointer-events-none">
          <div className="pointer-events-auto space-y-2">
            <h4 className="text-xs font-bold text-white line-clamp-1">
              {asset.title}
            </h4>

            {/* Specs row */}
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="truncate">By {asset.author}</span>
              {asset.width && asset.height && (
                <>
                  <span>•</span>
                  <span className="font-mono">{asset.width}x{asset.height}</span>
                </>
              )}
            </div>

            {/* Quick Actions Row */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
              <div className="flex items-center gap-1.5">
                {/* Copy Attribution */}
                <button
                  onClick={copyAttribution}
                  className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  title="Copy Attribution"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Quick Crop (photos/gifs/stickers) */}
                {(asset.mediaType === 'photo' || asset.mediaType === 'gif' || asset.mediaType === 'sticker') && (
                  <button
                    onClick={openCropper}
                    className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors"
                    title="Quick Ratio Cropper (16:9, 9:16, 1:1)"
                  >
                    <Crop className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Lightbox / Details */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxAsset(asset);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  title="Expand Full Details"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                title="Download direct asset"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
