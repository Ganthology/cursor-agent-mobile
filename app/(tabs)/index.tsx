import { useApiKey } from '@/modules/apiKeyManagement/context/ApiKeyContext';
import { CreateAgentForm } from '@/modules/cursor/view/components/CreateAgentForm';
import { typography, useTheme } from '@/modules/theme';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    logoContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoText: {
      fontFamily: typography.fontFamily.mono,
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    headerTitle: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '600',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
    },
    heroSection: {
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 16,
    },
    heroTitle: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textPrimary,
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 4,
    },
    heroSubtitle: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textSecondary,
      fontSize: 28,
      fontWeight: '400',
    },
    heroDescription: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textMuted,
      fontSize: 15,
      marginTop: 12,
      lineHeight: 22,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingTop: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textSecondary,
      marginTop: 12,
      fontSize: 14,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    emptyText: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 16,
    },
    settingsButton: {
      backgroundColor: colors.accent,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 6,
    },
    settingsButtonText: {
      fontFamily: typography.fontFamily.sans,
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
    },
  });

export default function ComposeTab() {
  const { cursorApiKey, keysLoaded } = useApiKey();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleGoToSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/settings' as any);
  };

  // Show loading while keys are being loaded from secure storage
  if (!keysLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show empty state if no API key configured
  if (!cursorApiKey) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>$</Text>
            </View>
            <Text style={styles.headerTitle}>New Agent</Text>
          </View>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Configure your Cursor API key in Settings{'\n'}to create agents
          </Text>
          <Pressable style={styles.settingsButton} onPress={handleGoToSettings}>
            <Text style={styles.settingsButtonText}>Go to Settings</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>$</Text>
          </View>
          <Text style={styles.headerTitle}>New Agent</Text>
        </View>
        <Image source={{ uri: 'https://github.com/identicons/cursor.png' }} style={styles.avatar} />
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>What are we</Text>
        <Text style={styles.heroSubtitle}>building today?</Text>
        <Text style={styles.heroDescription}>
          Describe your feature, fix, or investigation and{'\n'}the agent will handle the rest.
        </Text>
      </View>

      <KeyboardAwareScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 80 },
        ]}
      >
        <CreateAgentForm />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
