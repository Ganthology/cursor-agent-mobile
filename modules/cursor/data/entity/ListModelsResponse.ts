import { CursorCloudModel } from './CursorCloudModel';

/**
 * Response from listing available models
 * GET /v0/models
 * https://cursor.com/docs/cloud-agent/api/endpoints#list-available-models
 * @example
 * {
 *   "models": [
 *     "claude-4-sonnet-thinking",
 *     "o3",
 *     "claude-4-opus-thinking"
 *   ]
 * }
 */
export interface ListModelsResponse {
  /**
   * Array of available model names
   */
  models: CursorCloudModel[];
}

