/**
 * Source repository configuration for an agent
 */
export interface AgentSource {
  /**
   * The GitHub repository URL
   * @example "https://github.com/your-org/your-repo"
   */
  repository: string;
  /**
   * Git ref (branch/tag) to use as the base branch
   * @example "main"
   */
  ref?: string;
}
