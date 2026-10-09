import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { useMediaPermission } from "../ctx";

export default function PermissionScreen() {
  const {
    permission,
    isLoading,
    isGranted,
    canAskAgain,
    requestPermission,
    openSettings,
  } = useMediaPermission();

  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  // If user already has permission, navigate directly to main app
  useEffect(() => {
    if (!isLoading && isGranted) {
      router.replace("/");
    }
  }, [isLoading, isGranted]);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      const result = await requestPermission();
      if (result.granted) {
        router.replace("/");
      }
    } finally {
      setIsRequesting(false);
    }
  };

  // While checking initial permission status, show a smooth loading indicator
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#208AEF" />
      </View>
    );
  }

  // If already granted, render a minimal loader while navigation redirect executes
  if (isGranted) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#208AEF" />
      </View>
    );
  }

  const isPermanentlyDenied = !canAskAgain && permission?.status === "denied";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Pill Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>PLAYMAX VIDEO</Text>
          </View>
        </View>

        {/* Hero Visual */}
        <View style={styles.heroVisualContainer}>
          <View style={styles.glowRingOuter}>
            <View style={styles.glowRingInner}>
              <MaterialCommunityIcons
                name="movie-play"
                size={52}
                color="#38BDF8"
              />
            </View>
          </View>
        </View>

        {/* Title and Intro */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Access Your Videos</Text>
          <Text style={styles.subtitle}>
            PlayMax needs your permission to read device storage so you can
            browse, organize, and play your video files offline.
          </Text>
        </View>

        {/* Why We Need Access Feature List */}
        <View style={styles.featureList}>
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="play-circle-outline" size={24} color="#38BDF8" />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Smooth Local Playback</Text>
              <Text style={styles.featureDescription}>
                Play all your video formats with hardware-accelerated playback.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="folder-open-outline" size={24} color="#60A5FA" />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Folder Organization</Text>
              <Text style={styles.featureDescription}>
                Auto-sort videos by folder, camera roll, date, and duration.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color="#34D399"
              />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>100% Private & Safe</Text>
              <Text style={styles.featureDescription}>
                Your files remain strictly on your device. We never upload or
                share.
              </Text>
            </View>
          </View>
        </View>

        {/* Permanently Denied Warning Banner */}
        {isPermanentlyDenied && (
          <View style={styles.warningCard}>
            <Ionicons name="alert-circle-outline" size={20} color="#FBBF24" />
            <Text style={styles.warningText}>
              Media permission was denied. Please open system settings and
              enable permission to continue.
            </Text>
          </View>
        )}

        {/* Action Button Section */}
        <View style={styles.actionContainer}>
          {isPermanentlyDenied ? (
            <PrimaryButton
              title="Open Device Settings"
              variant="primary"
              size="lg"
              onPress={openSettings}
              leftIcon={
                <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
              }
            />
          ) : (
            <PrimaryButton
              title="Allow Video Access"
              variant="primary"
              size="lg"
              loading={isRequesting}
              onPress={handleRequestPermission}
              leftIcon={
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color="#FFFFFF"
                />
              }
            />
          )}

          <Text style={styles.footerNote}>
            You can modify or revoke this permission at any time in device
            settings.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B0F19",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0B0F19",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 36,
    alignItems: "center",
  },
  badgeContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(32, 138, 239, 0.12)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.25)",
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#38BDF8",
    marginRight: 8,
  },
  badgeText: {
    color: "#38BDF8",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  heroVisualContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  glowRingOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(32, 138, 239, 0.1)",
    borderWidth: 1.5,
    borderColor: "rgba(56, 189, 248, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  glowRingInner: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#131D31",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#94A3B8",
    textAlign: "center",
    maxWidth: 320,
  },
  featureList: {
    width: "100%",
    gap: 12,
    marginBottom: 20,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131D31",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: 3,
  },
  featureDescription: {
    fontSize: 12.5,
    lineHeight: 18,
    color: "#94A3B8",
  },
  warningCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.3)",
    padding: 14,
    marginBottom: 20,
    width: "100%",
    gap: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: "#FDE68A",
  },
  actionContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
  footerNote: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 14,
  },
});
