import JSZip from 'jszip';
import { MediaAsset } from '../../types/media';

export interface ZipExportProgress {
  current: number;
  total: number;
  percentage: number;
  currentFilename: string;
  status: 'fetching' | 'compressing' | 'completed' | 'error';
  errorMessage?: string;
}

/**
 * Downloads a URL as a Blob, with proxy fallback for CORS
 */
async function fetchAssetBlob(url: string): Promise<Blob> {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.blob();
  } catch (err) {
    // Attempt through proxy route if available
    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
      const pRes = await fetch(proxyUrl);
      if (pRes.ok) return await pRes.blob();
    } catch {
      // Fallback: create mock stub file so zip continues
    }
    throw new Error(`Could not fetch asset: ${url}`);
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
}

function getFileExtension(asset: MediaAsset, fallbackUrl: string): string {
  if (asset.mediaType === 'audio') return 'mp3';
  if (asset.mediaType === 'video') return 'mp4';
  if (asset.mediaType === 'gif' || asset.mediaType === 'sticker') return 'gif';
  if (fallbackUrl.includes('.png')) return 'png';
  if (fallbackUrl.includes('.webp')) return 'webp';
  return 'jpg';
}

export async function exportAssetsAsZip(
  assets: MediaAsset[],
  onProgress?: (progress: ZipExportProgress) => void
): Promise<Blob> {
  if (!assets || assets.length === 0) {
    throw new Error('Project bin is empty. Add assets before exporting.');
  }

  const zip = new JSZip();
  const photosFolder = zip.folder('photos');
  const videosFolder = zip.folder('videos');
  const audioFolder = zip.folder('audio');
  const gifsFolder = zip.folder('gifs');
  const stickersFolder = zip.folder('stickers');

  const total = assets.length;
  let attributionLines: string[] = [
    '========================================================================',
    ' MEDIAVAULT PROJECT ASSET CREDITS & ATTRIBUTION MANIFEST',
    ` Generated: ${new Date().toLocaleString()}`,
    ` Total Assets: ${total}`,
    '========================================================================\n',
  ];

  for (let i = 0; i < total; i++) {
    const asset = assets[i];
    const sanitizedTitle = sanitizeFilename(asset.title || `asset_${asset.id}`);
    const ext = getFileExtension(asset, asset.downloadUrl || asset.previewUrl);
    const filename = `${String(i + 1).padStart(2, '0')}_${sanitizedTitle}.${ext}`;

    onProgress?.({
      current: i + 1,
      total,
      percentage: Math.round(((i) / total) * 90),
      currentFilename: filename,
      status: 'fetching',
    });

    // Record attribution info
    attributionLines.push(
      `[${i + 1}] ${asset.title}`,
      `    Type:        ${asset.mediaType.toUpperCase()}`,
      `    Source:      ${asset.source.toUpperCase()}`,
      `    Creator:     ${asset.author}`,
      `    Creator URL: ${asset.authorUrl || 'N/A'}`,
      `    License:     ${asset.license || 'Free Standard'}`,
      `    Direct URL:  ${asset.downloadUrl || asset.previewUrl}`,
      `    Original:    ${asset.originalUrl || 'N/A'}\n`
    );

    // Pick target folder
    let targetFolder = photosFolder;
    if (asset.mediaType === 'video') targetFolder = videosFolder;
    else if (asset.mediaType === 'audio') targetFolder = audioFolder;
    else if (asset.mediaType === 'gif') targetFolder = gifsFolder;
    else if (asset.mediaType === 'sticker') targetFolder = stickersFolder;

    try {
      const urlToFetch = asset.downloadUrl || asset.previewUrl;
      const blob = await fetchAssetBlob(urlToFetch);
      targetFolder?.file(filename, blob);
    } catch (e) {
      console.warn(`Failed to fetch media blob for ${asset.title}, inserting metadata link`, e);
      // Create a markdown shortcut pointer if blob download failed due to provider restrictions
      targetFolder?.file(
        `${filename}.txt`,
        `Asset could not be downloaded directly due to cross-origin CDN security.\nDirect Download Link: ${asset.downloadUrl || asset.previewUrl}\nOriginal Page: ${asset.originalUrl}`
      );
    }
  }

  // Add ATTRIBUTIONS.txt
  zip.file('ATTRIBUTIONS.txt', attributionLines.join('\n'));

  // Add README.md
  const readmeContent = `# MediaVault Export Package
Exported on: ${new Date().toISOString()}

## Folder Structure:
- \`/photos\`: High-resolution stock imagery
- \`/videos\`: Video clips and b-roll footage
- \`/audio\`: Sound effects, foley, and ambient audio
- \`/gifs\`: Animated GIF reaction clips
- \`/stickers\`: Transparent animated sticker overlays
- \`ATTRIBUTIONS.txt\`: Formatted credits for video descriptions, podcasts, and articles.

Thank you for using MediaVault!
`;
  zip.file('README.md', readmeContent);

  onProgress?.({
    current: total,
    total,
    percentage: 95,
    currentFilename: 'Compacting zip archive...',
    status: 'compressing',
  });

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  onProgress?.({
    current: total,
    total,
    percentage: 100,
    currentFilename: 'Archive ready!',
    status: 'completed',
  });

  return zipBlob;
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
