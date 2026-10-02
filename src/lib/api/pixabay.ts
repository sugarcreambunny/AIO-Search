import { MediaAsset, MediaFormat } from '../../types/media';

interface PixabayPhotoHit {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  webformatURL: string;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  user: string;
  user_id: number;
}

interface PixabayVideoSize {
  url: string;
  width: number;
  height: number;
  size: number;
  thumbnail?: string;
}

interface PixabayVideoHit {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  duration: number;
  picture_id: string;
  videos: {
    large?: PixabayVideoSize;
    medium?: PixabayVideoSize;
    small?: PixabayVideoSize;
    tiny?: PixabayVideoSize;
  };
  user: string;
  user_id: number;
}

export async function searchPixabayPhotos(
  apiKey: string,
  query: string,
  options?: { perPage?: number; page?: number; imageType?: 'all' | 'photo' | 'illustration' | 'vector'; orientation?: string }
): Promise<MediaAsset[]> {
  if (!apiKey) {
    throw new Error('Pixabay API key is required. Please set it in Settings.');
  }

  const perPage = options?.perPage || 20;
  const page = options?.page || 1;
  const imageType = options?.imageType || 'all';
  const orientation = options?.orientation && options.orientation !== 'all' ? `&orientation=${options.orientation}` : '';
  const q = encodeURIComponent(query.trim() || 'nature');

  const endpoint = `https://pixabay.com/api/?key=${encodeURIComponent(apiKey)}&q=${q}&image_type=${imageType}&per_page=${perPage}&page=${page}${orientation}&safesearch=true`;

  const res = await fetch(endpoint);

  if (res.status === 429) {
    throw new Error('Pixabay API rate limit exceeded (100 requests/minute). Please wait a moment.');
  }

  if (!res.ok) {
    if (res.status === 400 || res.status === 401) {
      throw new Error('Invalid Pixabay API key. Please check your credentials in Settings.');
    }
    throw new Error(`Pixabay API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const hits: PixabayPhotoHit[] = data.hits || [];

  return hits.map((hit) => {
    const aspectRatio: 'landscape' | 'portrait' | 'square' =
      hit.imageWidth > hit.imageHeight * 1.1 ? 'landscape' : hit.imageHeight > hit.imageWidth * 1.1 ? 'portrait' : 'square';

    const formats: MediaFormat[] = [
      { label: 'Large High-Res', url: hit.largeImageURL, width: hit.imageWidth, height: hit.imageHeight },
      { label: 'Web Format', url: hit.webformatURL, width: 640 },
      { label: 'Thumbnail', url: hit.previewURL, width: 150 },
    ];

    const tagList = hit.tags ? hit.tags.split(',').map((t) => t.trim()) : ['pixabay'];

    return {
      id: `pixabay-photo-${hit.id}`,
      title: `${tagList[0] || 'Image'} by ${hit.user}`,
      previewUrl: hit.webformatURL || hit.previewURL,
      downloadUrl: hit.largeImageURL || hit.webformatURL,
      author: hit.user || 'Pixabay Contributor',
      authorUrl: `https://pixabay.com/users/${encodeURIComponent(hit.user)}-${hit.user_id}/`,
      source: 'pixabay',
      mediaType: 'photo',
      width: hit.imageWidth,
      height: hit.imageHeight,
      aspectRatio,
      license: 'Free for commercial use (Pixabay License)',
      originalUrl: hit.pageURL,
      tags: tagList.slice(0, 4),
      formats,
    };
  });
}

export async function searchPixabayVideos(
  apiKey: string,
  query: string,
  options?: { perPage?: number; page?: number }
): Promise<MediaAsset[]> {
  if (!apiKey) {
    throw new Error('Pixabay API key is required. Please set it in Settings.');
  }

  const perPage = options?.perPage || 15;
  const page = options?.page || 1;
  const q = encodeURIComponent(query.trim() || 'landscape');

  const endpoint = `https://pixabay.com/api/videos/?key=${encodeURIComponent(apiKey)}&q=${q}&per_page=${perPage}&page=${page}&safesearch=true`;

  const res = await fetch(endpoint);

  if (res.status === 429) {
    throw new Error('Pixabay API rate limit exceeded. Try again in a minute.');
  }

  if (!res.ok) {
    throw new Error(`Pixabay API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const hits: PixabayVideoHit[] = data.hits || [];

  return hits.map((hit) => {
    const v = hit.videos;
    const best = v.large || v.medium || v.small || v.tiny;
    const preview = v.medium || v.small || v.tiny || best;

    const formats: MediaFormat[] = [];
    if (v.large?.url) formats.push({ label: `Large (${v.large.width}x${v.large.height})`, url: v.large.url, width: v.large.width, height: v.large.height, filesize: v.large.size });
    if (v.medium?.url) formats.push({ label: `Medium (${v.medium.width}x${v.medium.height})`, url: v.medium.url, width: v.medium.width, height: v.medium.height, filesize: v.medium.size });
    if (v.small?.url) formats.push({ label: `Small (${v.small.width}x${v.small.height})`, url: v.small.url, width: v.small.width, height: v.small.height, filesize: v.small.size });

    const width = best?.width || 1920;
    const height = best?.height || 1080;
    const aspectRatio: 'landscape' | 'portrait' | 'square' =
      width > height * 1.1 ? 'landscape' : height > width * 1.1 ? 'portrait' : 'square';

    const tagList = hit.tags ? hit.tags.split(',').map((t) => t.trim()) : ['video'];

    return {
      id: `pixabay-video-${hit.id}`,
      title: `${tagList[0] || 'Footage'} by ${hit.user}`,
      previewUrl: preview?.url || '',
      downloadUrl: best?.url || preview?.url || '',
      author: hit.user || 'Pixabay Creator',
      authorUrl: `https://pixabay.com/users/${encodeURIComponent(hit.user)}-${hit.user_id}/`,
      source: 'pixabay',
      mediaType: 'video',
      width,
      height,
      duration: hit.duration,
      aspectRatio,
      license: 'Free for commercial use (Pixabay License)',
      originalUrl: hit.pageURL,
      tags: tagList.slice(0, 4),
      formats,
    };
  });
}
