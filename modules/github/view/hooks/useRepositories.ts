import { useApiKey } from '@/modules/apiKeyManagement/context/ApiKeyContext';
import { useQuery } from '@tanstack/react-query';
import { GitHubRepositoryImpl } from '../../data/repository/GitHubRepositoryImpl';
import { GitHubService } from '../../data/source/GitHubService';

export const useRepositories = () => {
  const { githubPat } = useApiKey();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['github-repositories', githubPat],
    queryFn: async () => {
      if (!githubPat) return [];
      const service = new GitHubService(githubPat);
      const repository = new GitHubRepositoryImpl(service);
      return repository.listRepositories(100);
    },
    enabled: !!githubPat,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    repositories: data || [],
    isLoading,
    error,
    refetch,
  };
};

