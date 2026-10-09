import { File } from 'expo-file-system';

import type { VideoOrientation, VideoResolution } from '../types';

// ============================================================================
// METADATA HELPERS
// ============================================================================

/**
 * Determines video resolution label based on dimensions.
 */
export function getResolutionLabel(
  width: number,
  height: number
): VideoResolution {
  if (!width || !height) return 'Unknown';

  const maxDimension = Math.max(width, height);
  const minDimension = Math.min(width, height);

  if (maxDimension >= 3840 || minDimension >= 2160) {
    return '4K';
  }
  if (maxDimension >= 2560 || minDimension >= 1440) {
    return '2K';
  }
  if (maxDimension >= 1920 || minDimension >= 1080) {
    return '1080p';
  }
  if (maxDimension >= 1280 || minDimension >= 720) {
    return '720p';
  }
  if (maxDimension >= 854 || minDimension >= 480) {
    return '480p';
  }
  if (maxDimension >= 640 || minDimension >= 360) {
    return '360p';
  }
  if (maxDimension > 0 && minDimension > 0) {
    return 'SD';
  }

  return 'Unknown';
}

/**
 * Determines orientation based on width and height.
 */
export function getVideoOrientation(
  width: number,
  height: number
): VideoOrientation {
  if (width > height) return 'landscape';
  if (height > width) return 'portrait';
  return 'square';
}

/**
 * Cleans a filename to produce a display title.
 * Strips common extensions, replaces underscores/dots, and removes common torrent release tags.
 */
export function cleanVideoTitle(filename: string): string {
  if (!filename) return 'Untitled Video';

  // Remove file extension
  let clean = filename.replace(/\.[a-zA-Z0-9]+$/, '');

  // Replace underscores and multiple periods with spaces
  clean = clean.replace(/[_.]+/g, ' ');

  // Clean trailing and leading whitespace
  return clean.trim() || filename;
}

/**
 * Returns file extension in lowercase without leading dot.
 */
export function getFileExtension(filename: string): string {
  if (!filename) return '';
  const match = filename.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toLowerCase() : '';
}

/**
 * Returns MIME type based on file extension.
 */
export function getMimeType(extension: string): string {
  const ext = extension.toLowerCase();
  switch (ext) {
    case 'mp4':
    case 'm4v':
      return 'video/mp4';
    case 'mkv':
      return 'video/x-matroska';
    case 'webm':
      return 'video/webm';
    case 'mov':
      return 'video/quicktime';
    case 'avi':
      return 'video/x-msvideo';
    case '3gp':
      return 'video/3gpp';
    case 'flv':
      return 'video/x-flv';
    case 'ts':
      return 'video/mp2t';
    case 'wmv':
      return 'video/x-ms-wmv';
    default:
      return 'video/*';
  }
}

/**
 * Parses parent directory information and absolute path from URI.
 */
export function parseParentDirectory(
  uri: string,
  filename: string
): {
  parentDir: string;
  parentDirPath: string;
  absolutePath: string;
} {
  try {
    let path = uri;

    // Handle file:// URIs
    if (path.startsWith('file://')) {
      path = decodeURIComponent(path.replace('file://', ''));
    }

    if (path.startsWith('/')) {
      const segments = path.split('/').filter(Boolean);
      // Remove filename segment if it's the last one
      if (
        segments.length > 0 &&
        segments[segments.length - 1].toLowerCase() === filename.toLowerCase()
      ) {
        segments.pop();
      }

      const parentDir =
        segments.length > 0 ? segments[segments.length - 1] : 'Videos';
      const parentDirPath = '/' + segments.join('/');

      return {
        parentDir,
        parentDirPath,
        absolutePath: path,
      };
    }

    // For content:// URIs on Android
    return {
      parentDir: 'Videos',
      parentDirPath: 'Internal Storage/Videos',
      absolutePath: uri,
    };
  } catch {
    return {
      parentDir: 'Videos',
      parentDirPath: 'Videos',
      absolutePath: uri,
    };
  }
}

/**
 * Safely inspects the file size of a video file.
 */
export function getSafeFileSize(uri: string): number {
  try {
    if (uri && uri.startsWith('file://')) {
      const file = new File(uri);
      if (file.exists && typeof file.size === 'number') {
        return file.size;
      }
    }
  } catch {
    // If reading file stats fails or is unpermitted, fall back gracefully
  }
  return 0;
}
