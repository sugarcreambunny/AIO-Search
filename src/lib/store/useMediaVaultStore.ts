import { create } from 'zustand';
import {
  MediaAsset,
  SearchFilters,
  ApiKeys,
  MediaSource,
  AssetFilterTab,
  AspectRatioFilter,
  GiphyRatingFilter,
  FreesoundDurationFilter,
  SortFilter,
  ToastMessage,
} from '../../types/media';
import { aggregateSearch } from '../api/searchAggregator';
import { DEMO_ASSETS } from '../api/demoData';

const STORAGE_KEYS_KEY = 'mediavault_api_keys';
const STORAGE_BIN_KEY = 'mediavault_project_bin';

function loadStoredKeys(): ApiKeys {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        pexels: parsed.pexels || '',
        pixabay: parsed.pixabay || '',
        giphy: parsed.giphy || '',
        freesound: parsed.freesound || '',
        useDemoMode: parsed.useDemoMode ?? true,
      };
    }
  } catch (e) {
    console.error('Failed to load keys from localStorage', e);
  }
  return {
    pexels: '',
    pixabay: '',
    giphy: '',
    freesound: '',
    useDemoMode: true,
  };
}

function loadStoredBin(): MediaAsset[] {
  try {
    const raw = localStorage.getItem(STORAGE_BIN_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load project bin from localStorage', e);
  }
  return [];
}

const initialFilters: SearchFilters = {
  query: '',
  tab: 'all',
  providers: {
    pexels: true,
    pixabay: true,
    giphy: true,
    freesound: true,
  },
  aspectRatio: 'all',
  giphyRating: 'all',
  audioDuration: 'all',
  sortBy: 'relevant',
};

interface MediaVaultState {
  // Search & Filters
  filters: SearchFilters;
  setQuery: (query: string) => void;
  setTab: (tab: AssetFilterTab) => void;
  toggleProvider: (provider: MediaSource) => void;
  setProviderState: (provider: MediaSource, enabled: boolean) => void;
  setAspectRatio: (aspectRatio: AspectRatioFilter) => void;
  setGiphyRating: (rating: GiphyRatingFilter) => void;
  setAudioDuration: (duration: FreesoundDurationFilter) => void;
  setSortBy: (sort: SortFilter) => void;
  clearFilters: () => void;

  // Keys & Settings
  apiKeys: ApiKeys;
  setApiKeys: (keys: Partial<ApiKeys>) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;

  // Results & Loading
  assets: MediaAsset[];
  isLoading: boolean;
  searchErrors: Partial<Record<MediaSource, string>>;
  performSearch: () => Promise<void>;

  // Project Bin / Collection
  binAssets: MediaAsset[];
  isBinOpen: boolean;
  setBinOpen: (open: boolean) => void;
  addToBin: (asset: MediaAsset) => void;
  removeFromBin: (assetId: string) => void;
  toggleBinItem: (asset: MediaAsset) => void;
  isInBin: (assetId: string) => boolean;
  clearBin: () => void;

  // Modals & Preview
  lightboxAsset: MediaAsset | null;
  setLightboxAsset: (asset: MediaAsset | null) => void;
  cropperAsset: MediaAsset | null;
  setCropperAsset: (asset: MediaAsset | null) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

export const useMediaVaultStore = create<MediaVaultState>((set, get) => ({
  filters: initialFilters,
  apiKeys: loadStoredKeys(),
  isSettingsOpen: false,
  assets: DEMO_ASSETS,
  isLoading: false,
  searchErrors: {},
  binAssets: loadStoredBin(),
  isBinOpen: false,
  lightboxAsset: null,
  cropperAsset: null,
  toasts: [],

  setQuery: (query: string) => {
    set((state) => ({
      filters: { ...state.filters, query },
    }));
  },

  setTab: (tab: AssetFilterTab) => {
    set((state) => ({
      filters: { ...state.filters, tab },
    }));
    get().performSearch();
  },

  toggleProvider: (provider: MediaSource) => {
    set((state) => {
      const current = state.filters.providers[provider];
      return {
        filters: {
          ...state.filters,
          providers: {
            ...state.filters.providers,
            [provider]: !current,
          },
        },
      };
    });
    get().performSearch();
  },

  setProviderState: (provider: MediaSource, enabled: boolean) => {
    set((state) => ({
      filters: {
        ...state.filters,
        providers: {
          ...state.filters.providers,
          [provider]: enabled,
        },
      },
    }));
    get().performSearch();
  },

  setAspectRatio: (aspectRatio: AspectRatioFilter) => {
    set((state) => ({
      filters: { ...state.filters, aspectRatio },
    }));
    get().performSearch();
  },

  setGiphyRating: (rating: GiphyRatingFilter) => {
    set((state) => ({
      filters: { ...state.filters, giphyRating: rating },
    }));
    get().performSearch();
  },

  setAudioDuration: (duration: FreesoundDurationFilter) => {
    set((state) => ({
      filters: { ...state.filters, audioDuration: duration },
    }));
    get().performSearch();
  },

  setSortBy: (sortBy: SortFilter) => {
    set((state) => ({
      filters: { ...state.filters, sortBy },
    }));
    // Re-sort local results
    const currentAssets = [...get().assets];
    if (sortBy === 'newest') {
      currentAssets.reverse();
    }
    set({ assets: currentAssets });
  },

  clearFilters: () => {
    set({
      filters: {
        query: '',
        tab: 'all',
        providers: {
          pexels: true,
          pixabay: true,
          giphy: true,
          freesound: true,
        },
        aspectRatio: 'all',
        giphyRating: 'all',
        audioDuration: 'all',
        sortBy: 'relevant',
      },
    });
    get().performSearch();
    get().addToast('Filters reset', 'Showing all trending media assets', 'info');
  },

  setApiKeys: (newKeys: Partial<ApiKeys>) => {
    set((state) => {
      const updated = { ...state.apiKeys, ...newKeys };
      try {
        localStorage.setItem(STORAGE_KEYS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save keys', e);
      }
      return { apiKeys: updated };
    });
  },

  setSettingsOpen: (open: boolean) => {
    set({ isSettingsOpen: open });
  },

  performSearch: async () => {
    const { filters, apiKeys } = get();
    set({ isLoading: true, searchErrors: {} });

    try {
      const result = await aggregateSearch(filters, apiKeys);
      set({
        assets: result.assets,
        searchErrors: result.errors,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Search error occurred';
      set({
        isLoading: false,
        searchErrors: { pexels: message },
      });
      get().addToast('Search issue', message, 'error');
    }
  },

  setBinOpen: (open: boolean) => {
    set({ isBinOpen: open });
  },

  addToBin: (asset: MediaAsset) => {
    const { binAssets } = get();
    if (binAssets.some((item) => item.id === asset.id)) {
      get().addToast('Already in Bin', `"${asset.title}" is already in your project bin.`, 'info');
      return;
    }
    const updated = [asset, ...binAssets];
    set({ binAssets: updated });
    try {
      localStorage.setItem(STORAGE_BIN_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    get().addToast('Added to Project Bin', `"${asset.title.slice(0, 30)}..." saved to bin.`, 'success');
  },

  removeFromBin: (assetId: string) => {
    const { binAssets } = get();
    const updated = binAssets.filter((item) => item.id !== assetId);
    set({ binAssets: updated });
    try {
      localStorage.setItem(STORAGE_BIN_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    get().addToast('Removed from Bin', 'Asset removed from current session bin.', 'info');
  },

  toggleBinItem: (asset: MediaAsset) => {
    const { binAssets, addToBin, removeFromBin } = get();
    if (binAssets.some((item) => item.id === asset.id)) {
      removeFromBin(asset.id);
    } else {
      addToBin(asset);
    }
  },

  isInBin: (assetId: string) => {
    return get().binAssets.some((item) => item.id === assetId);
  },

  clearBin: () => {
    set({ binAssets: [] });
    try {
      localStorage.removeItem(STORAGE_BIN_KEY);
    } catch (e) {
      console.error(e);
    }
    get().addToast('Bin Cleared', 'All stored assets have been cleared from your bin.', 'info');
  },

  setLightboxAsset: (asset: MediaAsset | null) => {
    set({ lightboxAsset: asset });
  },

  setCropperAsset: (asset: MediaAsset | null) => {
    set({ cropperAsset: asset });
  },

  addToast: (title: string, message?: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastMessage = { id, title, message, type, timestamp: Date.now() };

    set((state) => ({
      toasts: [...state.toasts.slice(-4), newToast],
    }));

    setTimeout(() => {
      get().removeToast(id);
    }, 3800);
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
