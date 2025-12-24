import { useApiKey } from '@/modules/apiKeyManagement/context/ApiKeyContext';
import { useQuery } from '@tanstack/react-query';
import { GitHubRepositoryImpl } from '../../data/repository/GitHubRepositoryImpl';
import { GitHubService } from '../../data/source/GitHubService';

interface UseBranchesOptions {
  owner: string;
  repo: string;
  enabled?: boolean;
}

export const useBranches = ({ owner, repo, enabled = true }: UseBranchesOptions) => {
  const { githubPat } = useApiKey();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['github-branches', owner, repo, githubPat],
    queryFn: async () => {
      if (!githubPat || !owner || !repo) return [];
      const service = new GitHubService(githubPat);
      const repository = new GitHubRepositoryImpl(service);
      return repository.listBranches(owner, repo, 100);
    },
    enabled: !!githubPat && !!owner && !!repo && enabled,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    branches: data || [],
    isLoading,
    error,
    refetch,
  };
};

