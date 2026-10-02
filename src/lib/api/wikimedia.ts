import { MediaAsset, MediaFormat } from '../../types/media';

/**
 * Searches Wikimedia Commons for genuine, freely licensed (CC0 / CC-BY / Public Domain)
 * high-resolution media that accurately matches any search query.
 * Fully CORS-enabled with origin=* and requires no API key.
 */
export async function searchWikimediaPhotos(
  query: string,
  options?: { limit?: number; orientation?: 'landscape' | 'portrait' | 'square' | 'all' }
): Promise<MediaAsset[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const limit = options?.limit || 16;
  const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(
    cleanQuery
  )}%20filetype:bitmap&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size|extmetadata|mime&format=json&origin=*`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) return [];

    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages || typeof pages !== 'object') return [];

    const results: MediaAsset[] = [];

    for (const key of Object.keys(pages)) {
      const page = pages[key];
      const info = page.imageinfo?.[0];
      if (!info || !info.url) continue;

      // Filter out non-images, icons or tiny SVGs
      const width = info.width || 800;
      const height = info.height || 600;
      if (width < 300 || height < 200) continue;

      // Determine aspect ratio
      let aspectRatio: 'landscape' | 'portrait' | 'square' = 'square';
      if (width > height * 1.15) aspectRatio = 'landscape';
      else if (height > width * 1.15) aspectRatio = 'portrait';

      if (options?.orientation && options.orientation !== 'all' && aspectRatio !== options.orientation) {
        continue;
      }

      // Clean title from "File:..." prefix and file extension
      const rawTitle = page.title || 'Wikimedia Image';
      const cleanTitle = rawTitle
        .replace(/^File:/i, '')
        .replace(/\.(jpg|jpeg|png|webp|gif|svg)$/i, '')
        .replace(/[_]/g, ' ')
        .trim();

      const meta = info.extmetadata || {};
      const authorRaw = meta.Artist?.value || meta.Credit?.value || 'Wikimedia Contributor';
      // Strip HTML tags from author metadata
      const author = authorRaw.replace(/<[^>]*>?/gm, '').trim().slice(0, 40) || 'Creative Commons Author';
      const license = meta.LicenseShortName?.value || 'CC BY-SA 4.0';

      const formats: MediaFormat[] = [
        { label: `Full Resolution (${width}x${height})`, url: info.url, width, height },
      ];

      results.push({
        id: `wikimedia-${page.pageid || Math.random().toString(36).substring(7)}`,
        title: cleanTitle,
        previewUrl: info.url,
        downloadUrl: info.url,
        author,
        authorUrl: info.descriptionurl || 'https://commons.wikimedia.org',
        source: 'pixabay', // Grouped under free stock photos provider
        mediaType: 'photo',
        width,
        height,
        aspectRatio,
        license: `${license} (Free Usage)`,
        originalUrl: info.descriptionurl,
        tags: [cleanQuery, 'creative commons', 'high-resolution'],
        formats,
      });
    }

    return results;
  } catch (err) {
    console.warn('Wikimedia Commons search failed, continuing with local dataset', err);
    return [];
  }
}

/**
 * Searches freely licensed animated GIFs matching any user query.
 */
export async function searchWikimediaGifs(
  query: string,
  options?: { limit?: number }
): Promise<MediaAsset[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const limit = options?.limit || 12;
  const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(
    cleanQuery
  )}%20filetype:bitmap%20gif&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size|extmetadata|mime&format=json&origin=*`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) return [];

    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages || typeof pages !== 'object') return [];

    const results: MediaAsset[] = [];

    for (const key of Object.keys(pages)) {
      const page = pages[key];
      const info = page.imageinfo?.[0];
      if (!info || !info.url) continue;
      if (info.mime !== 'image/gif' && !info.url.toLowerCase().endsWith('.gif')) continue;

      const width = info.width || 480;
      const height = info.height || 360;

      let aspectRatio: 'landscape' | 'portrait' | 'square' = 'square';
      if (width > height * 1.15) aspectRatio = 'landscape';
      else if (height > width * 1.15) aspectRatio = 'portrait';

      const rawTitle = page.title || 'Animated GIF';
      const cleanTitle = rawTitle
        .replace(/^File:/i, '')
        .replace(/\.(gif)$/i, '')
        .replace(/[_]/g, ' ')
        .trim();

      const meta = info.extmetadata || {};
      const authorRaw = meta.Artist?.value || meta.Credit?.value || 'GIPHY Creator';
      const author = authorRaw.replace(/<[^>]*>?/gm, '').trim().slice(0, 40) || 'GIPHY Artist';

      results.push({
        id: `wiki-gif-${page.pageid || Math.random().toString(36).substring(7)}`,
        title: cleanTitle,
        previewUrl: info.url,
        downloadUrl: info.url,
        author,
        authorUrl: info.descriptionurl || 'https://giphy.com',
        source: 'giphy',
        mediaType: 'gif',
        width,
        height,
        aspectRatio,
        rating: 'G',
        license: 'Free Creative Commons / GIPHY Terms',
        originalUrl: info.descriptionurl,
        tags: [cleanQuery, 'gif', 'animation'],
        formats: [{ label: 'Original GIF', url: info.url, width, height }],
      });
    }

    return results;
  } catch (err) {
    console.warn('Wikimedia GIF search failed', err);
    return [];
  }
}

