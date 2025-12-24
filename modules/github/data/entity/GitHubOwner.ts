/**
 * GitHub repository owner information
 */
export interface GitHubOwner {
  /**
   * Unique identifier for the owner
   */
  id: number;

  /**
   * Username/login of the owner
   */
  login: string;

  /**
   * URL to the owner's avatar image
   */
  avatarUrl: string;

  /**
   * Type of owner (User or Organization)
   */
  type: 'User' | 'Organization';
}


