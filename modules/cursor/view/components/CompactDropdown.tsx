import { spacing, typography, useTheme } from '@/modules/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';

interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface CompactDropdownProps {
  options: DropdownOption[];
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
}

export const CompactDropdown: React.FC<CompactDropdownProps> = ({
  options,
  value,
  onSelect,
  placeholder = 'Select...',
  icon,
  disabled = false,
}) => {
  const { colors } = useTheme();

  // Disabled if explicitly disabled OR if no options available
  const isDisabled = disabled || options.length === 0;

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label || placeholder;

  const styles = StyleSheet.create({
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      opacity: isDisabled ? 0.4 : 1,
    },
    text: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.sm,
      color: value ? colors.textSecondary : colors.textMuted,
    },
  });

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger disabled={isDisabled}>
        <View style={styles.trigger}>
          {icon && (
            <Ionicons
              name={icon}
              size={typography.fontSize.base}
              color={colors.textSecondary}
            />
          )}
          <Text style={styles.text} numberOfLines={1}>
            {displayText}
          </Text>
          <Ionicons
            name="chevron-down"
            size={typography.fontSize.xs}
            color={colors.textMuted}
            style={{ marginLeft: spacing['2xs'] }}
          />
        </View>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        {options.map((option) => (
          <DropdownMenu.Item
            key={option.value || option.label}
            onSelect={() => !option.disabled && option.value && onSelect(option.value)}
            textValue={option.label}
            disabled={option.disabled}
          >
            <DropdownMenu.ItemTitle>{option.label}</DropdownMenu.ItemTitle>
            {value === option.value && !option.disabled && <DropdownMenu.ItemIndicator />}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
