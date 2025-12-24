import { useTheme, typography } from '@/modules/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';

// Mock repositories - will be replaced with API call later
const MOCK_REPOS = [
  { name: 'your-org/repo-1', url: 'https://github.com/your-org/repo-1' },
  { name: 'your-org/repo-2', url: 'https://github.com/your-org/repo-2' },
  { name: 'your-org/repo-3', url: 'https://github.com/your-org/repo-3' },
  { name: 'personal/project-1', url: 'https://github.com/personal/project-1' },
  { name: 'personal/project-2', url: 'https://github.com/personal/project-2' },
];

interface RepositoryPickerProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function RepositoryPicker({ value, onValueChange }: RepositoryPickerProps) {
  const { colors } = useTheme();
  
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
      fontFamily: typography.fontFamily.mono,  // Mono for repo paths
      flex: 1,
    },
    placeholderText: {
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.sans,
    },
  });

  const selectedRepoName = MOCK_REPOS.find((repo) => repo.url === value)?.name || null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View style={styles.trigger}>
          <Text
            style={selectedRepoName ? styles.triggerText : styles.placeholderText}
            numberOfLines={1}
          >
            {selectedRepoName || 'Select repository...'}
          </Text>
          <Text style={styles.triggerText}>▼</Text>
        </View>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        {MOCK_REPOS.map((repo) => (
          <DropdownMenu.Item key={repo.url} onSelect={() => onValueChange(repo.url)} textValue={repo.name}>
            <DropdownMenu.ItemTitle>{repo.name}</DropdownMenu.ItemTitle>
            {value === repo.url && <DropdownMenu.ItemIndicator />}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
