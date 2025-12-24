import { useApiKey } from '@/modules/apiKeyManagement/context/ApiKeyContext';
import { useQuery } from '@tanstack/react-query';
import { CursorCloudAgentsRepositoryImpl } from '../../data/repository/CursorCloudAgentsRepositoryImpl';

export const useModels = () => {
  const { cursorApiKey } = useApiKey();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['models', cursorApiKey],
    queryFn: async () => {
      if (!cursorApiKey) return { models: [] };
      const repository = new CursorCloudAgentsRepositoryImpl(cursorApiKey);
      return repository.listModels();
    },
    enabled: !!cursorApiKey,
    staleTime: Infinity, // Cache for entire session
  });

  return {
    models: data?.models || [],
    isLoading,
    error,
    refetch,
  };
};
