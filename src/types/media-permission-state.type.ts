/**
 * Status of storage/media permissions.
 */
export interface MediaPermissionState {
  granted: boolean;
  canAskAgain: boolean;
  status: 'granted' | 'denied' | 'undetermined';
  accessPrivileges?: 'all' | 'limited' | 'none';
}
