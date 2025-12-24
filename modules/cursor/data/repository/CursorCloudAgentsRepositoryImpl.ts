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
import { CursorCloudAgentsService } from '../source/CursorCloudAgentsService';
import { CursorCloudAgentsRepository } from './CursorCloudAgentsRepository';

/**
 * Implementation of CursorCloudAgentsRepository
 * Delegates all operations to CursorCloudAgentsService
 */
export class CursorCloudAgentsRepositoryImpl implements CursorCloudAgentsRepository {
  private readonly service: CursorCloudAgentsService;

  /**
   * Creates a new instance of the repository
   * @param apiKey - The Cursor API key for authentication
   */
  constructor(private readonly apiKey: string) {
    this.service = new CursorCloudAgentsService(this.apiKey);
  }

  /**
   * List all cloud agents for the authenticated user
   * @param limit - Number of cloud agents to return (1-100, default: 20)
   * @param cursor - Pagination cursor from the previous response
   */
  async listAgents(limit?: number, cursor?: string): Promise<CursorCloudAgentListResponse> {
    return this.service.listAgents(limit, cursor);
  }

  /**
   * Retrieve the current status and results of a cloud agent
   * @param id - Unique identifier for the cloud agent
   */
  async getAgent(id: string): Promise<GetAgentResponse> {
    return this.service.getAgent(id);
  }

  /**
   * Retrieve the conversation history of a cloud agent
   * @param agentId - Unique identifier for the cloud agent
   */
  async getAgentConversation(agentId: string): Promise<CursorCloudAgentConversationResponse> {
    return this.service.getAgentConversation(agentId);
  }

  /**
   * Start a new cloud agent to work on your repository
   * @param request - Configuration for the new agent
   */
  async launchAgent(request: CreateAgentRequest): Promise<CreateAgentResponse> {
    return this.service.launchAgent(request);
  }

  /**
   * Add a followup instruction to an existing cloud agent
   * @param agentId - Unique identifier for the cloud agent
   * @param request - Followup instruction for the agent
   */
  async addFollowUp(agentId: string, request: AddFollowUpRequest): Promise<AddFollowUpResponse> {
    return this.service.addFollowUp(agentId, request);
  }

  /**
   * Stop a running cloud agent
   * @param agentId - Unique identifier for the cloud agent
   */
  async stopAgent(agentId: string): Promise<StopAgentResponse> {
    return this.service.stopAgent(agentId);
  }

  /**
   * Delete a cloud agent permanently
   * @param agentId - Unique identifier for the cloud agent
   */
  async deleteAgent(agentId: string): Promise<DeleteAgentResponse> {
    return this.service.deleteAgent(agentId);
  }

  /**
   * Retrieve a list of recommended models for cloud agents
   */
  async listModels(): Promise<ListModelsResponse> {
    return this.service.listModels();
  }
}
