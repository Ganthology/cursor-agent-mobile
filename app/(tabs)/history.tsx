import { useApiKey } from '@/modules/apiKeyManagement/context/ApiKeyContext';
import { CursorCloudAgent } from '@/modules/cursor/data/entity/CursorCloudAgent';
import { CursorCloudAgentsRepositoryImpl } from '@/modules/cursor/data/repository/CursorCloudAgentsRepositoryImpl';
import { groupAgentsByDate } from '@/modules/cursor/utils/dateUtils';
import { borderRadius, spacing, typography, useTheme } from '@/modules/theme';
import { getStatusBadgeStyle, getStatusTextStyle } from '@/modules/theme/helpers';
import { toast } from '@/modules/toast/toast';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { GlassView } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DropdownMenu from 'zeego/dropdown-menu';

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
    },
    title: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textPrimary,
      fontSize: 28,
      fontWeight: '700',
    },
    filterButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      overflow: 'hidden',
    },
    filterButtonInner: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
      paddingTop: spacing.sm,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    sectionTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    repoIconContainer: {
      width: 28,
      height: 28,
      borderRadius: 6,
      backgroundColor: colors.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionTitle: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
    dateSectionTitle: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textSecondary,
      fontSize: typography.fontSize.xs,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    taskCountBadge: {
      backgroundColor: colors.surfaceElevated,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    taskCountText: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    // Card styles
    agentCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      marginBottom: spacing.md,
      // iOS shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      // Android elevation
      elevation: 2,
    },
    agentCardPressed: {
      opacity: 0.7,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing['2xs'],
      borderRadius: borderRadius.sm,
    },
    statusText: {
      fontSize: typography.fontSize.xs,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    timeAgo: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textMuted,
      fontSize: typography.fontSize.xs,
    },
    agentName: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textPrimary,
      fontSize: typography.fontSize.base,
      fontWeight: '600',
      marginBottom: spacing.xs,
    },
    repoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.xs,
    },
    agentRepo: {
      fontFamily: typography.fontFamily.mono,
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm,
      flex: 1,
    },
    branchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: 6,
      gap: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    branchText: {
      fontFamily: typography.fontFamily.mono,
      fontSize: 12,
      color: colors.textSecondary,
    },
    // States
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textSecondary,
      marginTop: spacing.sm,
      fontSize: typography.fontSize.sm,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    errorText: {
      fontFamily: typography.fontFamily.sans,
      color: colors.status.error,
      textAlign: 'center',
      fontSize: typography.fontSize.sm,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    emptyText: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textSecondary,
      fontSize: typography.fontSize.sm,
      textAlign: 'center',
    },
    settingsButton: {
      backgroundColor: colors.accent,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      marginTop: spacing.lg,
    },
    settingsButtonText: {
      fontFamily: typography.fontFamily.sans,
      color: '#ffffff',
      fontSize: typography.fontSize.sm,
      fontWeight: '600',
    },
  });

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

interface AgentCardProps {
  agent: CursorCloudAgent;
  onPress: () => void;
  showRepo?: boolean;
}

function AgentCard({ agent, onPress, showRepo = true }: AgentCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.agentCard, pressed && styles.agentCardPressed]}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.statusBadge, getStatusBadgeStyle(colors, agent.status)]}>
          <Text style={[styles.statusText, getStatusTextStyle(colors, agent.status)]}>
            {agent.status}
          </Text>
        </View>
        <Text style={styles.timeAgo}>{getTimeAgo(new Date(agent.createdAt))}</Text>
      </View>

      <Text style={styles.agentName} numberOfLines={2} ellipsizeMode="tail">
        {agent.name}
      </Text>

      {showRepo && (
        <View style={styles.repoContainer}>
          <Ionicons name="book-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.agentRepo} numberOfLines={1} ellipsizeMode="middle">
            {agent.source.repository.replace(/^(https?:\/\/)?github\.com\//, '')}
          </Text>
        </View>
      )}

      {agent.source.ref ? (
        <View style={styles.branchContainer}>
          <Ionicons name="terminal-outline" size={12} color={colors.textSecondary} />
          <Text style={styles.branchText} numberOfLines={1}>
            {agent.source.ref}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export default function HistoryTab() {
  const { cursorApiKey, keysLoaded } = useApiKey();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [groupByRepository, setGroupByRepository] = useState(true);

  const {
    data: agentsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['agents', cursorApiKey],
    queryFn: async () => {
      if (!cursorApiKey) return { agents: [] as CursorCloudAgent[], nextCursor: '' };
      return new CursorCloudAgentsRepositoryImpl(cursorApiKey).listAgents();
    },
    enabled: !!cursorApiKey && keysLoaded,
  });

  useEffect(() => {
    // log all agents data, including nested fields
    console.dir(agentsData, { depth: null });
  }, [agentsData]);

  const handleAgentPress = (agent: CursorCloudAgent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (agent.status === 'EXPIRED' || agent.status === 'ERROR') {
      const message =
        agent.status === 'EXPIRED' ? 'This agent has expired' : 'This agent has an error';
      const description =
        agent.status === 'EXPIRED'
          ? 'Expired agents can only be viewed on Cursor web'
          : 'Agents with errors cannot be viewed at this time';

      toast.error(message, {
        description,
      });
      return;
    }

    router.push(`/agent/${agent.id}` as any);
  };

  const handleGoToSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/settings' as any);
  };

  // Group and sort agents
  const processedGroups = useMemo(() => {
    if (!agentsData?.agents) return [];

    // Base sort: Active first, then by date desc
    const sortedAgents = [...agentsData.agents].sort((a, b) => {
      if (a.status !== 'EXPIRED' && b.status === 'EXPIRED') return -1;
      if (a.status === 'EXPIRED' && b.status !== 'EXPIRED') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (groupByRepository) {
      const groups: Record<string, CursorCloudAgent[]> = {};
      sortedAgents.forEach((agent) => {
        const repo = agent.source.repository.replace(/^(https?:\/\/)?github\.com\//, '');
        if (!groups[repo]) groups[repo] = [];
        groups[repo].push(agent);
      });

      return Object.entries(groups)
        .map(([repo, data]) => ({
          title: repo,
          data,
          count: data.length,
          type: 'repository' as const,
        }))
        .sort((a, b) => {
          // Sort groups by the newest agent in each group
          const newestA = Math.max(...a.data.map((d) => new Date(d.createdAt).getTime()));
          const newestB = Math.max(...b.data.map((d) => new Date(d.createdAt).getTime()));
          return newestB - newestA;
        });
    } else {
      return groupAgentsByDate(sortedAgents).map((group) => ({
        ...group,
        type: 'date' as const,
      }));
    }
  }, [agentsData?.agents, groupByRepository]);

  // Show loading while keys are being loaded from secure storage
  if (!keysLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show empty state if no API key configured
  if (!cursorApiKey) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Configure your Cursor API key in Settings{'\n'}to view agent history
          </Text>
          <Pressable style={styles.settingsButton} onPress={handleGoToSettings}>
            <Text style={styles.settingsButtonText}>Go to Settings</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Pressable style={styles.filterButton}>
              <GlassView style={styles.filterButtonInner}>
                <Ionicons name="options-outline" size={20} color={colors.textPrimary} />
              </GlassView>
            </Pressable>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem
              key="group-by-repo"
              value={groupByRepository ? 'on' : 'off'}
              onValueChange={(state) => setGroupByRepository(state === 'on')}
            >
              <DropdownMenu.ItemTitle>Group by Repository</DropdownMenu.ItemTitle>
              <DropdownMenu.ItemIndicator />
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading agents...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'Failed to load agents'}
          </Text>
        </View>
      ) : agentsData?.agents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No agents yet.{'\n'}Create your first agent in the Compose tab!
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 80 },
          ]}
        >
          {processedGroups.map((group) => (
            <Animated.View
              key={group.title}
              layout={LinearTransition}
              entering={FadeIn}
              exiting={FadeOut}
            >
              <View style={styles.sectionHeader}>
                {group.type === 'repository' ? (
                  <>
                    <View style={styles.sectionTitleContainer}>
                      <View style={styles.repoIconContainer}>
                        <Ionicons name="book" size={16} color={colors.textSecondary} />
                      </View>
                      <Text style={styles.sectionTitle}>{group.title}</Text>
                    </View>
                    <View style={styles.taskCountBadge}>
                      <Text style={styles.taskCountText}>
                        {group.count} {group.count === 1 ? 'Task' : 'Tasks'}
                      </Text>
                    </View>
                  </>
                ) : (
                  <Text style={styles.dateSectionTitle}>{group.title}</Text>
                )}
              </View>
              {group.data.map((agent) => (
                <Animated.View
                  key={agent.id}
                  layout={LinearTransition}
                  entering={FadeIn}
                  exiting={FadeOut}
                >
                  <AgentCard
                    agent={agent}
                    onPress={() => handleAgentPress(agent)}
                    showRepo={!groupByRepository}
                  />
                </Animated.View>
              ))}
            </Animated.View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
