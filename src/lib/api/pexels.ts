import { MediaAsset, MediaFormat } from '../../types/media';

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  alt: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

interface PexelsVideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  link: string;
}

interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  url: string;
  image: string;
  user: {
    name: string;
    url: string;
  };
  video_files: PexelsVideoFile[];
  video_pictures: { id: number; picture: string }[];
}

export async function searchPexelsPhotos(
  apiKey: string,
  query: string,
  options?: { perPage?: number; page?: number; orientation?: string }
): Promise<MediaAsset[]> {
  if (!apiKey) {
    throw new Error('Pexels API key is required. Please set it in Settings.');
  }

  const perPage = options?.perPage || 20;
  const page = options?.page || 1;
  const orientation = options?.orientation && options.orientation !== 'all' ? `&orientation=${options.orientation}` : '';
  
  const endpoint = query.trim()
    ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}${orientation}`
    : `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${page}`;

  const res = await fetch(endpoint, {
    headers: {
      Authorization: apiKey,
    },
  });

  if (res.status === 429) {
    throw new Error('Pexels API rate limit exceeded (200 requests/hour). Try again later or use Demo Mode.');
  }

  if (res.status === 401 || res.status === 403) {
    throw new Error('Invalid Pexels API key. Please check your credentials in Settings.');
  }

  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const photos: PexelsPhoto[] = data.photos || [];

  return photos.map((p) => {
    const aspectRatio: 'landscape' | 'portrait' | 'square' =
      p.width > p.height * 1.1 ? 'landscape' : p.height > p.width * 1.1 ? 'portrait' : 'square';

    const formats: MediaFormat[] = [
      { label: 'Original', url: p.src.original, width: p.width, height: p.height },
      { label: 'Large (2x)', url: p.src.large2x, width: Math.min(p.width, 1920) },
      { label: 'Medium', url: p.src.medium, width: 800 },
      { label: 'Small', url: p.src.small, width: 400 },
    ];

    return {
      id: `pexels-photo-${p.id}`,
      title: p.alt || `Photo by ${p.photographer}`,
      previewUrl: p.src.medium || p.src.large,
      downloadUrl: p.src.original || p.src.large2x,
      author: p.photographer || 'Pexels Contributor',
      authorUrl: p.photographer_url,
      source: 'pexels',
      mediaType: 'photo',
      width: p.width,
      height: p.height,
      aspectRatio,
      license: 'Free to use (Pexels License)',
      originalUrl: p.url,
      tags: p.alt ? p.alt.split(' ').slice(0, 4) : ['pexels', 'photo'],
      formats,
    };
  });
}

export async function searchPexelsVideos(
  apiKey: string,
  query: string,
  options?: { perPage?: number; page?: number; orientation?: string }
): Promise<MediaAsset[]> {
  if (!apiKey) {
    throw new Error('Pexels API key is required. Please set it in Settings.');
  }

  const perPage = options?.perPage || 15;
  const page = options?.page || 1;
  const orientation = options?.orientation && options.orientation !== 'all' ? `&orientation=${options.orientation}` : '';

  const endpoint = query.trim()
    ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}${orientation}`
    : `https://api.pexels.com/videos/popular?per_page=${perPage}&page=${page}`;

  const res = await fetch(endpoint, {
    headers: {
      Authorization: apiKey,
    },
  });

  if (res.status === 429) {
    throw new Error('Pexels API rate limit exceeded. Try again later or use Demo Mode.');
  }

  if (res.status === 401 || res.status === 403) {
    throw new Error('Invalid Pexels API key. Please check your credentials in Settings.');
  }

  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const videos: PexelsVideo[] = data.videos || [];

  return videos.map((v) => {
    const mp4Files = (v.video_files || []).filter((f) => f.file_type === 'video/mp4' || !f.file_type);
    // Sort highest resolution first
    mp4Files.sort((a, b) => (b.width || 0) - (a.width || 0));

    const highest = mp4Files[0];
    const previewFile = mp4Files.find((f) => f.quality === 'sd' || (f.width && f.width <= 720)) || mp4Files[mp4Files.length - 1] || highest;

    const formats: MediaFormat[] = mp4Files.map((f) => ({
      label: `${f.quality ? f.quality.toUpperCase() : 'MP4'} (${f.width || '?'}x${f.height || '?'})`,
      url: f.link,
      width: f.width,
      height: f.height,
      quality: f.quality,
    }));

    const aspectRatio: 'landscape' | 'portrait' | 'square' =
      v.width > v.height * 1.1 ? 'landscape' : v.height > v.width * 1.1 ? 'portrait' : 'square';

    return {
      id: `pexels-video-${v.id}`,
      title: `Video by ${v.user?.name || 'Pexels Creator'}`,
      previewUrl: previewFile?.link || v.image,
      downloadUrl: highest?.link || previewFile?.link || '',
      author: v.user?.name || 'Pexels Creator',
      authorUrl: v.user?.url,
      source: 'pexels',
      mediaType: 'video',
      width: v.width,
      height: v.height,
      duration: v.duration,
      aspectRatio,
      license: 'Free to use (Pexels License)',
      originalUrl: v.url,
      tags: ['pexels', 'video', `${Math.round(v.duration)}s`],
      formats,
    };
  });
}
