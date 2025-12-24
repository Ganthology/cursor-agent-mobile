import { TextStyle, ViewStyle } from 'react-native';
import { ColorPalette } from './data/entity/Colors';
import { typography } from './data/entity/Typography';
import { borderRadius, spacing } from './data/entity/Spacing';

type AgentStatus = 'RUNNING' | 'FINISHED' | 'ERROR' | 'CREATING' | 'EXPIRED';

/**
 * Get status color for a given agent status
 */
export const getStatusColor = (colors: ColorPalette, status: AgentStatus): string => {
  const statusMap: Record<AgentStatus, string> = {
    RUNNING: colors.status.running,
    FINISHED: colors.status.finished,
    ERROR: colors.status.error,
    CREATING: colors.status.creating,
    EXPIRED: colors.status.expired,
  };
  return statusMap[status];
};

/**
 * Status badge style generator
 */
export const getStatusBadgeStyle = (colors: ColorPalette, status: AgentStatus): ViewStyle => ({
  backgroundColor: getStatusColor(colors, status) + '20',
  borderColor: getStatusColor(colors, status),
  borderWidth: 1,
  borderRadius: borderRadius.sm,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  alignSelf: 'flex-start',
});

/**
 * Status badge text style generator - uses sans font for better readability
 */
export const getStatusTextStyle = (colors: ColorPalette, status: AgentStatus): TextStyle => ({
  color: getStatusColor(colors, status),
  fontFamily: typography.fontFamily.sans,
  fontSize: typography.fontSize.xs,
  fontWeight: typography.fontWeight.semibold,
});

