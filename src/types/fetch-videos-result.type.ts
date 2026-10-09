import type { VideoItem } from './video-item.type';

/**
 * Result returned by paginated video queries.
 */
export interface FetchVideosResult {
  videos: VideoItem[];
  totalCount: number;
  hasMore: boolean;
  nextOffset: number;
}
