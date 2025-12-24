import { useApiKey } from '@/modules/apiKeyManagement/context/ApiKeyContext';
import { GitHubRepo } from '@/modules/github/data/entity/GitHubRepo';
import { CreateRepositoryForm } from '@/modules/github/view/components/CreateRepositoryForm';
import { useBranches } from '@/modules/github/view/hooks/useBranches';
import { useRepositories } from '@/modules/github/view/hooks/useRepositories';
import { useModal } from '@/modules/modal/context/GlobalModalContext';
import { borderRadius, borderWidth, spacing, useTheme } from '@/modules/theme';
import { toast } from '@/modules/toast/toast';
import { Ionicons } from '@expo/vector-icons';
import { Galeria } from '@nandorojo/galeria';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { CursorCloudAgentsRepositoryImpl } from '../../data/repository/CursorCloudAgentsRepositoryImpl';
import { useModels } from '../hooks/useModels';
import { AgentPromptInput } from './AgentPromptInput';
import { CompactDropdown } from './CompactDropdown';
import { IconButton } from './IconButton';

const CREATE_NEW_REPO_VALUE = '__CREATE_NEW_REPO__';

interface CreateAgentFormProps {
  onSuccess?: () => void;
}

export const CreateAgentForm: React.FC<CreateAgentFormProps> = ({ onSuccess }) => {
  const { cursorApiKey, githubPat } = useApiKey();
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { models, isLoading: isLoadingModels } = useModels();
  const { repositories, isLoading: isLoadingRepos } = useRepositories();
  const { showModal, hideModal } = useModal();

  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('');
  const [repository, setRepository] = useState('');
  const [branch, setBranch] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleRepoCreated = useCallback(
    (newRepo: GitHubRepo) => {
      hideModal();
      // Select the newly created repository
      setRepository(newRepo.htmlUrl);
    },
    [hideModal]
  );

  const handleOpenCreateRepo = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showModal(<CreateRepositoryForm onSuccess={handleRepoCreated} />, { snapPoints: ['60%'] });
  }, [showModal, handleRepoCreated]);

  const handleRepoSelect = useCallback(
    (value: string) => {
      if (value === CREATE_NEW_REPO_VALUE) {
        handleOpenCreateRepo();
      } else {
        setRepository(value);
      }
    },
    [handleOpenCreateRepo]
  );

  // Parse selected repository to get owner and repo name for branch fetching
  const selectedRepoInfo = useMemo(() => {
    if (!repository) return { owner: '', repo: '' };
    // Repository is stored as full URL: https://github.com/owner/repo
    const match = repository.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
    return { owner: '', repo: '' };
  }, [repository]);

  const { branches, isLoading: isLoadingBranches } = useBranches({
    owner: selectedRepoInfo.owner,
    repo: selectedRepoInfo.repo,
    enabled: !!selectedRepoInfo.owner && !!selectedRepoInfo.repo,
  });

  // Find the selected repo to get its default branch
  const selectedRepo = useMemo(() => {
    return repositories.find((r) => r.htmlUrl === repository);
  }, [repositories, repository]);

  // Set default branch when repository changes
  useEffect(() => {
    if (selectedRepo?.defaultBranch) {
      setBranch(selectedRepo.defaultBranch);
    } else {
      setBranch('');
    }
  }, [selectedRepo]);

  const modelOptions = models.map((m) => ({ label: m, value: m }));

  const repoOptions = useMemo(() => {
    const createNewOption = { label: 'Create new repository...', value: CREATE_NEW_REPO_VALUE };

    if (isLoadingRepos) {
      return [createNewOption, { label: 'Loading repositories...', value: '', disabled: true }];
    }
    if (!githubPat) {
      return [{ label: 'Configure GitHub PAT in Settings', value: '', disabled: true }];
    }
    if (repositories.length === 0) {
      return [createNewOption, { label: 'No repositories found', value: '', disabled: true }];
    }
    return [
      createNewOption,
      ...repositories.map((r) => ({
        label: r.fullName,
        value: r.htmlUrl,
      })),
    ];
  }, [repositories, isLoadingRepos, githubPat]);

  const branchOptions = useMemo(() => {
    if (!repository) {
      return [{ label: 'Select a repository first', value: '', disabled: true }];
    }
    if (isLoadingBranches) {
      return [{ label: 'Loading branches...', value: '', disabled: true }];
    }
    if (branches.length === 0) {
      return [{ label: 'No branches found', value: '', disabled: true }];
    }
    return branches.map((b) => ({
      label: b.name,
      value: b.name,
    }));
  }, [branches, isLoadingBranches, repository]);

  const createAgentMutation = useMutation({
    mutationFn: async () => {
      if (!cursorApiKey) throw new Error('No API key');
      if (!prompt.trim()) throw new Error('Please enter a prompt');
      if (!model) throw new Error('Please select a model');
      if (!repository) throw new Error('Please select a repository');

      const repo = new CursorCloudAgentsRepositoryImpl(cursorApiKey);

      const imageData = images.map((uri) => ({
        url: uri,
        dimensions: { width: 800, height: 600 },
      }));

      return repo.launchAgent({
        prompt: {
          text: prompt.trim(),
          images:
            imageData.length > 0
              ? imageData.map((image) => ({
                  data: image.url,
                  dimensions: image.dimensions,
                }))
              : undefined,
        },
        model,
        source: {
          repository,
          ref: branch,
        },
      });
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.success('Agent created', { description: 'Your agent is now running' });
      setPrompt('');
      setModel('');
      setRepository('');
      setBranch('');
      setImages([]);
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      onSuccess?.();
    },
    onError: (error) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create agent');
    },
  });

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...newImages]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleRemoveImage = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    createAgentMutation.mutate();
  };

  const canSubmit =
    prompt.trim() && model && repository && branch && !createAgentMutation.isPending;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      borderWidth: borderWidth.thin,
      borderColor: colors.border,
      marginBottom: spacing['2xl'],
      overflow: 'hidden',
    },
    inputSection: {
      padding: spacing.lg,
      paddingBottom: spacing.md,
    },
    imageList: {
      paddingTop: spacing.sm,
    },
    imageContainer: {
      position: 'relative',
      marginRight: spacing.sm,
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: borderRadius.md,
      borderWidth: borderWidth.thin,
      borderColor: colors.border,
    },
    removeImageButton: {
      position: 'absolute',
      top: -6,
      right: -6,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.border,
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderTopWidth: borderWidth.thin,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    toolbarLeft: {
      flex: 1,
    },
    toolbarRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    sourceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      gap: spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      {/* Input Section */}
      <View style={styles.inputSection}>
        <AgentPromptInput value={prompt} onChangeText={setPrompt} />

        {/* Attached Images */}
        {images.length > 0 && (
          <Galeria urls={images}>
            <ScrollView horizontal style={styles.imageList} showsHorizontalScrollIndicator={false}>
              {images.map((uri, index) => (
                <View key={uri} style={styles.imageContainer}>
                  <Galeria.Image index={index} style={styles.image}>
                    <Image source={{ uri }} style={styles.image} contentFit="cover" />
                  </Galeria.Image>
                  <Pressable
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                    hitSlop={8}
                  >
                    <Ionicons name="close" size={12} color={colors.textSecondary} />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </Galeria>
        )}
      </View>

      {/* Toolbar: Model picker, image, send */}
      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          <CompactDropdown
            options={modelOptions}
            value={model}
            onSelect={setModel}
            placeholder={isLoadingModels ? 'Loading...' : 'Select model'}
            disabled={isLoadingModels}
          />
        </View>
        <View style={styles.toolbarRight}>
          <IconButton
            icon="image"
            variant="ghost"
            onPress={handlePickImage}
            disabled={createAgentMutation.isPending}
          />
          <IconButton
            icon="arrow-up"
            variant={canSubmit ? 'primary' : 'default'}
            onPress={handleSubmit}
            disabled={!canSubmit}
          />
        </View>
      </View>

      {/* Source Row: Repository and Branch */}
      <View style={styles.sourceRow}>
        <CompactDropdown
          options={repoOptions}
          value={repository}
          onSelect={handleRepoSelect}
          placeholder={isLoadingRepos ? 'Loading...' : 'Repository'}
          icon="folder"
          disabled={!githubPat}
        />
        <CompactDropdown
          options={branchOptions}
          value={branch}
          onSelect={setBranch}
          placeholder={isLoadingBranches ? 'Loading...' : 'Branch'}
          icon="git-branch"
          disabled={!repository || isLoadingBranches}
        />
      </View>
    </View>
  );
};
