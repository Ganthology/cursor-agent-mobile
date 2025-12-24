import { CursorCloudAgent } from '../data/entity/CursorCloudAgent';

export type DateGroupKey = 'This Week' | 'Last Week' | 'Earlier' | 'Expired';

export interface AgentGroup {
  title: DateGroupKey;
  data: CursorCloudAgent[];
}

export function groupAgentsByDate(agents: CursorCloudAgent[]): AgentGroup[] {
  const groups: Record<DateGroupKey, CursorCloudAgent[]> = {
    'This Week': [],
    'Last Week': [],
    Earlier: [],
    Expired: [],
  };

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  agents.forEach((agent) => {
    if (agent.status === 'EXPIRED') {
      groups.Expired.push(agent);
      return;
    }

    const createdDate = new Date(agent.createdAt);

    if (createdDate >= sevenDaysAgo) {
      groups['This Week'].push(agent);
    } else if (createdDate >= fourteenDaysAgo) {
      groups['Last Week'].push(agent);
    } else {
      groups.Earlier.push(agent);
    }
  });

  // Convert to array and filter out empty groups
  // Order: This Week -> Last Week -> Earlier -> Expired
  const result: AgentGroup[] = [];

  if (groups['This Week'].length > 0) {
    result.push({ title: 'This Week', data: groups['This Week'] });
  }
  if (groups['Last Week'].length > 0) {
    result.push({ title: 'Last Week', data: groups['Last Week'] });
  }
  if (groups.Earlier.length > 0) {
    result.push({ title: 'Earlier', data: groups.Earlier });
  }
  if (groups.Expired.length > 0) {
    result.push({ title: 'Expired', data: groups.Expired });
  }

  return result;
}
