import { CreateRepositoryRequest } from '../entity/CreateRepositoryRequest';
import { GitHubBranch } from '../entity/GitHubBranch';
import { GitHubRepo } from '../entity/GitHubRepo';

/**
 * Repository interface for GitHub operations
 */
export interface GitHubRepository {
  /**
   * List all repositories for the authenticated user
   * @param perPage - Number of results per page (max 100)
   * @param page - Page number for pagination
   */
  listRepositories(perPage?: number, page?: number): Promise<GitHubRepo[]>;

  /**
   * List all branches for a repository
   * @param owner - Repository owner username
   * @param repo - Repository name
   * @param perPage - Number of results per page (max 100)
   * @param page - Page number for pagination
   */
  listBranches(
    owner: string,
    repo: string,
    perPage?: number,
    page?: number
  ): Promise<GitHubBranch[]>;

  /**
   * Create a new empty repository
   * @param request - Repository creation parameters
   */
  createRepository(request: CreateRepositoryRequest): Promise<GitHubRepo>;
}


