/**
 * Request payload for creating a new GitHub repository
 */
export interface CreateRepositoryRequest {
  /**
   * Repository name
   */
  name: string;

  /**
   * Repository description
   */
  description?: string;

  /**
   * Whether the repository should be private
   */
  private?: boolean;

  /**
   * Whether to initialize with a README
   */
  autoInit?: boolean;

  /**
   * License template to use (e.g., "mit", "apache-2.0")
   */
  licenseTemplate?: string;

  /**
   * Gitignore template to use (e.g., "Node", "Python")
   */
  gitignoreTemplate?: string;
}


