import { Prompt } from './Prompt';
import { AgentSource } from './AgentSource';
import { AgentWebhook } from './AgentWebhook';

/**
 * Request body for creating a new cloud agent
 * https://cursor.com/docs/cloud-agent/api/endpoints#launch-an-agent
 */
export interface CreateAgentRequest {
  /**
   * The task or instructions for the agent to execute
   */
  prompt: Prompt;
  /**
   * The LLM to use
   * @example "claude-4-sonnet"
   */
  model?: string;
  /**
   * Source repository configuration
   */
  source: AgentSource;
  /**
   * Target configuration for the agent output
   */
  target?: {
    /**
     * Whether to automatically create a pull request when the agent completes
     * @default false
     */
    autoCreatePr?: boolean;
    /**
     * Whether to open the pull request as the Cursor GitHub App instead of as the user
     * Only applies if autoCreatePr is true
     * @default false
     */
    openAsCursorGithubApp?: boolean;
    /**
     * Whether to skip adding the user as a reviewer to the pull request
     * Only applies if autoCreatePr is true and the PR is opened as the Cursor GitHub App
     * @default false
     */
    skipReviewerRequest?: boolean;
    /**
     * Custom branch name for the agent to create
     * @example "feature/add-readme"
     */
    branchName?: string;
  };
  /**
   * Webhook configuration for status notifications
   */
  webhook?: AgentWebhook;
}

