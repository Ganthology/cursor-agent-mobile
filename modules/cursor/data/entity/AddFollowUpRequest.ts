import { Prompt } from './Prompt';

/**
 * Request body for adding a followup instruction to an agent
 * https://cursor.com/docs/cloud-agent/api/endpoints#add-followup
 */
export interface AddFollowUpRequest {
  /**
   * The followup instruction for the agent
   */
  prompt: Prompt;
}
