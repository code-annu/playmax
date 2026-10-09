import type { VideoFilterOptions, VideoItem } from '../types';

// ============================================================================
// FILTERING HELPERS
// ============================================================================

/**
 * Filters video items based on arbitrary criteria.
 */
export function filterVideos(
  videos: VideoItem[],
  filters: VideoFilterOptions
): VideoItem[] {
  return videos.filter((v) => {
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      const match =
        v.title.toLowerCase().includes(q) ||
        v.filename.toLowerCase().includes(q) ||
        v.parentDir.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filters.folderName) {
      if (
        v.parentDir.toLowerCase() !== filters.folderName.toLowerCase()
      ) {
        return false;
      }
    }

    if (
      typeof filters.minDuration === 'number' &&
      v.duration < filters.minDuration
    ) {
      return false;
    }

    if (
      typeof filters.maxDuration === 'number' &&
      v.duration > filters.maxDuration
    ) {
      return false;
    }

    if (filters.resolution && v.resolution !== filters.resolution) {
      return false;
    }

    if (
      typeof filters.isFavorite === 'boolean' &&
      v.isFavorite !== filters.isFavorite
    ) {
      return false;
    }

    if (filters.extensions && filters.extensions.length > 0) {
      const exts = filters.extensions.map((e) => e.toLowerCase());
      if (!exts.includes(v.extension.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}
