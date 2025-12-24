/**
 * Target configuration for agent output
 */
export interface AgentTarget {
  /**
   * The Git branch name where the agent is working
   * @example "cursor/add-readme-1234"
   */
  branchName?: string;
  /**
   * URL to view the agent in Cursor Web
   * @example "https://cursor.com/agents?id=bc_abc123"
   */
  url: string;
  /**
   * URL to view the pull request in GitHub, if any
   * @example "https://github.com/your-org/your-repo/pull/1234"
   */
  prUrl?: string;
  /**
   * Whether a pull request will be automatically created
   */
  autoCreatePr?: boolean;
  /**
   * Whether the pull request will be opened as the Cursor GitHub App
   */
  openAsCursorGithubApp?: boolean;
  /**
   * Whether to skip adding the user as a reviewer to the pull request
   */
  skipReviewerRequest?: boolean;
}
