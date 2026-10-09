import {
  Asset,
  AssetField,
  MediaType,
  Query,
} from 'expo-media-library';

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
 * Fetches videos from device storage using the modern Expo MediaLibrary Query API.
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

  // Construct Query with the new Expo MediaLibrary Query API
  let query = new Query().eq(AssetField.MEDIA_TYPE, MediaType.VIDEO);

  // Apply MediaStore level sorting when applicable
  switch (sortBy) {
    case 'dateAdded':
      query = query.orderBy({ key: AssetField.CREATION_TIME, ascending });
      break;
    case 'dateModified':
      query = query.orderBy({ key: AssetField.MODIFICATION_TIME, ascending });
      break;
    case 'duration':
      query = query.orderBy({ key: AssetField.DURATION, ascending });
      break;
    default:
      // Default sort by modification time descending
      query = query.orderBy({ key: AssetField.MODIFICATION_TIME, ascending });
      break;
  }

  // Set pagination
  query = query.limit(limit).offset(offset);

  // Execute query
  const rawAssets = await query.exe();

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

  const hasMore = rawAssets.length === limit;
  const nextOffset = offset + rawAssets.length;

  return {
    videos,
    totalCount: videos.length,
    hasMore,
    nextOffset,
  };
}

/**
 * Fetches a single video by its ID / Content URI.
 */
export async function fetchVideoById(id: string): Promise<VideoItem | null> {
  try {
    const asset = new Asset(id);
    return await mapAssetToVideoItem(asset, { includeFileSize: true });
  } catch {
    return null;
  }
}
