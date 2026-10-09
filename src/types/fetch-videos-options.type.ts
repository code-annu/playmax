import type { SortOrder } from './sort-order.type';
import type { VideoSortField } from './video-sort-field.type';

/**
 * Query options when fetching videos from device storage.
 */
export interface FetchVideosOptions {
  /** Number of videos to fetch (default: 50) */
  limit?: number;

  /** Number of videos to skip for pagination */
  offset?: number;

  /** Sorting field */
  sortBy?: VideoSortField;

  /** Sorting order ('asc' | 'desc') */
  sortOrder?: SortOrder;

  /** Filter by specific folder name */
  folderName?: string;

  /** Include exact file size calculation (reads file metadata) */
  includeFileSize?: boolean;

  /** Only fetch videos marked as favorites */
  onlyFavorites?: boolean;

  /** Search text filter on title or filename */
  searchQuery?: string;
}
