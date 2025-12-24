import { useApiKey } from '@/modules/apiKeyManagement/context/ApiKeyContext';
import { borderRadius, borderWidth, spacing, typography, useTheme } from '@/modules/theme';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CursorCloudAgentsRepositoryImpl } from '../../data/repository/CursorCloudAgentsRepositoryImpl';

interface FollowUpInputProps {
  agentId: string;
  onSuccess?: () => void;
}

export const FollowUpInput: React.FC<FollowUpInputProps> = ({ agentId, onSuccess }) => {
  const { cursorApiKey } = useApiKey();
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const followUpMutation = useMutation({
    mutationFn: async () => {
      if (!cursorApiKey) throw new Error('No API key');
      if (!prompt.trim()) throw new Error('Please enter a message');

      const repo = new CursorCloudAgentsRepositoryImpl(cursorApiKey);

      const imageData = images.map((uri) => ({
        data: uri,
        dimensions: { width: 800, height: 600 },
      }));

      return repo.addFollowUp(agentId, {
        prompt: {
          text: prompt.trim(),
          images: imageData.length > 0 ? imageData : undefined,
        },
      });
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setPrompt('');
      setImages([]);
      // Invalidate conversation to refresh the messages
      queryClient.invalidateQueries({ queryKey: ['conversation', agentId] });
      queryClient.invalidateQueries({ queryKey: ['agent', agentId] });
      onSuccess?.();
    },
    onError: (error) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send follow-up');
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
    if (!prompt.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    followUpMutation.mutate();
  };

  const canSubmit = prompt.trim() && !followUpMutation.isPending;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderTopWidth: borderWidth.thin,
      borderTopColor: colors.border,
      paddingBottom: spacing.md,
    },
    imageList: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
    },
    imageContainer: {
      position: 'relative',
      marginRight: spacing.sm,
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: borderRadius.sm,
      borderWidth: borderWidth.thin,
      borderColor: colors.border,
    },
    removeImageButton: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: colors.status.error,
      width: 16,
      height: 16,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeImageText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: 'bold',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      gap: spacing.sm,
    },
    inputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor: colors.inputBg,
      borderRadius: borderRadius.lg,
      borderWidth: borderWidth.thin,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: 44,
      maxHeight: 120,
    },
    input: {
      flex: 1,
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.base,
      color: colors.textPrimary,
      paddingVertical: 0,
      maxHeight: 100,
    },
    attachButton: {
      padding: spacing.xs,
      marginRight: spacing.xs,
    },
    attachButtonText: {
      fontSize: 18,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonEnabled: {
      backgroundColor: colors.accent,
    },
    sendButtonDisabled: {
      backgroundColor: colors.border,
    },
    sendButtonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '600',
    },
    sendingText: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.xs,
      color: colors.textMuted,
      textAlign: 'center',
      paddingTop: spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      {/* Attached Images */}
      {images.length > 0 && (
        <ScrollView horizontal style={styles.imageList} showsHorizontalScrollIndicator={false}>
            {images.map((uri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.image} />
              <Pressable style={styles.removeImageButton} onPress={() => handleRemoveImage(index)}>
                <Ionicons name="close" size={12} color="#fff" />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Input Row */}
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Pressable
            style={styles.attachButton}
            onPress={handlePickImage}
            disabled={followUpMutation.isPending}
          >
            <Ionicons name="attach" size={20} color={colors.textSecondary} />
          </Pressable>
          <TextInput
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Send a follow-up..."
            placeholderTextColor={colors.textMuted}
            multiline
            editable={!followUpMutation.isPending}
          />
        </View>
        <Pressable
          style={[
            styles.sendButton,
            canSubmit ? styles.sendButtonEnabled : styles.sendButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Ionicons name="arrow-up" size={20} color="#fff" />
        </Pressable>
      </View>

      {followUpMutation.isPending && <Text style={styles.sendingText}>Sending...</Text>}
    </View>
  );
};
