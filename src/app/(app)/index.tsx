import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { VideoInfoComponent } from '../../components/video/VideoInfoComponent';
import type { VideoItem } from '../../types';
import { setVideoFavorite } from '../../util/video-action.util';
import { fetchDeviceVideos } from '../../util/video-fetch.util';

type FilterCategory = 'all' | 'favorites' | 'recent' | 'shorts' | 'movies';

export default function HomeScreen() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const loadVideos = useCallback(async () => {
    try {
      const result = await fetchDeviceVideos({ limit: 100 });
      setVideos(result.videos);
    } catch (error) {
      console.warn('Failed to fetch device videos:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchDeviceVideos({ limit: 100 })
      .then((result) => {
        if (isMounted) {
          setVideos(result.videos);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.warn('Failed to fetch device videos:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadVideos();
  }, [loadVideos]);

  // Client-side filtering based on category and search query
  const filteredVideos = useMemo(() => {
    let list = [...videos];

    // Search filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.filename.toLowerCase().includes(q) ||
          v.parentDir.toLowerCase().includes(q)
      );
    }

    // Category filter
    switch (selectedFilter) {
      case 'favorites':
        return list.filter((v) => v.isFavorite);
      case 'recent':
        return list.sort((a, b) => (b.modifiedAt || 0) - (a.modifiedAt || 0));
      case 'shorts':
        return list.filter((v) => v.duration > 0 && v.duration <= 120);
      case 'movies':
        return list.filter((v) => v.duration >= 1200);
      case 'all':
      default:
        return list;
    }
  }, [videos, selectedFilter, searchQuery]);

  const handleVideoPress = (video: VideoItem) => {
    setSelectedVideo(video);
  };

  const handleToggleFavorite = async (video: VideoItem) => {
    const nextFav = !video.isFavorite;
    await setVideoFavorite(video.id, nextFav);
    setVideos((prev) =>
      prev.map((v) => (v.id === video.id ? { ...v, isFavorite: nextFav } : v))
    );
  };

  const handleMorePress = (video: VideoItem) => {
    Alert.alert(
      video.title || video.filename,
      `Directory: ${video.parentDir}\nSize: ${video.sizeFormatted}\nDuration: ${video.durationFormatted}\nResolution: ${video.resolution}`,
      [
        {
          text: video.isFavorite ? 'Remove Favorite' : 'Mark as Favorite',
          onPress: () => handleToggleFavorite(video),
        },
        { text: 'Close', style: 'cancel' },
      ]
    );
  };

  const filterChips: { id: FilterCategory; label: string; icon?: string }[] = [
    { id: 'all', label: 'All Videos' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'recent', label: 'Recent' },
    { id: 'shorts', label: 'Shorts (< 2m)' },
    { id: 'movies', label: 'Movies (> 20m)' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.branding}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons name="play" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>PlayMax</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            hitSlop={10}
            onPress={() => setIsSearchOpen((prev) => !prev)}
            style={({ pressed }) => [
              styles.actionIconBtn,
              pressed && styles.actionIconBtnPressed,
              isSearchOpen && styles.actionIconBtnActive,
            ]}
          >
            <Ionicons
              name={isSearchOpen ? 'close' : 'search'}
              size={20}
              color="#F1F5F9"
            />
          </Pressable>

          <Pressable
            hitSlop={10}
            onPress={onRefresh}
            style={({ pressed }) => [
              styles.actionIconBtn,
              pressed && styles.actionIconBtnPressed,
            ]}
          >
            <Ionicons name="reload-outline" size={20} color="#F1F5F9" />
          </Pressable>
        </View>
      </View>

      {/* Expandable Search Input */}
      {isSearchOpen && (
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#94A3B8"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search videos, folders, formats..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      )}

      {/* Horizontal Filter Chips Bar */}
      <View style={styles.chipsWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterChips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chipsContent}
          renderItem={({ item }) => {
            const isActive = selectedFilter === item.id;
            return (
              <Pressable
                onPress={() => setSelectedFilter(item.id)}
                style={[
                  styles.chip,
                  isActive ? styles.chipActive : styles.chipInactive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isActive ? styles.chipTextActive : styles.chipTextInactive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Video Feed List */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#38BDF8" />
          <Text style={styles.loadingText}>Scanning device video library...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredVideos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#38BDF8"
              colors={['#38BDF8']}
            />
          }
          renderItem={({ item }) => (
            <VideoInfoComponent
              video={item}
              onPress={handleVideoPress}
              onMorePress={handleMorePress}
              onFavoriteToggle={handleToggleFavorite}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <MaterialCommunityIcons
                  name="movie-search-outline"
                  size={48}
                  color="#38BDF8"
                />
              </View>
              <Text style={styles.emptyTitle}>No Videos Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? `No video matches "${searchQuery}". Try different keywords.`
                  : selectedFilter === 'favorites'
                  ? 'No favorite videos yet. Tap the menu on any video to add it to favorites.'
                  : 'No video files were discovered on your device storage.'}
              </Text>
              <PrimaryButton
                title="Rescan Storage"
                size="md"
                variant="secondary"
                style={styles.rescanBtn}
                onPress={onRefresh}
                leftIcon={<Ionicons name="refresh" size={16} color="#E2E8F0" />}
              />
            </View>
          }
        />
      )}

      {/* Video Details Preview Modal */}
      {selectedVideo && (
        <Modal
          visible={Boolean(selectedVideo)}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedVideo(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {selectedVideo.title || selectedVideo.filename}
                </Text>
                <Pressable
                  hitSlop={10}
                  onPress={() => setSelectedVideo(null)}
                  style={styles.modalCloseBtn}
                >
                  <Ionicons name="close" size={20} color="#94A3B8" />
                </Pressable>
              </View>

              <View style={styles.modalDetails}>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Folder</Text>
                  <Text style={styles.modalVal}>{selectedVideo.parentDir}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Duration</Text>
                  <Text style={styles.modalVal}>{selectedVideo.durationFormatted}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Resolution</Text>
                  <Text style={styles.modalVal}>{selectedVideo.resolution}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Size</Text>
                  <Text style={styles.modalVal}>{selectedVideo.sizeFormatted}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Path</Text>
                  <Text style={styles.modalValPath} numberOfLines={2}>
                    {selectedVideo.uri}
                  </Text>
                </View>
              </View>

              <PrimaryButton
                title="Play Video"
                size="md"
                variant="primary"
                leftIcon={<Ionicons name="play" size={18} color="#FFFFFF" />}
                onPress={() => {
                  setSelectedVideo(null);
                  Alert.alert('Video Player', `Ready to play: ${selectedVideo.title}`);
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionIconBtnPressed: {
    opacity: 0.7,
  },
  actionIconBtnActive: {
    backgroundColor: '#38BDF8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131D31',
    marginHorizontal: 18,
    marginBottom: 8,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  chipsWrapper: {
    paddingVertical: 6,
  },
  chipsContent: {
    paddingHorizontal: 18,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#F8FAFC',
  },
  chipInactive: {
    backgroundColor: '#131D31',
    borderColor: 'rgba(148, 163, 184, 0.15)',
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#0F172A',
  },
  chipTextInactive: {
    color: '#94A3B8',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 14,
    color: '#94A3B8',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  rescanBtn: {
    width: 170,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#131D31',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 10,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalDetails: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginBottom: 18,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalLabel: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  modalVal: {
    color: '#F1F5F9',
    fontSize: 13,
    fontWeight: '600',
  },
  modalValPath: {
    color: '#38BDF8',
    fontSize: 11,
    maxWidth: 220,
    textAlign: 'right',
  },
});
