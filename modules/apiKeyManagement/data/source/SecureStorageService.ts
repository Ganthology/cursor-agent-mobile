import * as SecureStore from 'expo-secure-store';

/**
 * Service for securely storing and retrieving API keys
 * Uses Expo SecureStore for encrypted storage on device
 */
export class SecureStorageService {
  private readonly CURSOR_API_KEY = 'cursor_api_key';
  private readonly GITHUB_PAT = 'github_pat';

  /**
   * Get Cursor API key from secure storage
   */
  async getCursorApiKey(): Promise<string | null> {
    return await SecureStore.getItemAsync(this.CURSOR_API_KEY);
  }

  /**
   * Save Cursor API key to secure storage
   */
  async setCursorApiKey(key: string): Promise<void> {
    await SecureStore.setItemAsync(this.CURSOR_API_KEY, key);
  }

  /**
   * Delete Cursor API key from secure storage
   */
  async deleteCursorApiKey(): Promise<void> {
    await SecureStore.deleteItemAsync(this.CURSOR_API_KEY);
  }

  /**
   * Get GitHub Personal Access Token from secure storage
   */
  async getGithubPat(): Promise<string | null> {
    return await SecureStore.getItemAsync(this.GITHUB_PAT);
  }

  /**
   * Save GitHub Personal Access Token to secure storage
   */
  async setGithubPat(token: string): Promise<void> {
    await SecureStore.setItemAsync(this.GITHUB_PAT, token);
  }

  /**
   * Delete GitHub Personal Access Token from secure storage
   */
  async deleteGithubPat(): Promise<void> {
    await SecureStore.deleteItemAsync(this.GITHUB_PAT);
  }
}

