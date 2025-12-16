import { AddFollowUpRequest } from '../entity/AddFollowUpRequest';
import { AddFollowUpResponse } from '../entity/AddFollowUpResponse';
import { CreateAgentRequest } from '../entity/CreateAgentRequest';
import { CreateAgentResponse } from '../entity/CreateAgentResponse';
import { CursorCloudAgentConversationResponse } from '../entity/CursorCloudAgentConversationResponse';
import { CursorCloudAgentListResponse } from '../entity/CursorCloudAgentListResponse';
import { DeleteAgentResponse } from '../entity/DeleteAgentResponse';
import { GetAgentResponse } from '../entity/GetAgentResponse';
import { ListModelsResponse } from '../entity/ListModelsResponse';
import { StopAgentResponse } from '../entity/StopAgentResponse';

/**
 * Repository interface for Cursor Cloud Agents API
 */
export interface CursorCloudAgentsRepository {
  /**
   * List all cloud agents for the authenticated user
   * @param limit - Number of cloud agents to return (1-100, default: 20)
   * @param cursor - Pagination cursor from the previous response
   */
  listAgents: (limit?: number, cursor?: string) => Promise<CursorCloudAgentListResponse>;

  /**
   * Retrieve the current status and results of a cloud agent
   * @param id - Unique identifier for the cloud agent
   */
  getAgent: (id: string) => Promise<GetAgentResponse>;

  /**
   * Retrieve the conversation history of a cloud agent
   * @param agentId - Unique identifier for the cloud agent
   */
  getAgentConversation: (agentId: string) => Promise<CursorCloudAgentConversationResponse>;

  /**
   * Start a new cloud agent to work on your repository
   * @param request - Configuration for the new agent
   */
  launchAgent: (request: CreateAgentRequest) => Promise<CreateAgentResponse>;

  /**
   * Add a followup instruction to an existing cloud agent
   * @param agentId - Unique identifier for the cloud agent
   * @param request - Followup instruction for the agent
   */
  addFollowUp: (agentId: string, request: AddFollowUpRequest) => Promise<AddFollowUpResponse>;

  /**
   * Stop a running cloud agent
   * @param agentId - Unique identifier for the cloud agent
   */
  stopAgent: (agentId: string) => Promise<StopAgentResponse>;

  /**
   * Delete a cloud agent permanently
   * @param agentId - Unique identifier for the cloud agent
   */
  deleteAgent: (agentId: string) => Promise<DeleteAgentResponse>;

  /**
   * Retrieve a list of recommended models for cloud agents
   */
  listModels: () => Promise<ListModelsResponse>;
}
