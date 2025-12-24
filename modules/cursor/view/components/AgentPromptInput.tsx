import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme, typography, spacing, borderRadius } from '@/modules/theme';

interface AgentPromptInputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const AgentPromptInput: React.FC<AgentPromptInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Ask Cursor to build, fix bugs, explore',
  ...props
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    input: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.base,
      color: colors.textPrimary,
      minHeight: 80,
      textAlignVertical: 'top',
      padding: 0,
    },
  });

  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      multiline
      {...props}
    />
  );
};

