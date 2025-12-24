import { spacing, typography, useTheme } from '@/modules/theme';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface SummaryViewProps {
  summary?: string;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ summary }) => {
  const { colors } = useTheme();

  if (!summary) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No summary available yet.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Markdown
        style={{
          body: {
            color: colors.textPrimary,
            fontFamily: typography.fontFamily.sans,
            fontSize: typography.fontSize.base,
          },
          heading1: {
            color: colors.textPrimary,
            fontFamily: typography.fontFamily.sans,
            fontWeight: 'bold',
          },
          heading2: {
            color: colors.textPrimary,
            fontFamily: typography.fontFamily.sans,
            fontWeight: 'bold',
          },
          code_inline: {
            backgroundColor: colors.surface,
            color: colors.accent,
            fontFamily: typography.fontFamily.mono,
          },
          code_block: {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.textPrimary,
            fontFamily: typography.fontFamily.mono,
          },
          link: {
            color: colors.accent,
          },
        }}
      >
        {summary}
      </Markdown>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontFamily: typography.fontFamily.sans,
    fontStyle: 'italic',
  },
});

