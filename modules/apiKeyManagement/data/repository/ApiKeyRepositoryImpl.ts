import { ApiKeys } from '../entity/ApiKeys';
import { SecureStorageService } from '../source/SecureStorageService';
import { ApiKeyRepository } from './ApiKeyRepository';

/**
 * Implementation of ApiKeyRepository using SecureStorageService
 */
export class ApiKeyRepositoryImpl implements ApiKeyRepository {
  constructor(private readonly storage: SecureStorageService) {}

  /**
   * Get all stored API keys
   */
  async getApiKeys(): Promise<ApiKeys> {
    const [cursorApiKey, githubPat] = await Promise.all([
      this.storage.getCursorApiKey(),
      this.storage.getGithubPat(),
    ]);
    return { cursorApiKey, githubPat };
  }

  /**
   * Set Cursor API key
   */
  async setCursorApiKey(key: string): Promise<void> {
    await this.storage.setCursorApiKey(key);
  }

  /**
   * Set GitHub Personal Access Token
   */
  async setGithubPat(token: string): Promise<void> {
    await this.storage.setGithubPat(token);
  }

  /**
   * Delete Cursor API key
   */
  async deleteCursorApiKey(): Promise<void> {
    await this.storage.deleteCursorApiKey();
  }

  /**
   * Delete GitHub Personal Access Token
   */
  async deleteGithubPat(): Promise<void> {
    await this.storage.deleteGithubPat();
  }
}

