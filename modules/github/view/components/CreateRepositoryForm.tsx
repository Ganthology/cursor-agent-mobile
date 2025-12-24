import { useApiKey } from '@/modules/apiKeyManagement/context/ApiKeyContext';
import { borderRadius, borderWidth, spacing, typography, useTheme } from '@/modules/theme';
import { BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GitHubRepo } from '../../data/entity/GitHubRepo';
import { GitHubRepositoryImpl } from '../../data/repository/GitHubRepositoryImpl';
import { GitHubService } from '../../data/source/GitHubService';

interface CreateRepositoryFormProps {
  onSuccess?: (repo: GitHubRepo) => void;
}

export const CreateRepositoryForm: React.FC<CreateRepositoryFormProps> = ({ onSuccess }) => {
  const { githubPat } = useApiKey();
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [autoInit, setAutoInit] = useState(true);

  const resetForm = useCallback(() => {
    setName('');
    setDescription('');
    setIsPrivate(false);
    setAutoInit(true);
  }, []);

  const createRepoMutation = useMutation({
    mutationFn: async () => {
      if (!githubPat) throw new Error('GitHub PAT not configured');
      if (!name.trim()) throw new Error('Repository name is required');

      const service = new GitHubService(githubPat);
      const repository = new GitHubRepositoryImpl(service);

      return repository.createRepository({
        name: name.trim(),
        description: description.trim() || undefined,
        private: isPrivate,
        autoInit,
      });
    },
    onSuccess: (newRepo) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ['github-repositories'] });
      resetForm();
      onSuccess?.(newRepo);
    },
    onError: (error) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create repository');
    },
  });

  const handleCreate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    createRepoMutation.mutate();
  };

  const canSubmit = name.trim() && !createRepoMutation.isPending;

  const styles = StyleSheet.create({
    scrollContent: {
      padding: spacing.lg,
      paddingBottom: Math.max(spacing.lg, insets.bottom + spacing.md),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    title: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.xl,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    formGroup: {
      marginBottom: spacing.md,
    },
    label: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    input: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.base,
      color: colors.textPrimary,
      backgroundColor: colors.inputBg,
      borderWidth: borderWidth.thin,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: 44,
    },
    multilineInput: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    switchLabel: {
      flex: 1,
    },
    switchTitle: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.base,
      color: colors.textPrimary,
    },
    switchDescription: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      marginTop: spacing['2xs'],
    },
    buttonContainer: {
      marginTop: spacing.lg,
    },
    createButton: {
      backgroundColor: colors.accent,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
    },
    createButtonDisabled: {
      opacity: 0.5,
    },
    createButtonText: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.base,
      fontWeight: '600',
      color: '#ffffff',
    },
  });

  return (
    <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Repository</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Repository Name *</Text>
        <BottomSheetTextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="my-awesome-repo"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <BottomSheetTextInput
          style={[styles.input, styles.multilineInput]}
          value={description}
          onChangeText={setDescription}
          placeholder="A short description of your repository"
          placeholderTextColor={colors.textMuted}
          multiline
        />
      </View>

      <View style={styles.formGroup}>
        <View style={styles.switchRow}>
          <View style={styles.switchLabel}>
            <Text style={styles.switchTitle}>Private Repository</Text>
            <Text style={styles.switchDescription}>Only you can see this repository</Text>
          </View>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.switchRow}>
          <View style={styles.switchLabel}>
            <Text style={styles.switchTitle}>Initialize with README</Text>
            <Text style={styles.switchDescription}>Add a README file to get started</Text>
          </View>
          <Switch
            value={autoInit}
            onValueChange={setAutoInit}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.createButton, !canSubmit && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={!canSubmit}
        >
          <Text style={styles.createButtonText}>
            {createRepoMutation.isPending ? 'Creating...' : 'Create Repository'}
          </Text>
        </Pressable>
      </View>
    </BottomSheetScrollView>
  );
};
