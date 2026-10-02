import React from 'react';
import { useMediaVaultStore } from '../lib/store/useMediaVaultStore';
import { AssetCard } from './AssetCard';
import {
  Sparkles,
  SearchX,
  RefreshCw,
  Film,
  Camera,
  Music,
  Smile,
  Zap,
} from 'lucide-react';

export const MediaGrid: React.FC = () => {
  const { assets, isLoading, filters, setQuery, performSearch, clearFilters } = useMediaVaultStore();

  const handleSuggestedQuery = (suggested: string) => {
    setQuery(suggested);
    performSearch();
  };

  // Skeleton loading placeholders
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={idx}
              className="break-inside-avoid mb-4 rounded-2xl bg-slate-900 border border-slate-800 p-3 space-y-3 animate-pulse"
            >
              <div
                className="w-full bg-slate-800 rounded-xl"
                style={{ height: `${160 + (idx % 4) * 45}px` }}
              />
              <div className="space-y-2">
                <div className="h-3.5 bg-slate-800 rounded w-3/4" />
                <div className="h-2.5 bg-slate-800/60 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state when no assets found
  if (assets.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
          <SearchX className="w-8 h-8 text-cyan-400" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-100">
            No assets found matching &ldquo;{filters.query || 'current filters'}&rdquo;
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Try adjusting your search keywords, clearing orientation filters, or reset to trending assets.
          </p>
          <div className="pt-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              Reset All Filters & Show Trending
            </button>
          </div>
        </div>

        {/* Suggested keywords */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Popular creator queries:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: 'Cyberpunk', icon: <Zap className="w-3 h-3 text-cyan-400" /> },
              { label: 'Cinematic Drone', icon: <Film className="w-3 h-3 text-indigo-400" /> },
              { label: 'Deep Whoosh SFX', icon: <Music className="w-3 h-3 text-amber-400" /> },
              { label: 'Rain Ambience', icon: <Music className="w-3 h-3 text-cyan-400" /> },
              { label: 'Neon Reaction', icon: <Smile className="w-3 h-3 text-pink-400" /> },
              { label: 'Minimal Studio', icon: <Camera className="w-3 h-3 text-emerald-400" /> },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedQuery(item.label)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* Search results summary bar */}
      <div className="flex items-center justify-between pb-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">
            {assets.length} results
          </span>
          {filters.query && (
            <span>
              for &ldquo;<strong className="text-cyan-400">{filters.query}</strong>&rdquo;
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500">
            Masonry multi-provider layout
          </span>
        </div>
      </div>

      {/* Masonry Column Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
};
