import { borderRadius, spacing, typography, useTheme } from '@/modules/theme';
import { getStatusBadgeStyle, getStatusTextStyle } from '@/modules/theme/helpers';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CursorCloudAgent } from '../../data/entity/CursorCloudAgent';

interface AgentHeaderProps {
  agent: CursorCloudAgent;
  onBack: () => void;
  onViewPR: () => void;
  onMarkReady: () => void;
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({
  agent,
  onBack,
  onViewPR,
  onMarkReady,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);

  const hasPrUrl = !!agent.target.prUrl;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {agent.name}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.branchContainer}>
          <Text style={styles.branchIcon}>🌱</Text>
          <Text style={styles.branchName} numberOfLines={1}>
            {agent.target.branchName || 'No branch'}
          </Text>
        </View>
        <View style={[getStatusBadgeStyle(colors, agent.status), styles.statusBadge]}>
          <Text style={getStatusTextStyle(colors, agent.status)}>{agent.status}</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          style={[styles.button, styles.secondaryButton, !hasPrUrl && styles.disabledButton]}
          onPress={onViewPR}
          disabled={!hasPrUrl}
        >
          <Text style={styles.secondaryButtonText}>View PR</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.primaryButton, !hasPrUrl && styles.disabledButton]}
          onPress={onMarkReady}
          disabled={!hasPrUrl}
        >
          <Text style={styles.primaryButtonText}>Mark as ready</Text>
        </Pressable>
      </View>
    </View>
  );
};

const createStyles = (colors: any, insets: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
      marginTop: spacing.sm,
    },
    backButton: {
      padding: spacing.xs,
      marginRight: spacing.sm,
    },
    backButtonText: {
      fontFamily: typography.fontFamily.sans,
      fontSize: 24,
      color: colors.textPrimary,
      lineHeight: 28,
    },
    title: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.lg,
      fontWeight: '600',
      color: colors.textPrimary,
      flex: 1,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    branchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: spacing.md,
    },
    branchIcon: {
      fontSize: typography.fontSize.sm,
      marginRight: spacing.xs,
      color: colors.textSecondary,
    },
    branchName: {
      fontFamily: typography.fontFamily.mono,
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
    },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    actionsRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    button: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    },
    primaryButton: {
      backgroundColor: colors.textPrimary, // In dark mode this is white/light
      borderColor: colors.textPrimary,
    },
    primaryButtonText: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.sm,
      fontWeight: '600',
      color: colors.background, // Text should contrast with button bg
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderColor: colors.border,
    },
    secondaryButtonText: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.sm,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    disabledButton: {
      opacity: 0.5,
    },
  });

