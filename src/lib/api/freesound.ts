import { MediaAsset, MediaFormat, FreesoundDurationFilter } from '../../types/media';

interface FreesoundSound {
  id: number;
  name: string;
  tags: string[];
  description: string;
  previews: {
    'preview-hq-mp3'?: string;
    'preview-lq-mp3'?: string;
    'preview-hq-ogg'?: string;
    'preview-lq-ogg'?: string;
  };
  duration: number;
  username: string;
  license: string;
  images: {
    spectral_m?: string;
    waveform_m?: string;
  };
  url: string;
}

// Generate realistic simulated waveform bars if not provided
export function generateWaveformSamples(duration: number, seedStr = ''): number[] {
  const barsCount = 48;
  const bars: number[] = [];
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  
  for (let i = 0; i < barsCount; i++) {
    const pseudoRandom = Math.abs(Math.sin((i + 1) * 997 + hash * 0.1));
    const envelope = Math.sin((i / barsCount) * Math.PI); // envelope shaping
    const value = Math.max(0.12, Math.min(0.98, pseudoRandom * 0.75 + envelope * 0.35));
    bars.push(parseFloat(value.toFixed(2)));
  }
  return bars;
}

export async function searchFreesound(
  apiKey: string,
  query: string,
  options?: {
    pageSize?: number;
    page?: number;
    duration?: FreesoundDurationFilter;
  }
): Promise<MediaAsset[]> {
  if (!apiKey) {
    throw new Error('Freesound API key is required. Please set it in Settings.');
  }

  const pageSize = options?.pageSize || 20;
  const page = options?.page || 1;
  const q = encodeURIComponent(query.trim() || 'sound fx');

  let filterParam = '';
  if (options?.duration === 'short') {
    filterParam = '&filter=duration:[0+TO+5]';
  } else if (options?.duration === 'medium') {
    filterParam = '&filter=duration:[5.001+TO+30]';
  } else if (options?.duration === 'long') {
    filterParam = '&filter=duration:[30.001+TO+300]';
  }

  const endpoint = `https://freesound.org/apiv2/search/text/?token=${encodeURIComponent(
    apiKey
  )}&query=${q}&page_size=${pageSize}&page=${page}&fields=id,name,tags,description,previews,duration,username,license,images,url${filterParam}`;

  const res = await fetch(endpoint);

  if (res.status === 429) {
    throw new Error('Freesound API rate limit exceeded. Please wait a moment or switch to Demo Mode.');
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error('Invalid Freesound API key. Please check your credentials in Settings.');
    }
    throw new Error(`Freesound API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const sounds: FreesoundSound[] = data.results || [];

  return sounds.map((s) => {
    const audioUrl = s.previews?.['preview-hq-mp3'] || s.previews?.['preview-lq-mp3'] || s.previews?.['preview-hq-ogg'] || '';
    
    const formats: MediaFormat[] = [];
    if (s.previews?.['preview-hq-mp3']) {
      formats.push({ label: 'HQ MP3 Audio', url: s.previews['preview-hq-mp3'], quality: 'High (192kbps)' });
    }
    if (s.previews?.['preview-lq-mp3']) {
      formats.push({ label: 'LQ MP3 Audio', url: s.previews['preview-lq-mp3'], quality: 'Low (64kbps)' });
    }
    if (s.previews?.['preview-hq-ogg']) {
      formats.push({ label: 'HQ OGG Audio', url: s.previews['preview-hq-ogg'], quality: 'High OGG' });
    }

    const waveform = generateWaveformSamples(s.duration || 10, s.name);

    return {
      id: `freesound-${s.id}`,
      title: s.name.replace(/\.[a-zA-Z0-9]+$/, '') || `Sound #${s.id}`,
      previewUrl: audioUrl,
      downloadUrl: audioUrl,
      author: s.username || 'Freesound Creator',
      authorUrl: `https://freesound.org/people/${encodeURIComponent(s.username)}/`,
      source: 'freesound',
      mediaType: 'audio',
      duration: s.duration,
      license: s.license ? s.license.replace('http://creativecommons.org/licenses/', 'CC-') : 'Creative Commons',
      originalUrl: s.url,
      tags: (s.tags || []).slice(0, 5),
      formats,
      waveform,
    };
  });
}
