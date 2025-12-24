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
 * Service class for interacting with Cursor Cloud Agents API
 * https://cursor.com/docs/cloud-agent/api
 */
export class CursorCloudAgentsService {
  private readonly API_BASE_URL = 'https://api.cursor.com';

  private readonly API_ROUTES = {
    AGENTS: '/v0/agents',
    AGENT: (id: string) => `/v0/agents/${id}`,
    AGENT_CONVERSATION: (id: string) => `/v0/agents/${id}/conversation`,
    AGENT_FOLLOWUP: (id: string) => `/v0/agents/${id}/followup`,
    AGENT_STOP: (id: string) => `/v0/agents/${id}/stop`,
    MODELS: '/v0/models',
    ME: '/v0/me',
  } as const;

  /**
   * Creates a new instance of the Cursor Cloud Agents Service
   * @param apiKey - The Cursor API key for authentication
   */
  constructor(private readonly apiKey: string) {}

  /**
   * Get authorization headers for API requests
   */
  private getAuthHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(path: string, params?: Record<string, string | number>): string {
    const url = new URL(path, this.API_BASE_URL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Generic request handler with type safety
   */
  private async request<T>(method: string, url: string, body?: unknown): Promise<T> {
    const response = await fetch(url, {
      method,
      headers: this.getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: { message: response.statusText },
      }));
      throw new Error(error.error?.message || 'Request failed');
    }

    return response.json();
  }

  /**
   * List all cloud agents for the authenticated user
   * GET /v0/agents
   */
  async listAgents(limit?: number, cursor?: string): Promise<CursorCloudAgentListResponse> {
    const params: Record<string, string | number> = {};

    if (limit !== undefined) {
      params.limit = limit;
    }
    if (cursor !== undefined) {
      params.cursor = cursor;
    }

    const url = this.buildUrl(this.API_ROUTES.AGENTS, params);
    return this.request<CursorCloudAgentListResponse>('GET', url);
  }

  /**
   * Retrieve the current status and results of a cloud agent
   * GET /v0/agents/{id}
   */
  async getAgent(id: string): Promise<GetAgentResponse> {
    const url = this.buildUrl(this.API_ROUTES.AGENT(id));
    return this.request<GetAgentResponse>('GET', url);
  }

  /**
   * Retrieve the conversation history of a cloud agent
   * GET /v0/agents/{id}/conversation
   */
  async getAgentConversation(agentId: string): Promise<CursorCloudAgentConversationResponse> {
    const url = this.buildUrl(this.API_ROUTES.AGENT_CONVERSATION(agentId));
    return this.request<CursorCloudAgentConversationResponse>('GET', url);
  }

  /**
   * Start a new cloud agent to work on your repository
   * POST /v0/agents
   */
  async launchAgent(request: CreateAgentRequest): Promise<CreateAgentResponse> {
    const url = this.buildUrl(this.API_ROUTES.AGENTS);
    return this.request<CreateAgentResponse>('POST', url, request);
  }

  /**
   * Add a followup instruction to an existing cloud agent
   * POST /v0/agents/{id}/followup
   */
  async addFollowUp(agentId: string, request: AddFollowUpRequest): Promise<AddFollowUpResponse> {
    const url = this.buildUrl(this.API_ROUTES.AGENT_FOLLOWUP(agentId));
    return this.request<AddFollowUpResponse>('POST', url, request);
  }

  /**
   * Stop a running cloud agent
   * POST /v0/agents/{id}/stop
   */
  async stopAgent(agentId: string): Promise<StopAgentResponse> {
    const url = this.buildUrl(this.API_ROUTES.AGENT_STOP(agentId));
    return this.request<StopAgentResponse>('POST', url);
  }

  /**
   * Delete a cloud agent permanently
   * DELETE /v0/agents/{id}
   */
  async deleteAgent(agentId: string): Promise<DeleteAgentResponse> {
    const url = this.buildUrl(this.API_ROUTES.AGENT(agentId));
    return this.request<DeleteAgentResponse>('DELETE', url);
  }

  /**
   * Retrieve a list of recommended models for cloud agents
   * GET /v0/models
   */
  async listModels(): Promise<ListModelsResponse> {
    const url = this.buildUrl(this.API_ROUTES.MODELS);
    return this.request<ListModelsResponse>('GET', url);
  }
}
