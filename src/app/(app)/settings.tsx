import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMediaPermission } from '../../ctx';

export default function SettingsScreen() {
  const { isGranted, openSettings } = useMediaPermission();

  // Settings states
  const [hwAcceleration, setHwAcceleration] = useState<boolean>(true);
  const [bgPlayback, setBgPlayback] = useState<boolean>(true);
  const [autoResume, setAutoResume] = useState<boolean>(true);
  const [autoScan, setAutoScan] = useState<boolean>(true);
  const [showHiddenFiles, setShowHiddenFiles] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<'fit' | '16:9' | 'crop'>('fit');
  const [cacheSize, setCacheSize] = useState<string>('38 MB');

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clean temporary video thumbnails?',
      [
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setCacheSize('0 KB');
            Alert.alert('Cache Cleared', 'Thumbnail cache has been cleaned.');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header Badge */}
        <View style={styles.header}>
          <View style={styles.headerBadge}>
            <View style={styles.headerDot} />
            <Text style={styles.headerBadgeText}>PLAYMAX PREFERENCES</Text>
          </View>
        </View>

        {/* Engine Status Hero Hub Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.heroIconBox}>
              <MaterialCommunityIcons name="lightning-bolt" size={26} color="#38BDF8" />
            </View>
            <View style={styles.heroMeta}>
              <View style={styles.engineTag}>
                <Text style={styles.engineTagText}>HARDWARE ACCELERATED</Text>
              </View>
              <Text style={styles.heroTitle}>Local Media Engine</Text>
            </View>
          </View>

          {/* Storage Meter Visual Gauge */}
          <View style={styles.storageGaugeBox}>
            <View style={styles.storageGaugeLabels}>
              <Text style={styles.gaugeTitle}>Device Storage Meter</Text>
              <Text style={styles.gaugePercent}>14% Used</Text>
            </View>

            <View style={styles.gaugeTrack}>
              <View style={[styles.gaugeFill, { width: '18%' }]} />
            </View>

            <View style={styles.gaugeStatsRow}>
              <View style={styles.gaugeStatItem}>
                <View style={[styles.statDot, { backgroundColor: '#38BDF8' }]} />
                <Text style={styles.statCaption}>Videos: 14.2 GB</Text>
              </View>
              <View style={styles.gaugeStatItem}>
                <View style={[styles.statDot, { backgroundColor: '#334155' }]} />
                <Text style={styles.statCaption}>Free: 84.6 GB</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Setting Section 1: Playback Controls */}
        <View style={styles.sectionHeader}>
          <Ionicons name="play-circle-outline" size={16} color="#38BDF8" />
          <Text style={styles.sectionTitle}>PLAYBACK CONTROLS</Text>
        </View>

        <View style={styles.groupCard}>
          {/* Hardware Decoder */}
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
              <Ionicons name="flash-outline" size={18} color="#38BDF8" />
            </View>
            <View style={styles.settingDetails}>
              <Text style={styles.settingName}>HW+ Video Decoding</Text>
              <Text style={styles.settingDescription}>
                GPU hardware rendering for 4K / 60fps playback
              </Text>
            </View>
            <Switch
              value={hwAcceleration}
              onValueChange={setHwAcceleration}
              trackColor={{ false: '#334155', true: '#208AEF' }}
              thumbColor={hwAcceleration ? '#FFFFFF' : '#94A3B8'}
            />
          </View>

          <View style={styles.divider} />

          {/* Background Playback */}
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
              <Ionicons name="musical-notes-outline" size={18} color="#C084FC" />
            </View>
            <View style={styles.settingDetails}>
              <Text style={styles.settingName}>Background Audio</Text>
              <Text style={styles.settingDescription}>
                Continue listening when switching apps
              </Text>
            </View>
            <Switch
              value={bgPlayback}
              onValueChange={setBgPlayback}
              trackColor={{ false: '#334155', true: '#208AEF' }}
              thumbColor={bgPlayback ? '#FFFFFF' : '#94A3B8'}
            />
          </View>

          <View style={styles.divider} />

          {/* Auto Resume */}
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(52, 211, 153, 0.15)' }]}>
              <Ionicons name="time-outline" size={18} color="#34D399" />
            </View>
            <View style={styles.settingDetails}>
              <Text style={styles.settingName}>Auto-Resume Position</Text>
              <Text style={styles.settingDescription}>
                Save timestamp and resume where you left off
              </Text>
            </View>
            <Switch
              value={autoResume}
              onValueChange={setAutoResume}
              trackColor={{ false: '#334155', true: '#208AEF' }}
              thumbColor={autoResume ? '#FFFFFF' : '#94A3B8'}
            />
          </View>

          <View style={styles.divider} />

          {/* Default Aspect Ratio Segmented Control */}
          <View style={styles.settingRowStacked}>
            <View style={styles.stackedHeader}>
              <View style={[styles.settingIcon, { backgroundColor: 'rgba(251, 191, 36, 0.15)' }]}>
                <Ionicons name="scan-outline" size={18} color="#FBBF24" />
              </View>
              <View style={styles.settingDetails}>
                <Text style={styles.settingName}>Aspect Ratio Default</Text>
                <Text style={styles.settingDescription}>Screen fit mode during video playback</Text>
              </View>
            </View>

            <View style={styles.segmentedSelector}>
              {(['fit', '16:9', 'crop'] as const).map((mode) => (
                <Pressable
                  key={mode}
                  onPress={() => setAspectRatio(mode)}
                  style={[
                    styles.segmentBtn,
                    aspectRatio === mode && styles.segmentBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentBtnText,
                      aspectRatio === mode && styles.segmentBtnTextActive,
                    ]}
                  >
                    {mode.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Setting Section 2: Library & Scanner */}
        <View style={styles.sectionHeader}>
          <Ionicons name="folder-open-outline" size={16} color="#60A5FA" />
          <Text style={styles.sectionTitle}>LIBRARY & SCANNER</Text>
        </View>

        <View style={styles.groupCard}>
          {/* Auto Scan */}
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(96, 165, 250, 0.15)' }]}>
              <Ionicons name="sync-outline" size={18} color="#60A5FA" />
            </View>
            <View style={styles.settingDetails}>
              <Text style={styles.settingName}>Auto-Scan on Launch</Text>
              <Text style={styles.settingDescription}>
                Automatically index new videos upon app launch
              </Text>
            </View>
            <Switch
              value={autoScan}
              onValueChange={setAutoScan}
              trackColor={{ false: '#334155', true: '#208AEF' }}
              thumbColor={autoScan ? '#FFFFFF' : '#94A3B8'}
            />
          </View>

          <View style={styles.divider} />

          {/* Show Hidden Media */}
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(244, 114, 182, 0.15)' }]}>
              <Ionicons name="eye-outline" size={18} color="#F472B6" />
            </View>
            <View style={styles.settingDetails}>
              <Text style={styles.settingName}>Include Hidden Media</Text>
              <Text style={styles.settingDescription}>
                Scan directories containing .nomedia tags
              </Text>
            </View>
            <Switch
              value={showHiddenFiles}
              onValueChange={setShowHiddenFiles}
              trackColor={{ false: '#334155', true: '#208AEF' }}
              thumbColor={showHiddenFiles ? '#FFFFFF' : '#94A3B8'}
            />
          </View>

          <View style={styles.divider} />

          {/* Clean Cache */}
          <Pressable onPress={handleClearCache} style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Ionicons name="trash-outline" size={18} color="#F87171" />
            </View>
            <View style={styles.settingDetails}>
              <Text style={styles.settingName}>Clear Thumbnail Cache</Text>
              <Text style={styles.settingDescription}>
                Purge cached image posters to reclaim storage
              </Text>
            </View>
            <View style={styles.cachePill}>
              <Text style={styles.cachePillText}>{cacheSize}</Text>
            </View>
          </Pressable>
        </View>

        {/* Setting Section 3: Privacy & System Permissions */}
        <View style={styles.sectionHeader}>
          <Ionicons name="shield-checkmark-outline" size={16} color="#34D399" />
          <Text style={styles.sectionTitle}>STORAGE & PERMISSIONS</Text>
        </View>

        <View style={styles.groupCard}>
          <Pressable onPress={openSettings} style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Ionicons name="key-outline" size={18} color="#10B981" />
            </View>
            <View style={styles.settingDetails}>
              <Text style={styles.settingName}>Device Media Permission</Text>
              <Text style={styles.settingDescription}>
                Manage system level storage access preferences
              </Text>
            </View>
            <View style={styles.statusGrantedBadge}>
              <Text style={styles.statusGrantedText}>
                {isGranted ? 'ACTIVE ✓' : 'REVOKED ✕'}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Build & Engine Specs Card */}
        <View style={styles.buildCard}>
          <View style={styles.buildBadgeRow}>
            <View style={styles.buildPill}>
              <FontAwesome6 name="react" size={13} color="#38BDF8" style={{ marginRight: 6 }} />
              <Text style={styles.buildPillText}>React Native 0.86</Text>
            </View>

            <View style={styles.buildPill}>
              <Ionicons name="cube-outline" size={13} color="#A78BFA" style={{ marginRight: 6 }} />
              <Text style={styles.buildPillText}>Expo SDK 57</Text>
            </View>
          </View>

          <Text style={styles.buildSignature}>
            PlayMax Video Engine • Offline First Edition
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  headerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
    marginRight: 8,
  },
  headerBadgeText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroCard: {
    backgroundColor: '#131D31',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    marginBottom: 20,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  heroMeta: {
    flex: 1,
  },
  engineTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginBottom: 4,
  },
  engineTagText: {
    color: '#38BDF8',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  storageGaugeBox: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 14,
  },
  storageGaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gaugeTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  gaugePercent: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
  },
  gaugeTrack: {
    height: 8,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  gaugeFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 4,
  },
  gaugeStatsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  gaugeStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statCaption: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
    gap: 6,
  },
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 1,
  },
  groupCard: {
    backgroundColor: '#131D31',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.08)',
    marginBottom: 18,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  settingRowStacked: {
    paddingVertical: 6,
  },
  stackedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingDetails: {
    flex: 1,
    marginRight: 8,
  },
  settingName: {
    color: '#F8FAFC',
    fontSize: 14.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  settingDescription: {
    color: '#64748B',
    fontSize: 11.5,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.07)',
    marginVertical: 10,
  },
  segmentedSelector: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: '#208AEF',
  },
  segmentBtnText: {
    color: '#64748B',
    fontSize: 11.5,
    fontWeight: '700',
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
  },
  cachePill: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cachePillText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '700',
  },
  statusGrantedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusGrantedText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '800',
  },
  buildCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  buildBadgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  buildPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131D31',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
  },
  buildPillText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  buildSignature: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
  },
});
