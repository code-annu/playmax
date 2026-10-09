import {
  getAssetInfoAsync,
  getAssetsAsync,
  MediaType,
  SortBy,
  type SortByKey,
} from 'expo-media-library/legacy';

import type {
  FetchVideosOptions,
  FetchVideosResult,
  VideoItem,
} from '../types';
import { batchMapAssetsToVideoItems, mapAssetToVideoItem } from './video-mapper.util';
import { requestVideoPermissions } from './video-permission.util';
import { sortVideos } from './video-sort.util';

// ============================================================================
// CORE FETCHING FUNCTIONS
// ============================================================================

/**
 * Fetches videos from device storage using Expo MediaLibrary.
 * Supports pagination, sorting, search, and folder filtering.
 */
export async function fetchDeviceVideos(
  options: FetchVideosOptions = {}
): Promise<FetchVideosResult> {
  const permission = await requestVideoPermissions();
  if (!permission.granted) {
    return {
      videos: [],
      totalCount: 0,
      hasMore: false,
      nextOffset: 0,
    };
  }

  const limit = options.limit ?? 50;
  const offset = options.offset ?? 0;
  const sortBy = options.sortBy ?? 'dateModified';
  const sortOrder = options.sortOrder ?? 'desc';
  const ascending = sortOrder === 'asc';

  let legacySortKey: SortByKey = SortBy.modificationTime;
  switch (sortBy) {
    case 'dateAdded':
      legacySortKey = SortBy.creationTime;
      break;
    case 'dateModified':
      legacySortKey = SortBy.modificationTime;
      break;
    case 'duration':
      legacySortKey = SortBy.duration;
      break;
    default:
      legacySortKey = SortBy.modificationTime;
      break;
  }

  // Execute query via getAssetsAsync
  const pageResult = await getAssetsAsync({
    mediaType: [MediaType.video],
    sortBy: [[legacySortKey, ascending]],
    first: limit,
  });

  const rawAssets = pageResult.assets || [];

  // Convert Asset instances into rich VideoItem models
  let videos = await batchMapAssetsToVideoItems(rawAssets, {
    includeFileSize: options.includeFileSize,
  });

  // Client-side filtering if requested
  if (options.folderName) {
    const targetFolder = options.folderName.toLowerCase();
    videos = videos.filter(
      (v) => v.parentDir.toLowerCase() === targetFolder
    );
  }

  if (options.onlyFavorites) {
    videos = videos.filter((v) => v.isFavorite);
  }

  if (options.searchQuery && options.searchQuery.trim().length > 0) {
    const queryTerm = options.searchQuery.toLowerCase().trim();
    videos = videos.filter(
      (v) =>
        v.title.toLowerCase().includes(queryTerm) ||
        v.filename.toLowerCase().includes(queryTerm) ||
        v.parentDir.toLowerCase().includes(queryTerm)
    );
  }

  // Handle client-side sorting for fields not supported directly by MediaStore query (e.g. title, name, size)
  if (sortBy === 'title' || sortBy === 'name' || sortBy === 'size') {
    videos = sortVideos(videos, sortBy, sortOrder);
  }

  const hasMore = pageResult.hasNextPage ?? (rawAssets.length === limit);
  const nextOffset = offset + rawAssets.length;

  return {
    videos,
    totalCount: pageResult.totalCount ?? videos.length,
    hasMore,
    nextOffset,
  };
}

/**
 * Fetches a single video by its ID / Content URI.
 */
export async function fetchVideoById(id: string): Promise<VideoItem | null> {
  try {
    const asset = await getAssetInfoAsync(id);
    if (!asset) return null;
    return await mapAssetToVideoItem(asset, { includeFileSize: true });
  } catch {
    return null;
  }
}
