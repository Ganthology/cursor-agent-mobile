/**
 * Response from deleting a cloud agent
 * DELETE /v0/agents/{id}
 * https://cursor.com/docs/cloud-agent/api/endpoints#delete-an-agent
 */
export interface DeleteAgentResponse {
  /**
   * Unique identifier for the deleted cloud agent
   */
  id: string;
}

