import { borderRadius, spacing, typography, useTheme } from '@/modules/theme';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { CursorCloudAgentConversation } from '../../data/entity/CursorCloudAgentConversation';
import { FollowUpInput } from './FollowUpInput';

interface ChatViewProps {
  messages?: CursorCloudAgentConversation[];
  agentId: string;
  canAddFollowUp: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({ messages, agentId, canAddFollowUp }) => {
  const { colors } = useTheme();

  const groupedMessages = useMemo(() => {
    if (!messages || messages.length === 0) return [];

    const result: { id: string; type: 'user_message' | 'assistant_message'; text: string }[] = [];
    let currentMessage: (typeof result)[0] | null = null;

    messages.forEach((msg) => {
      if (
        currentMessage &&
        currentMessage.type === 'assistant_message' &&
        msg.type === 'assistant_message'
      ) {
        // Append to existing assistant message group
        currentMessage.text += '\n\n' + msg.text;
      } else {
        // Start new message group
        currentMessage = {
          id: msg.id,
          type: msg.type,
          text: msg.text,
        };
        result.push(currentMessage);
      }
    });

    return result;
  }, [messages]);

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {groupedMessages.length === 0 ? (
          <Text style={styles.emptyText}>No conversation messages available</Text>
        ) : (
          groupedMessages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageContainer,
                msg.type === 'user_message' ? styles.userContainer : styles.assistantContainer,
              ]}
            >
              {msg.type === 'user_message' ? (
                <View style={styles.userBubble}>
                  <Text style={styles.userText}>{msg.text}</Text>
                </View>
              ) : (
                <View style={styles.assistantContent}>
                  <Markdown
                    style={{
                      body: {
                        color: colors.textPrimary,
                        fontFamily: typography.fontFamily.sans,
                        fontSize: typography.fontSize.sm,
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
                    }}
                  >
                    {msg.text}
                  </Markdown>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
      {canAddFollowUp && <FollowUpInput agentId={agentId} />}
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
    },
    emptyText: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.xl,
      fontStyle: 'italic',
    },
    messageContainer: {
      marginBottom: spacing.md,
      width: '100%',
    },
    userContainer: {
      alignItems: 'flex-end',
    },
    assistantContainer: {
      alignItems: 'flex-start',
    },
    userBubble: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      maxWidth: '80%',
      borderWidth: 1,
      borderColor: colors.border,
    },
    userText: {
      fontFamily: typography.fontFamily.sans,
      color: colors.textPrimary,
      fontSize: typography.fontSize.sm,
    },
    assistantContent: {
      width: '100%',
      // Markdown takes full width naturally, but we might want to constrain it slightly or add padding
      paddingRight: spacing.md,
    },
  });
