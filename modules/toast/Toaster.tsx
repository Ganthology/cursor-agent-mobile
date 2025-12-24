import { useTheme } from '@/modules/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  EntryExitAnimationFunction,
  LinearTransition,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from './ToastContext';
import { Toast, ToastType } from './types';

const SPRING_CONFIG = { duration: 500 };

// Custom entering animation - slide down from top with fade
const toastEntering: EntryExitAnimationFunction = () => {
  'worklet';
  const initialValues = {
    opacity: 0,
    transform: [{ translateY: -80 }],
  };
  const animations = {
    opacity: withTiming(1, { duration: 200 }),
    transform: [
      {
        translateY: withSpring(0, SPRING_CONFIG),
      },
    ],
  };
  return { initialValues, animations };
};

// Custom exiting animation - slide up with fade
const toastExiting: EntryExitAnimationFunction = () => {
  'worklet';
  const initialValues = {
    opacity: 1,
    transform: [{ translateY: 0 }],
  };
  const animations = {
    opacity: withTiming(0, { duration: 200 }),
    transform: [{ translateY: withSpring(-80, SPRING_CONFIG) }],
  };
  return { initialValues, animations };
};

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
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { colors } = useTheme();

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
      entering={toastEntering}
      exiting={toastExiting}
      layout={LinearTransition.springify().damping(28).stiffness(180).duration(500)}
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
        <Pressable style={styles.closeButton} onPress={() => onDismiss(toast.id)} hitSlop={8}>
          <Ionicons name="close" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

export function Toaster() {
  const { toasts, removeToast } = useToast();
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
        <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </View>
  );
}
