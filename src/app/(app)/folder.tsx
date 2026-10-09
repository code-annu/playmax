import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { FolderViewComponent } from '../../components/video/FolderViewComponent';
import { VideoInfoComponent } from '../../components/video/VideoInfoComponent';
import type { VideoFolder, VideoItem } from '../../types';
import { fetchVideoFolders } from '../../util/video-folder.util';

export default function FolderScreen() {
  const [folders, setFolders] = useState<VideoFolder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFolder, setSelectedFolder] = useState<VideoFolder | null>(null);

  const loadFolders = useCallback(async () => {
    try {
      const data = await fetchVideoFolders();
      setFolders(data);
    } catch (error) {
      console.warn('Failed to fetch video folders:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchVideoFolders()
      .then((data) => {
        if (isMounted) {
          setFolders(data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.warn('Failed to fetch video folders:', error);
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
    loadFolders();
  }, [loadFolders]);

  // Overall totals
  const totalVideosCount = useMemo(
    () => folders.reduce((sum, f) => sum + (f.videoCount || 0), 0),
    [folders]
  );

  const totalSizeFormatted = useMemo(() => {
    const totalBytes = folders.reduce((sum, f) => sum + (f.totalSize || 0), 0);
    if (!totalBytes) return '--';
    const mb = totalBytes / (1024 * 1024);
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${Math.round(mb)} MB`;
  }, [folders]);

  // Filtered folders
  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return folders;
    const q = searchQuery.toLowerCase().trim();
    return folders.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.path && f.path.toLowerCase().includes(q))
    );
  }, [folders, searchQuery]);

  // If a folder is opened, show its video feed drill-down
  if (selectedFolder) {
    const folderVideos: VideoItem[] = selectedFolder.videos || [];

    return (
      <SafeAreaView style={styles.safeArea}>
        {/* Drill-down Header */}
        <View style={styles.drillHeader}>
          <Pressable
            hitSlop={12}
            onPress={() => setSelectedFolder(null)}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
          </Pressable>

          <View style={styles.drillHeaderText}>
            <Text style={styles.drillTitle} numberOfLines={1}>
              {selectedFolder.name}
            </Text>
            <Text style={styles.drillSubtitle}>
              {folderVideos.length} {folderVideos.length === 1 ? 'video' : 'videos'} •{' '}
              {selectedFolder.totalSizeFormatted}
            </Text>
          </View>
        </View>

        {/* Video feed inside folder */}
        <FlatList
          data={folderVideos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <VideoInfoComponent video={item} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptySubtitle}>
                No videos available in this folder.
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Video Folders</Text>
          <Text style={styles.headerSubtitle}>
            {folders.length} {folders.length === 1 ? 'Folder' : 'Folders'} •{' '}
            {totalVideosCount} Videos
          </Text>
        </View>

        <Pressable
          hitSlop={10}
          onPress={onRefresh}
          style={({ pressed }) => [
            styles.reloadBtn,
            pressed && styles.reloadBtnPressed,
          ]}
        >
          <Ionicons name="reload-outline" size={20} color="#F1F5F9" />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={18}
          color="#94A3B8"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Filter by folder name..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </Pressable>
        )}
      </View>

      {/* Summary Metrics Bar */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Ionicons name="folder-outline" size={20} color="#38BDF8" />
          <Text style={styles.metricValue}>{folders.length}</Text>
          <Text style={styles.metricLabel}>Folders</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricCard}>
          <MaterialCommunityIcons
            name="filmstrip"
            size={20}
            color="#60A5FA"
          />
          <Text style={styles.metricValue}>{totalVideosCount}</Text>
          <Text style={styles.metricLabel}>Videos</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricCard}>
          <Ionicons name="server-outline" size={20} color="#34D399" />
          <Text style={styles.metricValue}>{totalSizeFormatted}</Text>
          <Text style={styles.metricLabel}>Storage</Text>
        </View>
      </View>

      {/* Folders FlatList */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#38BDF8" />
          <Text style={styles.loadingText}>Loading video folders...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredFolders}
          keyExtractor={(item) => item.id || item.name}
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
            <FolderViewComponent
              folder={item}
              onPress={(f) => setSelectedFolder(f)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="folder-open-outline" size={44} color="#38BDF8" />
              </View>
              <Text style={styles.emptyTitle}>No Folders Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? `No folder matches "${searchQuery}".`
                  : 'No organized video folders discovered on device storage.'}
              </Text>
              <PrimaryButton
                title="Rescan Folders"
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
    paddingTop: 12,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 12.5,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '600',
  },
  reloadBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  reloadBtnPressed: {
    opacity: 0.7,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131D31',
    marginHorizontal: 18,
    marginVertical: 10,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  metricsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#131D31',
    marginHorizontal: 18,
    marginBottom: 14,
    borderRadius: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.08)',
  },
  metricCard: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  metricLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 6,
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
    width: 76,
    height: 76,
    borderRadius: 38,
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
  drillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 10,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  drillHeaderText: {
    flex: 1,
  },
  drillTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  drillSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
});
