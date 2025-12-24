import { useApiKey } from '@/modules/apiKeyManagement/context/ApiKeyContext';
import { CursorCloudAgentsRepositoryImpl } from '@/modules/cursor/data/repository/CursorCloudAgentsRepositoryImpl';
import { typography, useTheme } from '@/modules/theme';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';

interface ModelPickerProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ModelPicker({ value, onValueChange }: ModelPickerProps) {
  const { colors } = useTheme();
  const { cursorApiKey } = useApiKey();

  const styles = StyleSheet.create({
    trigger: {
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 48,
    },
    triggerText: {
      color: colors.textPrimary,
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.sans,
    },
    placeholderText: {
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.sans,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    loadingText: {
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.sans,
    },
  });

  const { data: modelsResponse, isLoading } = useQuery({
    queryKey: ['models', cursorApiKey],
    queryFn: () => {
      if (!cursorApiKey) return Promise.resolve({ models: [] });
      const repository = new CursorCloudAgentsRepositoryImpl(cursorApiKey);
      return repository.listModels();
    },
    enabled: !!cursorApiKey,
    staleTime: Infinity,
  });

  const models = modelsResponse?.models || [];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View style={styles.trigger}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.accent} />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <>
              <Text style={value ? styles.triggerText : styles.placeholderText}>
                {value || 'Select model...'}
              </Text>
              <Text style={styles.triggerText}>▼</Text>
            </>
          )}
        </View>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        {models.length === 0 ? (
          <DropdownMenu.Item key="no-models" onSelect={() => {}} textValue="No models available">
            <DropdownMenu.ItemTitle>No models available</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        ) : (
          models.map((model) => (
            <DropdownMenu.Item key={model} onSelect={() => onValueChange(model)} textValue={model}>
              <DropdownMenu.ItemTitle>{model}</DropdownMenu.ItemTitle>
              {value === model && <DropdownMenu.ItemIndicator />}
            </DropdownMenu.Item>
          ))
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
