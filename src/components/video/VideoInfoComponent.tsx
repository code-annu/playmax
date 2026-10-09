import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { VideoItem } from '../../types';

export interface VideoInfoComponentProps {
  /** The VideoItem model to display */
  video: VideoItem;
  /** Callback when the video card is pressed */
  onPress?: (video: VideoItem) => void;
  /** Callback when the 3-dots kebab menu is pressed */
  onMorePress?: (video: VideoItem) => void;
  /** Callback when the favorite button is toggled */
  onFavoriteToggle?: (video: VideoItem) => void;
}

/**
 * Format relative time (e.g., "Today", "Yesterday", "3d ago")
 */
function formatRelativeDate(timestamp: number): string {
  if (!timestamp) return '';
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/**
 * YouTube-style video feed item showcasing thumbnail cover, duration pill,
 * resolution badge, title, folder, and video metadata.
 */
export const VideoInfoComponent: React.FC<VideoInfoComponentProps> = ({
  video,
  onPress,
  onMorePress,
  onFavoriteToggle,
}) => {
  const handlePress = () => {
    onPress?.(video);
  };

  const handleMorePress = () => {
    onMorePress?.(video);
  };

  const hasResolution =
    video.resolution && video.resolution !== 'Unknown' && video.resolution !== 'SD';

  const formatText = (video.extension || video.mimeType?.split('/')[1] || 'VID')
    .toUpperCase()
    .slice(0, 4);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && styles.cardPressed,
      ]}
    >
      {/* 16:9 Thumbnail Cover Section */}
      <View style={styles.thumbnailContainer}>
        {video.coverUri ? (
          <Image
            source={{ uri: video.coverUri }}
            style={styles.thumbnailImage}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.thumbnailFallback}>
            <MaterialCommunityIcons
              name="movie-play"
              size={48}
              color="rgba(56, 189, 248, 0.4)"
            />
          </View>
        )}

        {/* Top-Right Resolution Badge (e.g., 4K, 1080p) */}
        {hasResolution && (
          <View style={styles.resolutionBadge}>
            <Text style={styles.resolutionText}>{video.resolution}</Text>
          </View>
        )}

        {/* Top-Left Favorite Indicator */}
        {video.isFavorite && (
          <View style={styles.favoriteBadge}>
            <Ionicons name="heart" size={12} color="#EF4444" />
          </View>
        )}

        {/* Bottom-Right Duration Pill Badge (YouTube style) */}
        <View style={styles.durationPill}>
          <Text style={styles.durationText}>
            {video.durationFormatted || '00:00'}
          </Text>
        </View>
      </View>

      {/* Details Row: Video Badge + Title & Metadata + More Action */}
      <View style={styles.detailsRow}>
        {/* Left: Video Format Squircle Avatar */}
        <View style={styles.formatAvatar}>
          <Text style={styles.formatAvatarText}>{formatText}</Text>
        </View>

        {/* Center: Title and Metadata */}
        <View style={styles.metaContainer}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {video.title || video.filename}
          </Text>

          <View style={styles.metaSubRow}>
            <Text style={styles.folderTag} numberOfLines={1}>
              {video.parentDir || 'Videos'}
            </Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.metaText}>{video.sizeFormatted || '--'}</Text>
            {video.modifiedAt ? (
              <>
                <Text style={styles.dotSeparator}>•</Text>
                <Text style={styles.metaText}>
                  {formatRelativeDate(video.modifiedAt)}
                </Text>
              </>
            ) : null}
          </View>
        </View>

        {/* Right: Kebab More Options */}
        <Pressable
          hitSlop={12}
          onPress={handleMorePress}
          style={({ pressed }) => [
            styles.moreButton,
            pressed && styles.moreButtonPressed,
          ]}
        >
          <Ionicons name="ellipsis-vertical" size={18} color="#94A3B8" />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default VideoInfoComponent;

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#1E293B',
    position: 'relative',
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131D31',
  },
  resolutionBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  resolutionText: {
    color: '#38BDF8',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  favoriteBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    padding: 5,
    borderRadius: 12,
  },
  durationPill: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  detailsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    alignItems: 'flex-start',
  },
  formatAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  formatAvatarText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  metaContainer: {
    flex: 1,
    paddingRight: 6,
  },
  videoTitle: {
    color: '#F8FAFC',
    fontSize: 14.5,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 4,
  },
  metaSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  folderTag: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 120,
  },
  dotSeparator: {
    color: '#64748B',
    fontSize: 11,
    marginHorizontal: 5,
  },
  metaText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  moreButton: {
    padding: 6,
    marginLeft: 2,
    marginTop: -2,
  },
  moreButtonPressed: {
    opacity: 0.6,
  },
});
