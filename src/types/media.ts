export type MediaType = 'photo' | 'video' | 'audio' | 'gif' | 'sticker';
export type MediaSource = 'pexels' | 'pixabay' | 'giphy' | 'freesound';

export interface MediaFormat {
  label: string;
  url: string;
  width?: number;
  height?: number;
  quality?: string;
  filesize?: number;
}

export interface MediaAsset {
  id: string;
  title: string;
  previewUrl: string;
  downloadUrl: string;
  author: string;
  authorUrl?: string;
  source: MediaSource;
  mediaType: MediaType;
  width?: number;
  height?: number;
  duration?: number; // duration in seconds
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  license?: string;
  tags?: string[];
  originalUrl?: string;
  rating?: string;
  formats?: MediaFormat[];
  waveform?: number[]; // normalized waveform sample points
}

export type AssetFilterTab = 'all' | 'photos' | 'videos' | 'audio' | 'gifs' | 'stickers';

export type AspectRatioFilter = 'all' | 'landscape' | 'portrait' | 'square';

export type FreesoundDurationFilter = 'all' | 'short' | 'medium' | 'long'; // <5s, 5-30s, >30s

export type GiphyRatingFilter = 'all' | 'g' | 'pg' | 'pg-13' | 'r';

export type SortFilter = 'relevant' | 'popular' | 'newest';

export interface ApiKeys {
  pexels: string;
  pixabay: string;
  giphy: string;
  freesound: string;
  useDemoMode: boolean;
}

export interface SearchFilters {
  query: string;
  tab: AssetFilterTab;
  providers: Record<MediaSource, boolean>;
  aspectRatio: AspectRatioFilter;
  giphyRating: GiphyRatingFilter;
  audioDuration: FreesoundDurationFilter;
  sortBy: SortFilter;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
}
