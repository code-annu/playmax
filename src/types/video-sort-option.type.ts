import type { SortOrder } from './sort-order.type';
import type { VideoSortField } from './video-sort-field.type';

/**
 * Combined sort configuration.
 */
export interface VideoSortOption {
  field: VideoSortField;
  order: SortOrder;
}
