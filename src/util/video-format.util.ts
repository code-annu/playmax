// ============================================================================
// FORMATTING HELPERS
// ============================================================================

/**
 * Converts a duration in seconds into human-readable HH:MM:SS or MM:SS format.
 * Examples: 75 -> "01:15", 3665 -> "01:01:05"
 */
export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) {
    return '00:00';
  }

  const totalSecs = Math.floor(seconds);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const paddedMins = mins.toString().padStart(2, '0');
  const paddedSecs = secs.toString().padStart(2, '0');

  if (hrs > 0) {
    const paddedHrs = hrs.toString().padStart(2, '0');
    return `${paddedHrs}:${paddedMins}:${paddedSecs}`;
  }

  return `${paddedMins}:${paddedSecs}`;
}

/**
 * Formats bytes into human-readable size string (e.g. "450 KB", "1.24 GB").
 */
export function formatFileSize(bytes: number): string {
  if (!bytes || isNaN(bytes) || bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const formattedValue = (bytes / Math.pow(1024, i)).toFixed(
    i === 0 ? 0 : i === 1 ? 1 : 2
  );

  return `${formattedValue} ${units[i]}`;
}
