import { GitHubOwner } from './GitHubOwner';

/**
 * GitHub repository information
 */
export interface GitHubRepo {
  /**
   * Unique identifier for the repository
   */
  id: number;

  /**
   * Repository name
   */
  name: string;

  /**
   * Full name including owner (e.g., "owner/repo")
   */
  fullName: string;

  /**
   * Repository description
   */
  description: string | null;

  /**
   * Whether the repository is private
   */
  private: boolean;

  /**
   * URL to the repository on GitHub
   */
  htmlUrl: string;

  /**
   * Git clone URL (HTTPS)
   */
  cloneUrl: string;

  /**
   * SSH URL for cloning
   */
  sshUrl: string;

  /**
   * Default branch name
   */
  defaultBranch: string;

  /**
   * Repository owner information
   */
  owner: GitHubOwner;

  /**
   * When the repository was created
   */
  createdAt: string;

  /**
   * When the repository was last updated
   */
  updatedAt: string;
}


