import { CreateRepositoryRequest } from '../entity/CreateRepositoryRequest';
import { GitHubBranch } from '../entity/GitHubBranch';
import { GitHubRepo } from '../entity/GitHubRepo';

/**
 * Raw GitHub API response for repository
 */
interface GitHubApiRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  default_branch: string;
  owner: {
    id: number;
    login: string;
    avatar_url: string;
    type: 'User' | 'Organization';
  };
  created_at: string;
  updated_at: string;
}

/**
 * Raw GitHub API response for branch
 */
interface GitHubApiBranch {
  name: string;
  protected: boolean;
  commit: {
    sha: string;
  };
}

/**
 * Service class for interacting with GitHub REST API
 * https://docs.github.com/en/rest
 */
export class GitHubService {
  private readonly API_BASE_URL = 'https://api.github.com';

  private readonly API_ROUTES = {
    USER_REPOS: '/user/repos',
    REPO_BRANCHES: (owner: string, repo: string) => `/repos/${owner}/${repo}/branches`,
  } as const;

  /**
   * Creates a new instance of the GitHub Service
   * @param accessToken - GitHub Personal Access Token
   */
  constructor(private readonly accessToken: string) {}

  /**
   * Get authorization headers for API requests
   */
  private getAuthHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(path: string, params?: Record<string, string | number>): string {
    const url = new URL(path, this.API_BASE_URL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Generic request handler with type safety
   */
  private async request<T>(method: string, url: string, body?: unknown): Promise<T> {
    const response = await fetch(url, {
      method,
      headers: this.getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'GitHub API request failed');
    }

    return response.json();
  }

  /**
   * Map GitHub API repository response to domain entity
   */
  private mapRepoToDomain(apiRepo: GitHubApiRepo): GitHubRepo {
    return {
      id: apiRepo.id,
      name: apiRepo.name,
      fullName: apiRepo.full_name,
      description: apiRepo.description,
      private: apiRepo.private,
      htmlUrl: apiRepo.html_url,
      cloneUrl: apiRepo.clone_url,
      sshUrl: apiRepo.ssh_url,
      defaultBranch: apiRepo.default_branch,
      owner: {
        id: apiRepo.owner.id,
        login: apiRepo.owner.login,
        avatarUrl: apiRepo.owner.avatar_url,
        type: apiRepo.owner.type,
      },
      createdAt: apiRepo.created_at,
      updatedAt: apiRepo.updated_at,
    };
  }

  /**
   * Map GitHub API branch response to domain entity
   */
  private mapBranchToDomain(apiBranch: GitHubApiBranch): GitHubBranch {
    return {
      name: apiBranch.name,
      protected: apiBranch.protected,
      commitSha: apiBranch.commit.sha,
    };
  }

  /**
   * List all repositories for the authenticated user
   * GET /user/repos
   * @param perPage - Number of results per page (max 100)
   * @param page - Page number for pagination
   */
  async listRepositories(perPage: number = 30, page: number = 1): Promise<GitHubRepo[]> {
    const params: Record<string, string | number> = {
      per_page: perPage,
      page: page,
      sort: 'updated',
    };

    const url = this.buildUrl(this.API_ROUTES.USER_REPOS, params);
    const repos = await this.request<GitHubApiRepo[]>('GET', url);

    return repos.map((repo) => this.mapRepoToDomain(repo));
  }

  /**
   * List all branches for a repository
   * GET /repos/{owner}/{repo}/branches
   * @param owner - Repository owner username
   * @param repo - Repository name
   * @param perPage - Number of results per page (max 100)
   * @param page - Page number for pagination
   */
  async listBranches(
    owner: string,
    repo: string,
    perPage: number = 30,
    page: number = 1
  ): Promise<GitHubBranch[]> {
    const params: Record<string, string | number> = {
      per_page: perPage,
      page: page,
    };

    const url = this.buildUrl(this.API_ROUTES.REPO_BRANCHES(owner, repo), params);
    const branches = await this.request<GitHubApiBranch[]>('GET', url);

    return branches.map((branch) => this.mapBranchToDomain(branch));
  }

  /**
   * Create a new repository for the authenticated user
   * POST /user/repos
   * @param request - Repository creation parameters
   */
  async createRepository(request: CreateRepositoryRequest): Promise<GitHubRepo> {
    const url = this.buildUrl(this.API_ROUTES.USER_REPOS);

    const body = {
      name: request.name,
      description: request.description,
      private: request.private ?? false,
      auto_init: request.autoInit ?? false,
      license_template: request.licenseTemplate,
      gitignore_template: request.gitignoreTemplate,
    };

    const repo = await this.request<GitHubApiRepo>('POST', url, body);

    return this.mapRepoToDomain(repo);
  }
}


