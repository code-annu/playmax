import type { VideoItem } from './video-item.type';

/**
 * Grouped folder representation (e.g., MX Player / VLC folder-based browsing mode).
 */
export interface VideoFolder {
  /** Unique identifier for folder (usually folder path or name) */
  id: string;

  /** Display name of the folder */
  name: string;

  /** Full directory path of the folder */
  path: string;

  /** Total number of videos in this folder */
  videoCount: number;

  /** Total cumulative duration in seconds */
  totalDuration: number;

  /** Human-readable total duration */
  totalDurationFormatted: string;

  /** Cumulative size of all videos in bytes */
  totalSize: number;

  /** Human-readable cumulative size */
  totalSizeFormatted: string;

  /** Cover image URI (typically the most recent video's thumbnail) */
  coverUri?: string;

  /** Timestamp of the most recently modified/added video in the folder */
  latestVideoDate: number;

  /** Optional list of videos in this folder */
  videos?: VideoItem[];
}
