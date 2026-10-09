import type { SortOrder, VideoItem, VideoSortField } from '../types';

// ============================================================================
// SORTING HELPERS
// ============================================================================

/**
 * Sorts video items in-memory.
 */
export function sortVideos(
  videos: VideoItem[],
  sortBy: VideoSortField,
  order: SortOrder = 'desc'
): VideoItem[] {
  const factor = order === 'asc' ? 1 : -1;

  return [...videos].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title) * factor;
      case 'name':
        return a.filename.localeCompare(b.filename) * factor;
      case 'duration':
        return (a.duration - b.duration) * factor;
      case 'size':
        return (a.size - b.size) * factor;
      case 'dateAdded':
        return (a.createdAt - b.createdAt) * factor;
      case 'dateModified':
      default:
        return (a.modifiedAt - b.modifiedAt) * factor;
    }
  });
}
