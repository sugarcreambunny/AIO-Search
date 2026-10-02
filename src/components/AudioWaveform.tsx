import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { MediaAsset } from '../types/media';

interface AudioWaveformProps {
  asset: MediaAsset;
  compact?: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ asset, compact = false }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(asset.duration || 0);
  const [isMuted, setIsMuted] = useState(false);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);

  // Bars for waveform (48 points)
  const waveformBars = asset.waveform && asset.waveform.length > 0 
    ? asset.waveform 
    : [0.3, 0.5, 0.7, 0.4, 0.8, 0.9, 0.6, 0.4, 0.7, 0.5, 0.3, 0.6, 0.8, 0.5, 0.7, 0.9, 0.4, 0.3, 0.6, 0.8, 0.4, 0.7, 0.5, 0.3];

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  // Draw canvas waveform
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const numBars = waveformBars.length;
    const gap = 3;
    const barWidth = (width - (numBars - 1) * gap) / numBars;

    waveformBars.forEach((sample, i) => {
      const x = i * (barWidth + gap);
      const barHeight = Math.max(4, sample * (height * 0.82));
      const y = (height - barHeight) / 2;
      const barProgress = i / numBars;

      const isPlayed = barProgress <= progress;
      const isHovered = hoverProgress !== null && barProgress <= hoverProgress;

      // Color styling
      if (isPlayed) {
        // Cyan to Indigo gradient for played section
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#22d3ee'); // cyan-400
        grad.addColorStop(1, '#6366f1'); // indigo-500
        ctx.fillStyle = grad;
      } else if (isHovered) {
        ctx.fillStyle = '#38bdf8'; // sky-400
      } else {
        ctx.fillStyle = '#334155'; // slate-700
      }

      // Rounded bar
      const radius = Math.min(barWidth / 2, 2.5);
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, radius);
      ctx.fill();
    });

    // Draw active playhead cursor line
    if (progress > 0) {
      const cursorX = progress * width;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 6;
      ctx.fillRect(Math.max(0, cursorX - 1), 2, 2, height - 4);
      ctx.shadowBlur = 0;
    }
  }, [waveformBars, progress, hoverProgress]);

  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  // Audio event bindings
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.pause();
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // Pause any other playing audio on the page
      document.querySelectorAll('audio').forEach((el) => {
        if (el !== audio) el.pause();
      });
      audio.play().catch((err) => {
        console.warn('Audio play was prevented', err);
      });
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio || duration === 0) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = clickRatio * duration;

    audio.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHoverProgress(Math.max(0, Math.min(1, x / rect.width)));
  };

  const handleMouseLeave = () => {
    setHoverProgress(null);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const restartTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    audio.play();
  };

  return (
    <div className={`w-full bg-slate-900/90 rounded-xl p-3 border border-slate-800/80 transition-all ${compact ? 'space-y-2' : 'space-y-3'}`}>
      <audio
        ref={audioRef}
        src={asset.downloadUrl || asset.previewUrl}
        preload="metadata"
      />

      {/* Top info and badges */}
      {!compact && (
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-950/60 text-cyan-400 border border-cyan-800/50">
              AUDIO SFX
            </span>
            <span className="font-mono text-slate-300">
              {formatSeconds(currentTime)} / {formatSeconds(duration)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={restartTrack}
              className="p-1 hover:text-cyan-400 text-slate-400 transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleMute}
              className="p-1 hover:text-cyan-400 text-slate-400 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Controls + Waveform Canvas */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className={`shrink-0 flex items-center justify-center rounded-full transition-all shadow-lg ${
            compact ? 'w-8 h-8' : 'w-10 h-10'
          } ${
            isPlaying
              ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-cyan-500/20'
              : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700'
          }`}
          title={isPlaying ? 'Pause' : 'Play Audio'}
        >
          {isPlaying ? (
            <Pause className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
          ) : (
            <Play className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} translate-x-0.5`} />
          )}
        </button>

        {/* Interactive Waveform Canvas */}
        <div className="flex-1 relative cursor-pointer group">
          <canvas
            ref={canvasRef}
            width={320}
            height={compact ? 36 : 48}
            onClick={handleSeek}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full h-auto block rounded"
          />
        </div>
      </div>

      {/* Tags if available */}
      {!compact && asset.tags && asset.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {asset.tags.slice(0, 4).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
