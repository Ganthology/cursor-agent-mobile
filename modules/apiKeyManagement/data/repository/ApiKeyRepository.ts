import { ApiKeys } from '../entity/ApiKeys';

/**
 * Repository interface for managing API keys
 */
export interface ApiKeyRepository {
  /**
   * Get all stored API keys
   */
  getApiKeys(): Promise<ApiKeys>;

  /**
   * Set Cursor API key
   */
  setCursorApiKey(key: string): Promise<void>;

  /**
   * Set GitHub Personal Access Token
   */
  setGithubPat(token: string): Promise<void>;

  /**
   * Delete Cursor API key
   */
  deleteCursorApiKey(): Promise<void>;

  /**
   * Delete GitHub Personal Access Token
   */
  deleteGithubPat(): Promise<void>;
}
