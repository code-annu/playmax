import {
  deleteAssetsAsync,
  setAssetFavoriteAsync,
} from 'expo-media-library/legacy';

// ============================================================================
// MUTATIONS & ACTIONS
// ============================================================================

/**
 * Toggles or sets favorite status for a video in MediaStore.
 */
export async function setVideoFavorite(
  id: string,
  isFavorite: boolean
): Promise<boolean> {
  try {
    return await setAssetFavoriteAsync(id, isFavorite);
  } catch {
    return false;
  }
}

/**
 * Permanently deletes a video from the device's media store.
 */
export async function deleteVideo(id: string): Promise<boolean> {
  try {
    return await deleteAssetsAsync(id);
  } catch {
    return false;
  }
}

/**
 * Permanently deletes multiple videos from device storage.
 */
export async function deleteVideos(ids: string[]): Promise<boolean> {
  try {
    return await deleteAssetsAsync(ids);
  } catch {
    return false;
  }
}
