import { Asset } from 'expo-media-library';

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
    const asset = new Asset(id);
    await asset.setFavorite(isFavorite);
    return true;
  } catch {
    return false;
  }
}

/**
 * Permanently deletes a video from the device's media store.
 */
export async function deleteVideo(id: string): Promise<boolean> {
  try {
    const asset = new Asset(id);
    await asset.delete();
    return true;
  } catch {
    return false;
  }
}

/**
 * Permanently deletes multiple videos from device storage.
 */
export async function deleteVideos(ids: string[]): Promise<boolean> {
  try {
    const assets = ids.map((id) => new Asset(id));
    await Asset.delete(assets);
    return true;
  } catch {
    return false;
  }
}
