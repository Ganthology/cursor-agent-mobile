import { CursorCloudAgent } from './CursorCloudAgent';

/**
 * Response from creating a new cloud agent
 * POST /v0/agents
 * https://cursor.com/docs/cloud-agent/api/endpoints#launch-an-agent
 */
export type CreateAgentResponse = CursorCloudAgent;

