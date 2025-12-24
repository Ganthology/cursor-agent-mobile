import { CreateRepositoryRequest } from '../entity/CreateRepositoryRequest';
import { GitHubBranch } from '../entity/GitHubBranch';
import { GitHubRepo } from '../entity/GitHubRepo';
import { GitHubService } from '../source/GitHubService';
import { GitHubRepository } from './GitHubRepository';

/**
 * Implementation of GitHubRepository using GitHubService
 */
export class GitHubRepositoryImpl implements GitHubRepository {
  constructor(private readonly service: GitHubService) {}

  /**
   * List all repositories for the authenticated user
   */
  async listRepositories(perPage?: number, page?: number): Promise<GitHubRepo[]> {
    return this.service.listRepositories(perPage, page);
  }

  /**
   * List all branches for a repository
   */
  async listBranches(
    owner: string,
    repo: string,
    perPage?: number,
    page?: number
  ): Promise<GitHubBranch[]> {
    return this.service.listBranches(owner, repo, perPage, page);
  }

  /**
   * Create a new empty repository
   */
  async createRepository(request: CreateRepositoryRequest): Promise<GitHubRepo> {
    return this.service.createRepository(request);
  }
}


