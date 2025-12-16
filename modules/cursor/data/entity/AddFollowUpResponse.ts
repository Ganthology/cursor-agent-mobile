/**
 * Response from adding a followup instruction to an agent
 * POST /v0/agents/{id}/followup
 * https://cursor.com/docs/cloud-agent/api/endpoints#add-followup
 */
export interface AddFollowUpResponse {
  /**
   * Unique identifier for the cloud agent
   */
  id: string;
}

