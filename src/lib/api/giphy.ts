import { MediaAsset, MediaFormat, GiphyRatingFilter } from '../../types/media';

interface GiphyImageVariant {
  url: string;
  width: string;
  height: string;
  size?: string;
  mp4?: string;
  webp?: string;
}

interface GiphyItem {
  id: string;
  type: string;
  slug: string;
  url: string;
  title: string;
  rating: string;
  username: string;
  user?: {
    avatar_url?: string;
    display_name?: string;
    profile_url?: string;
    username?: string;
  };
  images: {
    original: GiphyImageVariant;
    fixed_height?: GiphyImageVariant;
    fixed_width?: GiphyImageVariant;
    fixed_height_downsampled?: GiphyImageVariant;
    downsized?: GiphyImageVariant;
    downsized_medium?: GiphyImageVariant;
    preview_gif?: GiphyImageVariant;
  };
}

export async function searchGiphy(
  apiKey: string,
  query: string,
  options?: {
    type?: 'gifs' | 'stickers';
    limit?: number;
    offset?: number;
    rating?: GiphyRatingFilter;
  }
): Promise<MediaAsset[]> {
  if (!apiKey) {
    throw new Error('GIPHY API key is required. Please set it in Settings.');
  }

  const endpointType = options?.type === 'stickers' ? 'stickers' : 'gifs';
  const limit = options?.limit || 24;
  const offset = options?.offset || 0;
  const ratingParam = options?.rating && options.rating !== 'all' ? `&rating=${options.rating}` : '';
  const cleanQuery = query.trim();

  const baseUrl = cleanQuery
    ? `https://api.giphy.com/v1/${endpointType}/search?api_key=${encodeURIComponent(
        apiKey
      )}&q=${encodeURIComponent(cleanQuery)}&limit=${limit}&offset=${offset}${ratingParam}&lang=en`
    : `https://api.giphy.com/v1/${endpointType}/trending?api_key=${encodeURIComponent(
        apiKey
      )}&limit=${limit}&offset=${offset}${ratingParam}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  let res: Response;
  try {
    res = await fetch(baseUrl, { signal: controller.signal });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('GIPHY request timed out. Please check your network connection.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  if (res.status === 429) {
    throw new Error('GIPHY API rate limit exceeded. Try again in a few minutes or switch to Demo Mode.');
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error('Invalid GIPHY API key. Please check your credentials in Settings.');
    }
    throw new Error(`GIPHY API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const items: GiphyItem[] = data.data || [];

  return items.map((item) => {
    const orig = item.images.original;
    const preview = item.images.fixed_height || item.images.fixed_width || item.images.downsized_medium || orig;
    const width = parseInt(orig?.width || '400', 10);
    const height = parseInt(orig?.height || '300', 10);

    const aspectRatio: 'landscape' | 'portrait' | 'square' =
      width > height * 1.15 ? 'landscape' : height > width * 1.15 ? 'portrait' : 'square';

    const formats: MediaFormat[] = [
      { label: 'Original GIF', url: orig.url, width, height },
      ...(orig.mp4 ? [{ label: 'MP4 Video', url: orig.mp4, width, height }] : []),
      ...(orig.webp ? [{ label: 'WebP', url: orig.webp, width, height }] : []),
      ...(preview && preview.url !== orig.url ? [{ label: 'Web Optimized', url: preview.url }] : []),
    ];

    const authorName = item.user?.display_name || item.user?.username || item.username || 'GIPHY Creator';
    const isSticker = endpointType === 'stickers';
    const mediaType = isSticker ? 'sticker' : 'gif';

    // Format clean, professional title
    const rawTitle = item.title || '';
    const cleanTitle = rawTitle
      .replace(/\s+(GIF|Sticker)\s+by\s+.*$/i, '')
      .replace(/[_]/g, ' ')
      .trim() || (cleanQuery ? `${cleanQuery} ${isSticker ? 'Sticker' : 'GIF'}` : `Trending ${isSticker ? 'Sticker' : 'GIF'}`);

    return {
      id: `giphy-${endpointType}-${item.id}`,
      title: cleanTitle,
      previewUrl: preview?.url || orig.url,
      downloadUrl: orig.url,
      author: authorName,
      authorUrl: item.user?.profile_url || item.url,
      source: 'giphy',
      mediaType,
      width,
      height,
      aspectRatio,
      rating: item.rating ? item.rating.toUpperCase() : undefined,
      license: 'GIPHY Standard Content Terms',
      originalUrl: item.url,
      tags: ['giphy', endpointType, ...(item.rating ? [item.rating] : []), ...(cleanQuery ? [cleanQuery] : [])],
      formats,
    };
  });
}
