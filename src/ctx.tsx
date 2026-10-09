import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppState, type AppStateStatus, Linking } from 'react-native';

import type { MediaPermissionState } from './types';
import {
  getVideoPermissions,
  requestVideoPermissions,
} from './util/video-permission.util';

export interface MediaPermissionContextType {
  /** The raw permission state from Expo MediaLibrary */
  permission: MediaPermissionState | null;
  /** True while the initial or subsequent permission check is in flight */
  isLoading: boolean;
  /** Helper flag indicating if video access has been granted */
  isGranted: boolean;
  /** Helper flag indicating if the system can prompt the user again without going to settings */
  canAskAgain: boolean;
  /** Re-checks the current permission status without prompting the user */
  checkPermission: () => Promise<MediaPermissionState>;
  /** Requests media permission from the user (or returns current state if already resolved) */
  requestPermission: () => Promise<MediaPermissionState>;
  /** Opens the device application settings screen */
  openSettings: () => Promise<void>;
}

const MediaPermissionContext = createContext<MediaPermissionContextType | null>(null);

export interface MediaPermissionProviderProps {
  children: React.ReactNode;
}

/**
 * Production-ready Context Provider managing media library permissions.
 *
 * Automatically monitors app lifecycle changes (AppState) so that when a user
 * returns from device Settings after toggling permissions, the state is refreshed
 * seamlessly.
 */
export const MediaPermissionProvider: React.FC<MediaPermissionProviderProps> = ({
  children,
}) => {
  const [permission, setPermission] = useState<MediaPermissionState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkPermission = useCallback(async (): Promise<MediaPermissionState> => {
    try {
      const state = await getVideoPermissions();
      setPermission(state);
      return state;
    } catch {
      const fallbackState: MediaPermissionState = {
        granted: false,
        canAskAgain: true,
        status: 'undetermined',
      };
      setPermission(fallbackState);
      return fallbackState;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<MediaPermissionState> => {
    setIsLoading(true);
    try {
      const state = await requestVideoPermissions();
      setPermission(state);
      return state;
    } catch {
      const fallbackState: MediaPermissionState = {
        granted: false,
        canAskAgain: true,
        status: 'undetermined',
      };
      setPermission(fallbackState);
      return fallbackState;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openSettings = useCallback(async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.warn('Failed to open app settings:', error);
    }
  }, []);

  // Initial permission check on mount
  useEffect(() => {
    let isMounted = true;

    getVideoPermissions()
      .then((state) => {
        if (isMounted) {
          setPermission(state);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPermission({
            granted: false,
            canAskAgain: true,
            status: 'undetermined',
          });
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync permission state when returning to the app from background or system settings
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkPermission();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [checkPermission]);

  const isGranted = permission?.granted === true;
  const canAskAgain = permission ? permission.canAskAgain : true;

  const value = useMemo<MediaPermissionContextType>(
    () => ({
      permission,
      isLoading,
      isGranted,
      canAskAgain,
      checkPermission,
      requestPermission,
      openSettings,
    }),
    [permission, isLoading, isGranted, canAskAgain, checkPermission, requestPermission, openSettings]
  );

  return (
    <MediaPermissionContext.Provider value={value}>
      {children}
    </MediaPermissionContext.Provider>
  );
};

/**
 * Custom hook to consume media permission state and actions across any component.
 */
export function useMediaPermission(): MediaPermissionContextType {
  const context = useContext(MediaPermissionContext);
  if (!context) {
    throw new Error('useMediaPermission must be used within a MediaPermissionProvider');
  }
  return context;
}

export default MediaPermissionProvider;
