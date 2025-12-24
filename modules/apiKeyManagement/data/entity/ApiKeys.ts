/**
 * API Keys entity for storing Cursor API key and GitHub PAT
 */
export interface ApiKeys {
  /**
   * Cursor API key for accessing Cursor Cloud Agents API
   */
  cursorApiKey: string | null;
  /**
   * GitHub Personal Access Token
   */
  githubPat: string | null;
}

