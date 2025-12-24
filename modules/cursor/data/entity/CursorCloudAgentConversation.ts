/**
 * A single message in an agent conversation
 */
export interface CursorCloudAgentConversation {
  /**
   * Unique identifier for the message
   */
  id: string;
  /**
   * Type of message - either from the user or the model
   */
  type: 'user_message' | 'assistant_message';
  /**
   * The content of the message
   */
  text: string;
}
