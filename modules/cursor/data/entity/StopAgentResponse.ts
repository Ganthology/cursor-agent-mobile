/**
 * Response from stopping a running cloud agent
 * POST /v0/agents/{id}/stop
 * https://cursor.com/docs/cloud-agent/api/endpoints#stop-an-agent
 */
export interface StopAgentResponse {
  /**
   * Unique identifier for the stopped cloud agent
   */
  id: string;
}

