import type { Asset } from 'expo-media-library/legacy';
import { getAssetInfoAsync } from 'expo-media-library/legacy';

import type {
  VideoItem,
  VideoOrientation,
  VideoResolution,
} from '../types';
import { formatDuration, formatFileSize } from './video-format.util';
import {
  cleanVideoTitle,
  getFileExtension,
  getMimeType,
  getResolutionLabel,
  getSafeFileSize,
  getVideoOrientation,
  parseParentDirectory,
} from './video-metadata.util';

// ============================================================================
// ASSET TO VIDEOITEM MAPPING
// ============================================================================

/**
 * Maps an Expo MediaLibrary Asset to our comprehensive VideoItem model.
 */
export async function mapAssetToVideoItem(
  asset: Asset,
  options?: { includeFileSize?: boolean }
): Promise<VideoItem> {
  let info: any = asset;
  try {
    info = await getAssetInfoAsync(asset);
  } catch {
    info = asset;
  }

  const id = asset.id || info?.id;
  const uri = info?.localUri || info?.uri || asset.uri || asset.id;
  const filename = asset.filename || info?.filename || `video_${id}.mp4`;
  const durationSec = typeof asset.duration === 'number' ? asset.duration : typeof info?.duration === 'number' ? info.duration : 0;
  const durationMs = Math.round(durationSec * 1000);
  const width = typeof asset.width === 'number' ? asset.width : typeof info?.width === 'number' ? info.width : 0;
  const height = typeof asset.height === 'number' ? asset.height : typeof info?.height === 'number' ? info.height : 0;
  const aspectRatio = width > 0 && height > 0 ? width / height : 16 / 9;
  const resolution = getResolutionLabel(width, height);
  const orientation = getVideoOrientation(width, height);
  const extension = getFileExtension(filename);
  const mimeType = getMimeType(extension);
  const title = cleanVideoTitle(filename);

  const { parentDir, parentDirPath, absolutePath } = parseParentDirectory(
    uri,
    filename
  );

  // File size check if enabled
  const size = options?.includeFileSize ? getSafeFileSize(uri) : 0;
  const sizeFormatted = size > 0 ? formatFileSize(size) : '--';

  const createdAt = asset.creationTime || info?.creationTime || Date.now();
  const modifiedAt = asset.modificationTime || info?.modificationTime || createdAt;
  const isFavorite = Boolean(info?.isFavorite);

  // Use contentUri or uri for thumbnail/cover
  const coverUri = uri || id;

  return {
    id,
    title,
    filename,
    uri,
    absolutePath,
    parentDir,
    parentDirPath,
    coverUri,
    duration: durationSec,
    durationMs,
    durationFormatted: formatDuration(durationSec),
    size,
    sizeFormatted,
    width,
    height,
    aspectRatio,
    resolution,
    orientation,
    mimeType,
    extension,
    createdAt,
    modifiedAt,
    isFavorite,
  };
}

/**
 * Concurrent batch processing of assets with concurrency limit to preserve memory.
 */
export async function batchMapAssetsToVideoItems(
  assets: Asset[],
  options?: { includeFileSize?: boolean; concurrency?: number }
): Promise<VideoItem[]> {
  const concurrency = options?.concurrency || 8;
  const results: VideoItem[] = [];

  for (let i = 0; i < assets.length; i += concurrency) {
    const chunk = assets.slice(i, i + concurrency);
    const chunkResults = await Promise.all(
      chunk.map(async (asset) => {
        try {
          return await mapAssetToVideoItem(asset, options);
        } catch {
          // If a single asset fails to load, gracefully create a minimal fallback
          const fallbackUri = asset.uri || asset.id;
          return {
            id: asset.id,
            title: `Video ${asset.id}`,
            filename: asset.filename || `video_${asset.id}.mp4`,
            uri: fallbackUri,
            absolutePath: fallbackUri,
            parentDir: 'Videos',
            parentDirPath: 'Videos',
            coverUri: fallbackUri,
            duration: 0,
            durationMs: 0,
            durationFormatted: '00:00',
            size: 0,
            sizeFormatted: '--',
            width: 0,
            height: 0,
            aspectRatio: 16 / 9,
            resolution: 'Unknown' as VideoResolution,
            orientation: 'landscape' as VideoOrientation,
            mimeType: 'video/mp4',
            extension: 'mp4',
            createdAt: Date.now(),
            modifiedAt: Date.now(),
            isFavorite: false,
          };
        }
      })
    );
    results.push(...chunkResults);
  }

  return results;
}
