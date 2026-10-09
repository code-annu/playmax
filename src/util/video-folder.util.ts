import {
  type Album,
  getAlbumsAsync,
  getAssetsAsync,
  MediaType,
} from 'expo-media-library/legacy';

import type { VideoFolder, VideoItem } from '../types';
import { fetchDeviceVideos } from './video-fetch.util';
import { formatDuration, formatFileSize } from './video-format.util';
import { batchMapAssetsToVideoItems } from './video-mapper.util';
import { requestVideoPermissions } from './video-permission.util';

// ============================================================================
// FOLDER BROWSING & GROUPING
// ============================================================================

/**
 * Groups a list of VideoItems into folders (e.g., MX Player / VLC folder view).
 */
export function groupVideosByFolder(videos: VideoItem[]): VideoFolder[] {
  const folderMap = new Map<string, VideoItem[]>();

  for (const video of videos) {
    const key = video.parentDirPath || video.parentDir || 'Videos';
    const existing = folderMap.get(key) || [];
    existing.push(video);
    folderMap.set(key, existing);
  }

  const folders: VideoFolder[] = [];

  for (const [folderPath, folderVideos] of folderMap.entries()) {
    const firstVideo = folderVideos[0];
    const folderName = firstVideo.parentDir || 'Videos';
    const videoCount = folderVideos.length;

    // Calculate totals
    const totalDuration = folderVideos.reduce(
      (acc, v) => acc + (v.duration || 0),
      0
    );
    const totalSize = folderVideos.reduce((acc, v) => acc + (v.size || 0), 0);

    // Latest modified date
    const latestVideoDate = Math.max(
      ...folderVideos.map((v) => v.modifiedAt || v.createdAt || 0)
    );

    // Cover URI: newest video in folder
    const newestVideo = [...folderVideos].sort(
      (a, b) => (b.modifiedAt || 0) - (a.modifiedAt || 0)
    )[0];

    folders.push({
      id: folderPath,
      name: folderName,
      path: folderPath,
      videoCount,
      totalDuration,
      totalDurationFormatted: formatDuration(totalDuration),
      totalSize,
      totalSizeFormatted:
        totalSize > 0 ? formatFileSize(totalSize) : '--',
      coverUri: newestVideo?.coverUri || firstVideo?.coverUri,
      latestVideoDate,
      videos: folderVideos,
    });
  }

  // Sort folders alphabetically by folder name
  return folders.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Fetches all video folders directly by querying device albums and assets.
 */
export async function fetchVideoFolders(): Promise<VideoFolder[]> {
  const permission = await requestVideoPermissions();
  if (!permission.granted) {
    return [];
  }

  try {
    // Attempt 1: Fetch via device albums
    const albums: Album[] = await getAlbumsAsync();
    const folderList: VideoFolder[] = [];

    for (const album of albums) {
      try {
        const albumAssetsResult = await getAssetsAsync({
          album: album.id,
          mediaType: [MediaType.video],
          first: 100,
        });
        const videoAssets = albumAssetsResult.assets || [];

        if (videoAssets.length > 0) {
          const title = album.title || 'Videos';
          const items = await batchMapAssetsToVideoItems(videoAssets, {
            includeFileSize: false,
          });

          const totalDuration = items.reduce(
            (acc, v) => acc + (v.duration || 0),
            0
          );
          const totalSize = items.reduce((acc, v) => acc + (v.size || 0), 0);
          const latestVideoDate = Math.max(
            ...items.map((v) => v.modifiedAt || 0)
          );

          folderList.push({
            id: album.id,
            name: title,
            path: title,
            videoCount: items.length,
            totalDuration,
            totalDurationFormatted: formatDuration(totalDuration),
            totalSize,
            totalSizeFormatted:
              totalSize > 0 ? formatFileSize(totalSize) : '--',
            coverUri: items[0]?.coverUri,
            latestVideoDate,
            videos: items,
          });
        }
      } catch {
        // Continue processing other albums
      }
    }

    if (folderList.length > 0) {
      return folderList.sort((a, b) => a.name.localeCompare(b.name));
    }
  } catch {
    // If albums fail or return empty, fallback to querying all videos and grouping
  }

  // Fallback: Query all videos and group by parent directory
  const { videos } = await fetchDeviceVideos({ limit: 500 });
  return groupVideosByFolder(videos);
}
