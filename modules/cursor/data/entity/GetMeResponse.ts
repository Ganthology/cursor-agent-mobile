/**
 * Response from getting API key information
 * GET /v0/me
 * https://cursor.com/docs/cloud-agent/api/endpoints#api-key-info
 * @example
 * {
 *   "apiKeyName": "Production API Key",
 *   "createdAt": "2024-01-15T10:30:00Z",
 *   "userEmail": "developer@example.com"
 * }
 */
export interface GetMeResponse {
  /**
   * The name of the API key
   */
  apiKeyName: string;
  /**
   * When the API key was created
   */
  createdAt: string;
  /**
   * Email address of the user who owns the API key (if available)
   */
  userEmail?: string;
}

