import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { VideoFolder } from '../../types';

export interface FolderViewComponentProps {
  /** The VideoFolder model to display */
  folder: VideoFolder;
  /** Callback when the folder card is pressed */
  onPress?: (folder: VideoFolder) => void;
}

/**
 * Overview component for local video directories/albums (inspired by MX Player & VLC).
 * Shows folder name, video count, cumulative file size, duration, and cover preview.
 */
export const FolderViewComponent: React.FC<FolderViewComponentProps> = ({
  folder,
  onPress,
}) => {
  const handlePress = () => {
    onPress?.(folder);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
    >
      {/* Folder Thumbnail / Icon Preview */}
      <View style={styles.previewContainer}>
        {folder.coverUri ? (
          <>
            <Image
              source={{ uri: folder.coverUri }}
              style={styles.coverImage}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.folderBadgeOverlay}>
              <Ionicons name="folder" size={13} color="#FFFFFF" />
            </View>
          </>
        ) : (
          <View style={styles.fallbackIcon}>
            <MaterialCommunityIcons
              name="folder-play-outline"
              size={32}
              color="#38BDF8"
            />
          </View>
        )}
      </View>

      {/* Folder Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.folderName} numberOfLines={1}>
          {folder.name || 'Videos'}
        </Text>

        {/* Stats Row: Video Count, Total Size, Total Duration */}
        <View style={styles.statsRow}>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {folder.videoCount} {folder.videoCount === 1 ? 'video' : 'videos'}
            </Text>
          </View>

          {folder.totalSizeFormatted && folder.totalSizeFormatted !== '--' && (
            <>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.statText}>{folder.totalSizeFormatted}</Text>
            </>
          )}

          {folder.totalDurationFormatted && (
            <>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.statText}>{folder.totalDurationFormatted}</Text>
            </>
          )}
        </View>

        {/* Path / Directory Hint */}
        {folder.path ? (
          <Text style={styles.pathText} numberOfLines={1}>
            {folder.path}
          </Text>
        ) : null}
      </View>

      {/* Right Navigation Arrow */}
      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={18} color="#64748B" />
      </View>
    </Pressable>
  );
};

export default FolderViewComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131D31',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.08)',
  },
  containerPressed: {
    backgroundColor: '#1E293B',
    transform: [{ scale: 0.99 }],
  },
  previewContainer: {
    width: 62,
    height: 62,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  fallbackIcon: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(32, 138, 239, 0.1)',
  },
  folderBadgeOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  folderName: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 3,
  },
  countBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  countText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#38BDF8',
  },
  dot: {
    fontSize: 11,
    color: '#475569',
    marginHorizontal: 5,
  },
  statText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  pathText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  arrowContainer: {
    paddingLeft: 4,
  },
});
