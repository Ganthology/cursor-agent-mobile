import { useTheme, typography } from '@/modules/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';

// Mock branches - will be replaced with GitHub API call later
const MOCK_BRANCHES = [
  'main',
  'master',
  'develop',
  'staging',
  'feature/new-ui',
  'feature/api-integration',
];

interface BranchPickerProps {
  repository?: string;
  value: string;
  onValueChange: (value: string) => void;
}

export function BranchPicker({ repository, value, onValueChange }: BranchPickerProps) {
  const { colors } = useTheme();
  const isDisabled = !repository;

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
      fontFamily: typography.fontFamily.mono,  // Mono for branch names
    },
    placeholderText: {
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.sans,
    },
    disabledTrigger: {
      opacity: 0.5,
    },
  });

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger disabled={isDisabled}>
        <View style={[styles.trigger, isDisabled && styles.disabledTrigger]}>
          <Text style={value ? styles.triggerText : styles.placeholderText}>
            {isDisabled ? 'Select repo first...' : value || 'Select branch...'}
          </Text>
          <Text style={styles.triggerText}>▼</Text>
        </View>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        {MOCK_BRANCHES.map((branch) => (
          <DropdownMenu.Item key={branch} onSelect={() => onValueChange(branch)} textValue={branch}>
            <DropdownMenu.ItemTitle>{branch}</DropdownMenu.ItemTitle>
            {value === branch && <DropdownMenu.ItemIndicator />}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
