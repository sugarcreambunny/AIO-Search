import {
  MediaAsset,
  SearchFilters,
  ApiKeys,
  MediaSource
} from '../../types/media';
import { searchPexelsPhotos, searchPexelsVideos } from './pexels';
import { searchPixabayPhotos, searchPixabayVideos } from './pixabay';
import { searchGiphy } from './giphy';
import { searchFreesound } from './freesound';
import { filterDemoAssets } from './demoData';
import { searchWikimediaPhotos, searchWikimediaGifs } from './wikimedia';

export interface AggregateSearchResult {
  assets: MediaAsset[];
  errors: Partial<Record<MediaSource, string>>;
  totalFound: number;
}

export async function aggregateSearch(
  filters: SearchFilters,
  keys: ApiKeys
): Promise<AggregateSearchResult> {
  const { query, tab, providers, aspectRatio, giphyRating, audioDuration } = filters;
  const errors: Partial<Record<MediaSource, string>> = {};
  const promises: Promise<MediaAsset[]>[] = [];

  const cleanQuery = query.trim();

  // If in demo mode or no live keys entered at all, search curated assets and live Wikimedia photos
  const hasAnyKey = Boolean(keys.pexels || keys.pixabay || keys.giphy || keys.freesound);
  if (keys.useDemoMode || !hasAnyKey) {
    const demoResults = filterDemoAssets(
      cleanQuery,
      tab,
      providers,
      aspectRatio,
      audioDuration
    );

    // If user searched for a query in demo mode:
    if (cleanQuery) {
      const extraAssets: MediaAsset[] = [];

      // 1. Photos
      if (tab === 'all' || tab === 'photos') {
        const orientationParam = aspectRatio !== 'all' ? aspectRatio : undefined;
        const wikiPhotos = await searchWikimediaPhotos(cleanQuery, {
          limit: 12,
          orientation: orientationParam,
        });
        extraAssets.push(...wikiPhotos);
      }

      // 2. GIFs
      if (providers.giphy && (tab === 'all' || tab === 'gifs')) {
        const wikiGifs = await searchWikimediaGifs(cleanQuery, {
          limit: 8,
        });
        extraAssets.push(...wikiGifs);
      }

      const combined = [...demoResults, ...extraAssets];
      return {
        assets: combined,
        errors: {},
        totalFound: combined.length,
      };
    }

    return {
      assets: demoResults,
      errors: {},
      totalFound: demoResults.length,
    };
  }

  // 1. PEXELS
  if (providers.pexels) {
    if (keys.pexels) {
      if (tab === 'all' || tab === 'photos') {
        promises.push(
          searchPexelsPhotos(keys.pexels, query, {
            orientation: aspectRatio !== 'all' ? aspectRatio : undefined,
          }).catch((err) => {
            errors.pexels = err.message || 'Pexels photo search failed';
            return [];
          })
        );
      }
      if (tab === 'all' || tab === 'videos') {
        promises.push(
          searchPexelsVideos(keys.pexels, query, {
            orientation: aspectRatio !== 'all' ? aspectRatio : undefined,
          }).catch((err) => {
            errors.pexels = errors.pexels ? `${errors.pexels} | ${err.message}` : err.message;
            return [];
          })
        );
      }
    } else {
      errors.pexels = 'No Pexels API key provided (configure in Settings)';
    }
  }

  // 2. PIXABAY
  if (providers.pixabay) {
    if (keys.pixabay) {
      if (tab === 'all' || tab === 'photos') {
        promises.push(
          searchPixabayPhotos(keys.pixabay, query, {
            orientation: aspectRatio !== 'all' ? aspectRatio : undefined,
          }).catch((err) => {
            errors.pixabay = err.message || 'Pixabay photo search failed';
            return [];
          })
        );
      }
      if (tab === 'all' || tab === 'videos') {
        promises.push(
          searchPixabayVideos(keys.pixabay, query).catch((err) => {
            errors.pixabay = errors.pixabay ? `${errors.pixabay} | ${err.message}` : err.message;
            return [];
          })
        );
      }
    } else {
      errors.pixabay = 'No Pixabay API key provided (configure in Settings)';
    }
  }

  // 3. GIPHY (GIFs & Stickers separated)
  if (providers.giphy) {
    if (keys.giphy) {
      if (tab === 'all' || tab === 'gifs') {
        promises.push(
          searchGiphy(keys.giphy, query, {
            type: 'gifs',
            rating: giphyRating,
          }).catch((err) => {
            errors.giphy = err.message || 'GIPHY GIFs search failed';
            return [];
          })
        );
      }
      if (tab === 'all' || tab === 'stickers') {
        promises.push(
          searchGiphy(keys.giphy, query, {
            type: 'stickers',
            rating: giphyRating,
          }).catch((err) => {
            errors.giphy = errors.giphy ? `${errors.giphy} | ${err.message}` : err.message;
            return [];
          })
        );
      }
    } else if (tab === 'all' || tab === 'gifs' || tab === 'stickers') {
      errors.giphy = 'No GIPHY API key provided (configure in Settings)';
    }
  }

  // 4. FREESOUND
  if (providers.freesound && (tab === 'all' || tab === 'audio')) {
    if (keys.freesound) {
      promises.push(
        searchFreesound(keys.freesound, query, {
          duration: audioDuration,
        }).catch((err) => {
          errors.freesound = err.message || 'Freesound search failed';
          return [];
        })
      );
    } else {
      errors.freesound = 'No Freesound API key provided (configure in Settings)';
    }
  }

  const resultArrays = await Promise.all(promises);
  let aggregated: MediaAsset[] = [];

  // Interleave results so all providers and formats get exposure
  const maxLen = Math.max(0, ...resultArrays.map((arr) => arr.length));
  for (let i = 0; i < maxLen; i++) {
    for (const arr of resultArrays) {
      if (arr[i]) {
        aggregated.push(arr[i]);
      }
    }
  }

  // If live results are empty because keys are missing, network issue, or zero returned:
  if (aggregated.length === 0) {
    if (cleanQuery) {
      const demoFallback = filterDemoAssets(
        cleanQuery,
        tab,
        providers,
        aspectRatio,
        audioDuration
      );
      aggregated = demoFallback;

      // If still 0 and photos/all tab is active, try Wikimedia
      if (aggregated.length === 0 && (tab === 'all' || tab === 'photos')) {
        const wikiFallback = await searchWikimediaPhotos(cleanQuery, {
          limit: 12,
          orientation: aspectRatio !== 'all' ? aspectRatio : undefined,
        });
        aggregated = wikiFallback;
      }

      // If still 0 and gifs/all tab is active, try Wikimedia GIFs
      if (aggregated.length === 0 && (tab === 'all' || tab === 'gifs')) {
        const wikiGifsFallback = await searchWikimediaGifs(cleanQuery, {
          limit: 8,
        });
        aggregated = wikiGifsFallback;
      }
    } else {
      // Empty query shows trending assets
      aggregated = filterDemoAssets('', tab, providers, aspectRatio, audioDuration);
    }
  }

  // Apply Aspect Ratio client filter if specified and provider didn't filter
  if (aspectRatio !== 'all') {
    const filteredByAspect = aggregated.filter(
      (a) => !a.aspectRatio || a.aspectRatio === aspectRatio
    );
    if (filteredByAspect.length > 0) {
      aggregated = filteredByAspect;
    }
  }

  return {
    assets: aggregated,
    errors,
    totalFound: aggregated.length,
  };
}

// Helper to validate individual API keys
export async function testApiKey(
  provider: MediaSource,
  key: string
): Promise<{ valid: boolean; message: string }> {
  if (!key.trim()) {
    return { valid: false, message: 'Key cannot be blank' };
  }

  try {
    if (provider === 'pexels') {
      const res = await fetch('https://api.pexels.com/v1/curated?per_page=1', {
        headers: { Authorization: key.trim() },
      });
      if (res.ok) return { valid: true, message: 'Pexels key is valid and connected!' };
      if (res.status === 401 || res.status === 403) return { valid: false, message: 'Invalid Pexels credentials' };
      return { valid: false, message: `Pexels returned status ${res.status}` };
    }

    if (provider === 'pixabay') {
      const res = await fetch(`https://pixabay.com/api/?key=${encodeURIComponent(key.trim())}&q=test&per_page=3`);
      if (res.ok) return { valid: true, message: 'Pixabay key is valid and connected!' };
      return { valid: false, message: 'Invalid Pixabay key' };
    }

    if (provider === 'giphy') {
      const res = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${encodeURIComponent(key.trim())}&limit=1`);
      if (res.ok) return { valid: true, message: 'GIPHY key is valid and connected!' };
      return { valid: false, message: 'Invalid GIPHY key' };
    }

    if (provider === 'freesound') {
      const res = await fetch(`https://freesound.org/apiv2/search/text/?token=${encodeURIComponent(key.trim())}&query=water&page_size=1`);
      if (res.ok) return { valid: true, message: 'Freesound key is valid and connected!' };
      return { valid: false, message: 'Invalid Freesound token' };
    }

    return { valid: false, message: 'Unknown provider' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { valid: false, message: `Connection error: ${errorMsg}` };
  }
}
