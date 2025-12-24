/**
 * Webhook configuration for agent status notifications
 */
export interface AgentWebhook {
  /**
   * URL to receive webhook notifications about agent status changes
   * @example "https://example.com/webhooks/cursor-agent"
   */
  url: string;
  /**
   * Secret key for webhook payload verification (minimum 32 characters)
   * @example "your-webhook-secret-key-minimum-32-characters"
   */
  secret?: string;
}
