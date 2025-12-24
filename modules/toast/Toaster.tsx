import { useTheme } from '@/modules/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from './ToastContext';
import { Toast, ToastType } from './types';

function getIconForType(type: ToastType): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'success':
      return 'checkmark-circle';
    case 'error':
      return 'close-circle';
    case 'info':
      return 'information-circle';
  }
}

interface ToastItemProps {
  toast: Toast;
  onHide: (id: string) => void;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onHide, onRemove }: ToastItemProps) {
  const { colors } = useTheme();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const isAnimatingOut = useRef(false);

  // Enter animation
  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        damping: 25,
        stiffness: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity]);

  // Exit animation when isExiting becomes true
  useEffect(() => {
    if (toast.isExiting && !isAnimatingOut.current) {
      isAnimatingOut.current = true;
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onRemove(toast.id);
      });
    }
  }, [toast.isExiting, toast.id, translateY, opacity, onRemove]);

  const handleDismiss = () => {
    if (isAnimatingOut.current) return;
    onHide(toast.id);
  };

  const accentColor =
    toast.type === 'error'
      ? colors.status.error
      : toast.type === 'success'
        ? colors.status.finished
        : colors.accent;

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceElevated,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
      marginBottom: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    icon: {
      marginLeft: 4,
      marginRight: 12,
    },
    content: {
      flex: 1,
    },
    message: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    description: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    closeButton: {
      padding: 4,
    },
  });

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
      }}
    >
      <View style={styles.container}>
        <Ionicons
          name={getIconForType(toast.type)}
          size={22}
          color={accentColor}
          style={styles.icon}
        />
        <View style={styles.content}>
          <Text style={styles.message}>{toast.message}</Text>
          {toast.description && <Text style={styles.description}>{toast.description}</Text>}
        </View>
        <Pressable style={styles.closeButton} onPress={handleDismiss} hitSlop={8}>
          <Ionicons name="close" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

export function Toaster() {
  const { toasts, hideToast, removeToast } = useToast();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: insets.top + 8,
      left: 16,
      right: 16,
      zIndex: 9999,
    },
  });

  if (toasts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onHide={hideToast} onRemove={removeToast} />
      ))}
    </View>
  );
}
