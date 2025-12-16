import { CursorCloudAgent } from './CursorCloudAgent';

export interface CursorCloudAgentListResponse {
  agents: CursorCloudAgent[];
  /**
   * Pagination cursor from the previous response
   */
  nextCursor: string;
}
