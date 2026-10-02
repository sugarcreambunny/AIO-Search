import React from 'react';
import { useMediaVaultStore } from '../lib/store/useMediaVaultStore';
import {
  MediaSource,
  AspectRatioFilter,
  GiphyRatingFilter,
  FreesoundDurationFilter,
  SortFilter,
} from '../types/media';
import {
  SlidersHorizontal,
  Check,
  AlertTriangle,
  Sparkles,
  Clock,
  Compass,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

export const SearchFilters: React.FC = () => {
  const {
    filters,
    toggleProvider,
    setAspectRatio,
    setGiphyRating,
    setAudioDuration,
    setSortBy,
    searchErrors,
    apiKeys,
    setSettingsOpen,
  } = useMediaVaultStore();

  const providers: {
    id: MediaSource;
    name: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }[] = [
    {
      id: 'pexels',
      name: 'Pexels',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/40',
      borderColor: 'border-emerald-800/60',
    },
    {
      id: 'pixabay',
      name: 'Pixabay',
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/40',
      borderColor: 'border-sky-800/60',
    },
    {
      id: 'giphy',
      name: 'GIPHY',
      color: 'text-pink-400',
      bgColor: 'bg-pink-950/40',
      borderColor: 'border-pink-800/60',
    },
    {
      id: 'freesound',
      name: 'Freesound',
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/40',
      borderColor: 'border-amber-800/60',
    },
  ];

  const aspectRatios: { id: AspectRatioFilter; label: string }[] = [
    { id: 'all', label: 'All Ratios' },
    { id: 'landscape', label: 'Landscape (16:9)' },
    { id: 'portrait', label: 'Portrait (9:16)' },
    { id: 'square', label: 'Square (1:1)' },
  ];

  const audioDurations: { id: FreesoundDurationFilter; label: string }[] = [
    { id: 'all', label: 'Any Duration' },
    { id: 'short', label: '< 5s (Short SFX)' },
    { id: 'medium', label: '5s - 30s (FX & Jingles)' },
    { id: 'long', label: '> 30s (Ambience/Music)' },
  ];

  const giphyRatings: { id: GiphyRatingFilter; label: string }[] = [
    { id: 'all', label: 'All Ratings' },
    { id: 'g', label: 'G (General)' },
    { id: 'pg', label: 'PG' },
    { id: 'pg-13', label: 'PG-13' },
    { id: 'r', label: 'R' },
  ];

  const sortOptions: { id: SortFilter; label: string }[] = [
    { id: 'relevant', label: 'Most Relevant' },
    { id: 'popular', label: 'Popular / Trending' },
    { id: 'newest', label: 'Newest Assets' },
  ];

  const hasErrors = Object.keys(searchErrors).length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
      {/* Provider Toggles & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
        {/* Provider Checkboxes */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Providers:</span>
          </span>

          {providers.map((p) => {
            const isEnabled = filters.providers[p.id];
            const hasError = searchErrors[p.id];

            return (
              <button
                key={p.id}
                onClick={() => toggleProvider(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  isEnabled
                    ? `${p.bgColor} ${p.color} ${p.borderColor} shadow-sm`
                    : 'bg-slate-950/60 text-slate-500 border-slate-800 hover:text-slate-400'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] ${
                    isEnabled
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                      : 'border-slate-700 bg-slate-900 text-transparent'
                  }`}
                >
                  {isEnabled && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{p.name}</span>
                {hasError && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-rose-500"
                    title={hasError}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Secondary dropdown selectors: Aspect Ratio & Sort */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Aspect Ratio Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300">
            <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <select
              value={filters.aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatioFilter)}
              className="bg-transparent outline-none cursor-pointer text-slate-200"
            >
              {aspectRatios.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-slate-200">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Audio Duration Filter (Visible for Audio or All tab) */}
          {(filters.tab === 'audio' || filters.tab === 'all') && (
            <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <select
                value={filters.audioDuration}
                onChange={(e) => setAudioDuration(e.target.value as FreesoundDurationFilter)}
                className="bg-transparent outline-none cursor-pointer text-slate-200"
              >
                {audioDurations.map((d) => (
                  <option key={d.id} value={d.id} className="bg-slate-900 text-slate-200">
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* GIPHY Rating Filter (Visible for GIFs, Stickers or All tab) */}
          {(filters.tab === 'gifs' || filters.tab === 'stickers' || filters.tab === 'all') && (
            <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300">
              <span className="text-[10px] font-mono text-pink-400 font-bold">RATING</span>
              <select
                value={filters.giphyRating}
                onChange={(e) => setGiphyRating(e.target.value as GiphyRatingFilter)}
                className="bg-transparent outline-none cursor-pointer text-slate-200"
              >
                {giphyRatings.map((gr) => (
                  <option key={gr.id} value={gr.id} className="bg-slate-900 text-slate-200">
                    {gr.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <select
              value={filters.sortBy}
              onChange={(e) => setSortBy(e.target.value as SortFilter)}
              className="bg-transparent outline-none cursor-pointer text-slate-200"
            >
              {sortOptions.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Provider Warning / Notice Banner if error or in Demo Mode */}
      {hasErrors && !apiKeys.useDemoMode && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-950/30 border border-amber-900/50 text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Some providers reported missing keys or limits:{' '}
              {Object.entries(searchErrors)
                .map(([p, msg]) => `${p.toUpperCase()} (${msg})`)
                .join(', ')}
            </span>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="underline font-semibold hover:text-white shrink-0 ml-2"
          >
            Configure Keys or Switch to Demo
          </button>
        </div>
      )}
    </div>
  );
};
