import { useApiKey } from '@/modules/apiKeyManagement/context/ApiKeyContext';
import { borderRadius, spacing, typography, useTheme } from '@/modules/theme';
import * as Haptics from 'expo-haptics';

import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

interface KeySectionProps {
  label: string;
  value: string | null;
  onSave: (value: string) => Promise<void>;
  onDelete: () => Promise<void>;
  placeholder: string;
}

function KeySection({ label, value, onSave, onDelete, placeholder }: KeySectionProps) {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.sm,
    },
    label: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    valueContainer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    statusText: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.md,
      color: value ? colors.textPrimary : colors.textMuted,
    },
    configuredText: {
      color: colors.status.finished,
    },
    maskedValue: {
      fontFamily: typography.fontFamily.mono,
      fontSize: typography.fontSize.base,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    editContainer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
    },
    input: {
      fontFamily: typography.fontFamily.mono,
      fontSize: typography.fontSize.base,
      color: colors.textPrimary,
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.borderFocused,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: 44,
    },
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    actionButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
    },
    cancelButton: {
      backgroundColor: 'transparent',
    },
    saveButton: {
      backgroundColor: colors.accent,
    },
    deleteButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.status.error,
    },
    actionText: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.sm,
      fontWeight: '600',
    },
    cancelText: {
      color: colors.textSecondary,
    },
    saveText: {
      color: '#ffffff',
    },
    deleteText: {
      color: colors.status.error,
    },
    tapHint: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.xs,
      color: colors.textMuted,
      marginTop: spacing.xs,
    },
  });

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isEditing]);

  const handleTapToEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInputValue('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsEditing(false);
    setInputValue('');
    Keyboard.dismiss();
  };

  const handleSave = async () => {
    if (!inputValue.trim()) {
      Alert.alert('Error', 'Please enter a value');
      return;
    }

    setIsSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await onSave(inputValue.trim());
      setIsEditing(false);
      setInputValue('');
      Keyboard.dismiss();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Key', `Are you sure you want to delete your ${label}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          try {
            await onDelete();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Error', 'Failed to delete key');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
      </View>

      {!isEditing ? (
        <Pressable onPress={handleTapToEdit}>
          <View style={styles.valueContainer}>
            {value ? (
              <>
                <Text style={[styles.statusText, styles.configuredText]}>✓ Configured</Text>
                <Text style={styles.maskedValue}>••••••••••••••••</Text>
              </>
            ) : (
              <>
                <Text style={styles.statusText}>Not configured</Text>
                <Text style={styles.tapHint}>Tap to add</Text>
              </>
            )}
          </View>
        </Pressable>
      ) : (
        <>
          <View style={styles.editContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={placeholder}
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSaving}
            />
          </View>
          <View style={styles.actionsRow}>
            <Pressable
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancel}
              disabled={isSaving}
            >
              <Text style={[styles.actionText, styles.cancelText]}>Cancel</Text>
            </Pressable>
            {value && (
              <Pressable
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDelete}
                disabled={isSaving}
              >
                <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={[styles.actionText, styles.saveText]}>
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

export default function Settings() {
  const {
    cursorApiKey,
    githubPat,
    setCursorApiKey,
    setGithubPat,
    deleteCursorApiKey,
    deleteGithubPat,
  } = useApiKey();
  const { isDark, toggleTheme, colors } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: spacing.lg,
    },
    title: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textPrimary,
      fontSize: 28,
      fontWeight: '700',
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
      paddingTop: 0,
    },
    section: {
      marginBottom: spacing['2xl'],
    },
    sectionTitle: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textPrimary,
      fontSize: typography.fontSize.md,
      fontWeight: '600',
      marginBottom: spacing.md,
    },
    keySpacer: {
      height: spacing.md,
    },
    themeToggleCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    themeToggleLabel: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textPrimary,
      fontSize: typography.fontSize.md,
      fontWeight: '500',
    },
    themeToggleDescription: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm,
      marginTop: spacing.xs,
    },
    infoSection: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
    },
    infoText: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm,
      lineHeight: 20,
    },
  });

  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleTheme();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Setup</Text>
      </View>

      <KeyboardAwareScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View
          style={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 80 },
          ]}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>API Keys</Text>

            <KeySection
              label="Cursor API Key"
              value={cursorApiKey}
              onSave={setCursorApiKey}
              onDelete={deleteCursorApiKey}
              placeholder="Enter your Cursor API key"
            />

            <View style={styles.keySpacer} />

            <KeySection
              label="GitHub Personal Access Token"
              value={githubPat}
              onSave={setGithubPat}
              onDelete={deleteGithubPat}
              placeholder="Enter your GitHub PAT"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <View style={styles.themeToggleCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.themeToggleLabel}>
                  {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </Text>
                <Text style={styles.themeToggleDescription}>
                  {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={handleThemeToggle}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#ffffff"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.infoSection}>
              <Text style={styles.infoText}>
                Your API keys are securely stored on your device using encrypted storage. They are
                never sent to any third parties except the official Cursor and GitHub APIs.
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
