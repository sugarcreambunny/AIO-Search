import React, { useState, useRef, useEffect } from 'react';
import { MediaAsset } from '../types/media';
import { useMediaVaultStore } from '../lib/store/useMediaVaultStore';
import { triggerBlobDownload } from '../lib/utils/zipExport';
import {
  X,
  Crop,
  Download,
  ZoomIn,
  Move,
  Check,
  RotateCw,
  Sparkles,
} from 'lucide-react';

interface RatioCropperProps {
  asset: MediaAsset;
  onClose: () => void;
}

type AspectPreset = '16:9' | '9:16' | '1:1' | '4:5' | 'free';

export const RatioCropper: React.FC<RatioCropperProps> = ({ asset, onClose }) => {
  const { addToast } = useMediaVaultStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [aspect, setAspect] = useState<AspectPreset>('16:9');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);

  // Load image with proxy fallback to avoid tainted canvas
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      imgRef.current = img;
      setImageLoaded(true);
      setImageError(null);
    };

    img.onerror = () => {
      // Retry via CORS proxy
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(asset.downloadUrl || asset.previewUrl)}`;
      const proxyImg = new Image();
      proxyImg.crossOrigin = 'anonymous';
      proxyImg.onload = () => {
        imgRef.current = proxyImg;
        setImageLoaded(true);
        setImageError(null);
      };
      proxyImg.onerror = () => {
        setImageError('Unable to load image for cropping due to cross-origin restriction.');
      };
      proxyImg.src = proxyUrl;
    };

    img.src = asset.downloadUrl || asset.previewUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [asset]);

  // Compute crop box aspect ratio dimensions
  const getCropDimensions = () => {
    const maxW = 560;
    const maxH = 400;

    let targetRatio = 16 / 9;
    if (aspect === '9:16') targetRatio = 9 / 16;
    else if (aspect === '1:1') targetRatio = 1;
    else if (aspect === '4:5') targetRatio = 4 / 5;
    else if (aspect === 'free' && imgRef.current) {
      targetRatio = imgRef.current.width / imgRef.current.height;
    }

    let w = maxW;
    let h = w / targetRatio;
    if (h > maxH) {
      h = maxH;
      w = h * targetRatio;
    }

    return { width: Math.round(w), height: Math.round(h), ratio: targetRatio };
  };

  // Draw crop preview on canvas
  useEffect(() => {
    if (!imageLoaded || !imgRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: cropW, height: cropH } = getCropDimensions();
    canvas.width = cropW;
    canvas.height = cropH;

    ctx.clearRect(0, 0, cropW, cropH);
    ctx.save();

    // Center origin
    ctx.translate(cropW / 2, cropH / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(-cropW / 2 + offsetX, -cropH / 2 + offsetY);

    const img = imgRef.current;
    // Fit image inside bounding area preserving aspect
    const imgRatio = img.width / img.height;
    const boxRatio = cropW / cropH;

    let drawW: number, drawH: number;
    if (imgRatio > boxRatio) {
      drawH = cropH;
      drawW = cropH * imgRatio;
    } else {
      drawW = cropW;
      drawH = cropW / imgRatio;
    }

    const drawX = (cropW - drawW) / 2;
    const drawY = (cropH - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();

    // Draw thirds grid overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cropW / 3, 0);
    ctx.lineTo(cropW / 3, cropH);
    ctx.moveTo((cropW * 2) / 3, 0);
    ctx.lineTo((cropW * 2) / 3, cropH);
    ctx.moveTo(0, cropH / 3);
    ctx.lineTo(cropW, cropH / 3);
    ctx.moveTo(0, (cropH * 2) / 3);
    ctx.lineTo(cropW, (cropH * 2) / 3);
    ctx.stroke();

    // Draw outer boundary
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, cropW, cropH);
  }, [imageLoaded, aspect, zoom, rotation, offsetX, offsetY]);

  // Handle Drag / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffsetX(e.clientX - dragStart.x);
    setOffsetY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsExporting(true);

    try {
      canvas.toBlob((blob) => {
        setIsExporting(false);
        if (blob) {
          const filename = `${asset.title.slice(0, 25).replace(/\s+/g, '_')}_${aspect.replace(':', 'x')}_crop.png`;
          triggerBlobDownload(blob, filename);
          addToast('Crop Exported', `Saved as ${filename}`, 'success');
          onClose();
        } else {
          addToast('Export failed', 'Could not generate image blob', 'error');
        }
      }, 'image/png');
    } catch (e: unknown) {
      setIsExporting(false);
      const msg = e instanceof Error ? e.message : 'Canvas export failed';
      addToast('Export error', msg, 'error');
    }
  };

  const resetTransform = () => {
    setZoom(1);
    setRotation(0);
    setOffsetX(0);
    setOffsetY(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-800 text-cyan-400">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Quick Ratio Cropper
                <span className="text-xs font-normal text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800">
                  {aspect} Preset
                </span>
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-md">
                {asset.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main interactive canvas area */}
        <div
          className="flex-1 bg-slate-950 relative flex items-center justify-center p-6 overflow-hidden select-none cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {imageError ? (
            <div className="text-center p-6 text-slate-400">
              <p className="text-rose-400 font-medium mb-2">{imageError}</p>
              <button
                onClick={() => window.open(asset.downloadUrl, '_blank')}
                className="text-xs text-cyan-400 underline"
              >
                Open Original in New Tab
              </button>
            </div>
          ) : !imageLoaded ? (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Preparing canvas image...</p>
            </div>
          ) : (
            <div className="relative shadow-2xl rounded overflow-hidden border border-cyan-500/40">
              <canvas ref={canvasRef} className="block max-w-full max-h-[50vh]" />
              <div className="absolute bottom-2 left-2 pointer-events-none text-[10px] bg-slate-900/80 backdrop-blur px-2 py-0.5 rounded text-cyan-400 font-mono border border-slate-700">
                Drag to pan • Slider to zoom
              </div>
            </div>
          )}
        </div>

        {/* Toolbar & Ratio Selector */}
        <div className="p-5 border-t border-slate-800/80 bg-slate-900 space-y-4">
          {/* Preset Buttons */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              {(
                [
                  { id: '16:9', label: '16:9', desc: 'YouTube' },
                  { id: '9:16', label: '9:16', desc: 'TikTok/Reels' },
                  { id: '1:1', label: '1:1', desc: 'Square' },
                  { id: '4:5', label: '4:5', desc: 'Portrait' },
                  { id: 'free', label: 'Original', desc: 'Fit' },
                ] as const
              ).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setAspect(preset.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    aspect === preset.id
                      ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {preset.label}
                  <span className="text-[10px] opacity-75 ml-1 hidden sm:inline">
                    ({preset.desc})
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                title="Rotate 90 degrees"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate</span>
              </button>

              <button
                onClick={resetTransform}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Zoom Slider */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2 min-w-[70px]">
              <ZoomIn className="w-4 h-4 text-cyan-400" />
              <span>Zoom</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-slate-300 w-10 text-right">
              {zoom.toFixed(2)}x
            </span>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
            <span className="text-xs text-slate-400">
              Output Format: <strong className="text-slate-200">Lossless PNG</strong>
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleExport}
                disabled={!imageLoaded || isExporting}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isExporting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Download Cropped Asset</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
