import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ApiKeyRepositoryImpl } from '../data/repository/ApiKeyRepositoryImpl';
import { SecureStorageService } from '../data/source/SecureStorageService';

interface ApiKeyContextType {
  cursorApiKey: string | null;
  githubPat: string | null;
  setCursorApiKey: (key: string) => Promise<void>;
  setGithubPat: (token: string) => Promise<void>;
  deleteCursorApiKey: () => Promise<void>;
  deleteGithubPat: () => Promise<void>;
  keysLoaded: boolean;
}

export const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [repository] = useState(() => new ApiKeyRepositoryImpl(new SecureStorageService()));

  const [cursorApiKey, setCursorApiKeyState] = useState<string | null>(null);
  const [githubPat, setGithubPatState] = useState<string | null>(null);
  const [keysLoaded, setKeysLoaded] = useState(false);

  // Load keys on mount
  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    const keys = await repository.getApiKeys();
    setCursorApiKeyState(keys.cursorApiKey);
    setGithubPatState(keys.githubPat);
    setKeysLoaded(true);
  };

  const setCursorApiKey = async (key: string) => {
    await repository.setCursorApiKey(key);
    setCursorApiKeyState(key);
  };

  const setGithubPat = async (token: string) => {
    await repository.setGithubPat(token);
    setGithubPatState(token);
  };

  const deleteCursorApiKey = async () => {
    await repository.deleteCursorApiKey();
    setCursorApiKeyState(null);
  };

  const deleteGithubPat = async () => {
    await repository.deleteGithubPat();
    setGithubPatState(null);
  };

  return (
    <ApiKeyContext.Provider
      value={{
        cursorApiKey,
        githubPat,
        setCursorApiKey,
        setGithubPat,
        deleteCursorApiKey,
        deleteGithubPat,
        keysLoaded,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within ApiKeyProvider');
  }
  return context;
}

