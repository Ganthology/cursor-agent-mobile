import { borderRadius, iconSize, useTheme } from '@/modules/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';

interface IconButtonProps extends Omit<PressableProps, 'style'> {
  icon: keyof typeof Ionicons.glyphMap;
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'default',
  size = 'md',
  disabled = false,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  const sizeMap = {
    sm: { button: 28, icon: iconSize.sm },
    md: { button: 36, icon: iconSize.md },
    lg: { button: 44, icon: iconSize.lg },
  };

  const dimensions = sizeMap[size];

  const styles = StyleSheet.create({
    button: {
      width: dimensions.button,
      height: dimensions.button,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      ...(variant === 'default' && {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
      }),
      ...(variant === 'primary' && {
        backgroundColor: colors.accent,
        borderWidth: 0,
      }),
      ...(variant === 'ghost' && {
        backgroundColor: 'transparent',
        borderWidth: 0,
      }),
      ...(disabled && {
        opacity: 0.4,
      }),
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && !disabled && { opacity: 0.7 }, style]}
      disabled={disabled}
      {...props}
    >
      <Ionicons
        name={icon}
        size={dimensions.icon}
        color={variant === 'primary' ? '#ffffff' : colors.textSecondary}
      />
    </Pressable>
  );
};
