import { AgentSource } from './AgentSource';
import { AgentTarget } from './AgentTarget';

/**
 * Cloud Agent entity
 * https://cursor.com/docs/cloud-agent/api/endpoints#list-agents
 * @example
 * {
 *   "id": "bc_abc123",
 *   "name": "Add README Documentation",
 *   "status": "FINISHED",
 *   "source": {
 *     "repository": "https://github.com/your-org/your-repo",
 *     "ref": "main"
 *   },
 *   "target": {
 *     "branchName": "cursor/add-readme-1234",
 *     "url": "https://cursor.com/agents?id=bc_abc123",
 *     "prUrl": "https://github.com/your-org/your-repo/pull/1234",
 *     "autoCreatePr": false,
 *     "openAsCursorGithubApp": false,
 *     "skipReviewerRequest": false
 *   },
 *   "summary": "Added README.md with installation instructions and usage examples",
 *   "createdAt": "2024-01-15T10:30:00Z"
 * }
 */
export interface CursorCloudAgent {
  /**
   * Unique identifier for the cloud agent
   */
  id: string;
  /**
   * Name for the agent
   */
  name: string;
  /**
   * Current status of the cloud agent
   */
  status: 'RUNNING' | 'FINISHED' | 'ERROR' | 'CREATING' | 'EXPIRED';
  /**
   * Source repository configuration
   */
  source: AgentSource;
  /**
   * Target configuration and URLs
   */
  target: AgentTarget;
  /**
   * Summary of the agent's work
   */
  summary?: string;
  /**
   * When the agent was created
   */
  createdAt: string;
}
