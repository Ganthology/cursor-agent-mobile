/**
 * GitHub branch information
 */
export interface GitHubBranch {
  /**
   * Branch name
   */
  name: string;

  /**
   * Whether the branch is protected
   */
  protected: boolean;

  /**
   * Latest commit SHA on this branch
   */
  commitSha: string;
}


