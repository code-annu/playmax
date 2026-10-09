import type { VideoOrientation } from './video-orientation.type';
import type { VideoResolution } from './video-resolution.type';

/**
 * Core model representing a video file on the device.
 * Inspired by production players like MX Player, VLC, Nova Video Player, and Google Photos.
 */
export interface VideoItem {
  /** Unique ID / Content URI from device MediaStore or Photo Library */
  id: string;

  /** Display title, cleaned from file extension and special delimiter characters */
  title: string;

  /** Actual file name with extension (e.g., "my_vacation_2024.mp4") */
  filename: string;

  /** Playable URI (content:// or file://) compatible with expo-video / VideoView */
  uri: string;

  /** Absolute physical filesystem path (e.g. "/storage/emulated/0/DCIM/Camera/VID.mp4") */
  absolutePath: string;

  /** Display name of the parent folder (e.g., "Camera", "Movies", "WhatsApp Video") */
  parentDir: string;

  /** Full directory path of the parent folder */
  parentDirPath: string;

  /** Poster / Cover image URI (uses contentUri or generated thumbnail for display) */
  coverUri: string;

  /** Duration of the video in seconds */
  duration: number;

  /** Duration of the video in milliseconds */
  durationMs: number;

  /** Human-readable formatted duration (e.g. "01:23:45" or "04:12") */
  durationFormatted: string;

  /** File size in bytes */
  size: number;

  /** Human-readable file size (e.g., "450 MB", "1.24 GB") */
  sizeFormatted: string;

  /** Video frame width in pixels */
  width: number;

  /** Video frame height in pixels */
  height: number;

  /** Video aspect ratio (width / height) */
  aspectRatio: number;

  /** Standard resolution label ('4K', '1080p', '720p', etc.) */
  resolution: VideoResolution;

  /** Orientation ('landscape' | 'portrait' | 'square') */
  orientation: VideoOrientation;

  /** Video MIME type (e.g., "video/mp4", "video/x-matroska", "video/webm") */
  mimeType: string;

  /** File extension without dot (e.g., "mp4", "mkv", "mov", "avi") */
  extension: string;

  /** Creation timestamp in milliseconds */
  createdAt: number;

  /** Modification timestamp in milliseconds */
  modifiedAt: number;

  /** Whether the video is marked as favorite in MediaStore */
  isFavorite: boolean;

  /** Last played timestamp in milliseconds (saved state for resume history) */
  lastPlayedAt?: number;

  /** Last saved playback position in seconds */
  playbackPosition?: number;

  /** Progress percentage between 0 and 100 */
  playbackPercentage?: number;

  /** Whether video was watched to completion */
  isCompleted?: boolean;
}
