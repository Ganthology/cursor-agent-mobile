import { useApiKey } from '@/modules/apiKeyManagement/context/ApiKeyContext';
import { CursorCloudAgentsRepositoryImpl } from '@/modules/cursor/data/repository/CursorCloudAgentsRepositoryImpl';
import { AgentHeader } from '@/modules/cursor/view/components/AgentHeader';
import { ChatView } from '@/modules/cursor/view/components/ChatView';
import { SummaryView } from '@/modules/cursor/view/components/SummaryView';
import { borderRadius, spacing, typography, useTheme } from '@/modules/theme';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    // Header bar for loading/error states
    headerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      gap: spacing.sm,
    },
    backButton: {
      padding: spacing.sm,
      borderRadius: borderRadius.md,
    },
    headerTitle: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textPrimary,
      fontSize: typography.fontSize.lg,
      fontWeight: '600',
    },
    // Tabs
    tabContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: colors.accent,
    },
    tabText: {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.sm,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.textPrimary,
    },
    // Content
    content: {
      flex: 1,
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
    errorTitle: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textPrimary,
      fontSize: typography.fontSize.xl,
      fontWeight: '600',
      marginBottom: spacing.sm,
    },
    errorText: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textSecondary,
      textAlign: 'center',
      fontSize: typography.fontSize.sm,
    },
    retryButton: {
      marginTop: spacing.lg,
      backgroundColor: colors.accent,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
    },
    retryButtonText: {
      fontFamily: typography.fontFamily.sans,
      color: '#ffffff',
      fontSize: typography.fontSize.sm,
      fontWeight: '600',
    },
    link: {
      fontFamily: typography.fontFamily.sans,
      color: colors.accent,
      fontSize: typography.fontSize.sm,
      marginTop: spacing.md,
    },
  });

export default function AgentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { cursorApiKey } = useApiKey();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [activeTab, setActiveTab] = useState<'chat' | 'summary'>('chat');

  const {
    data: agent,
    isLoading: isLoadingAgent,
    error: agentError,
    refetch: refetchAgent,
  } = useQuery({
    queryKey: ['agent', id],
    queryFn: () => {
      if (!cursorApiKey) throw new Error('API key not configured');
      const repository = new CursorCloudAgentsRepositoryImpl(cursorApiKey);
      return repository.getAgent(id as string);
    },
    enabled: !!id && !!cursorApiKey,
  });

  const {
    data: conversation,
    isLoading: isLoadingConversation,
    error: conversationError,
    refetch: refetchConversation,
  } = useQuery({
    queryKey: ['conversation', id],
    queryFn: () => {
      if (!cursorApiKey) throw new Error('API key not configured');
      const repository = new CursorCloudAgentsRepositoryImpl(cursorApiKey);
      return repository.getAgentConversation(id as string);
    },
    enabled: !!id && !!cursorApiKey,
  });

  const handleBack = () => {
    router.back();
  };

  const handleOpenPR = () => {
    if (agent?.target.prUrl) {
      Linking.openURL(agent.target.prUrl);
    }
  };

  const handleTabChange = (tab: 'chat' | 'summary') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    refetchAgent();
    refetchConversation();
  };

  // No API key configured
  if (!cursorApiKey) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerBar}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Agent</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>We couldn't load this</Text>
          <Text style={styles.errorText}>
            API key not configured. Please configure your Cursor API key in Settings.
          </Text>
          <Pressable onPress={handleBack}>
            <Text style={styles.link}>← Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Loading state - show header with back button
  if (isLoadingAgent || isLoadingConversation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerBar}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading agent details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (agentError || conversationError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerBar}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Error</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>We couldn't load this</Text>
          <Text style={styles.errorText}>Please try again later</Text>
          <Pressable style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
          <Pressable onPress={handleBack}>
            <Text style={styles.link}>← Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!agent) {
    return null;
  }

  const canAddFollowUp = agent.status !== 'EXPIRED';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <AgentHeader
          agent={agent}
          onBack={handleBack}
          onViewPR={handleOpenPR}
          onMarkReady={handleOpenPR}
        />

        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
            onPress={() => handleTabChange('chat')}
          >
            <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>Chat</Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'summary' && styles.activeTab]}
            onPress={() => handleTabChange('summary')}
          >
            <Text style={[styles.tabText, activeTab === 'summary' && styles.activeTabText]}>
              Summary
            </Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          {activeTab === 'chat' ? (
            <ChatView
              messages={conversation?.messages}
              agentId={agent.id}
              canAddFollowUp={canAddFollowUp}
            />
          ) : (
            <SummaryView summary={agent.summary} />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
