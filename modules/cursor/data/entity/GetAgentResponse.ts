import { CursorCloudAgent } from './CursorCloudAgent';

/**
 * Response from getting agent details
 * GET /v0/agents/{id}
 * https://cursor.com/docs/cloud-agent/api/endpoints#agent-status
 */
export type GetAgentResponse = CursorCloudAgent;

