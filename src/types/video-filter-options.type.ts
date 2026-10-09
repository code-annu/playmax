import type { VideoResolution } from './video-resolution.type';

/**
 * Filtering options when querying videos.
 */
export interface VideoFilterOptions {
  searchQuery?: string;
  folderName?: string;
  minDuration?: number;
  maxDuration?: number;
  resolution?: VideoResolution;
  isFavorite?: boolean;
  extensions?: string[];
}
