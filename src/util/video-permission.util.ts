import {
  requestPermissionsAsync,
  getPermissionsAsync,
  type PermissionResponse,
} from 'expo-media-library';

import type { MediaPermissionState } from '../types';

// ============================================================================
// PERMISSION HELPERS
// ============================================================================

/**
 * Checks and requests permissions to access the device's video media library.
 * Supports granular permissions on Android 13+ (READ_MEDIA_VIDEO).
 */
export async function requestVideoPermissions(): Promise<MediaPermissionState> {
  try {
    // Request specifically for video media type
    const response: PermissionResponse = await requestPermissionsAsync(false, [
      'video',
    ]);

    return {
      granted: response.granted,
      canAskAgain: response.canAskAgain,
      status: response.status,
      accessPrivileges: response.accessPrivileges,
    };
  } catch {
    // Fallback if granular permissions parameter isn't supported
    try {
      const fallbackResponse = await requestPermissionsAsync();
      return {
        granted: fallbackResponse.granted,
        canAskAgain: fallbackResponse.canAskAgain,
        status: fallbackResponse.status,
        accessPrivileges: fallbackResponse.accessPrivileges,
      };
    } catch {
      return {
        granted: false,
        canAskAgain: true,
        status: 'undetermined',
      };
    }
  }
}

/**
 * Checks current permission status without prompting the user.
 */
export async function getVideoPermissions(): Promise<MediaPermissionState> {
  try {
    const response: PermissionResponse = await getPermissionsAsync(false, [
      'video',
    ]);
    return {
      granted: response.granted,
      canAskAgain: response.canAskAgain,
      status: response.status,
      accessPrivileges: response.accessPrivileges,
    };
  } catch {
    try {
      const fallback = await getPermissionsAsync();
      return {
        granted: fallback.granted,
        canAskAgain: fallback.canAskAgain,
        status: fallback.status,
        accessPrivileges: fallback.accessPrivileges,
      };
    } catch {
      return {
        granted: false,
        canAskAgain: true,
        status: 'undetermined',
      };
    }
  }
}
