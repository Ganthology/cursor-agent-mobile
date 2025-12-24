import { ApiKeyContext, useApiKey } from '@/modules/apiKeyManagement/context/ApiKeyContext';
import { ThemeContext, useTheme } from '@/modules/theme';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

interface ModalOptions {
  snapPoints?: string[];
}

interface ModalContextType {
  showModal: (content: ReactNode, options?: ModalOptions) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface GlobalModalProviderProps {
  children: ReactNode;
}

// Captured context values to be provided inside the portal
interface CapturedContexts {
  apiKey: ReturnType<typeof useApiKey>;
  theme: ReturnType<typeof useTheme>;
  queryClient: QueryClient;
}

/**
 * ContextBridge component that re-provides captured contexts inside the portal.
 * BottomSheetModal uses a portal which breaks React context, so we need to
 * capture context values and re-provide them inside the modal.
 */
function ContextBridge({
  children,
  contexts,
}: {
  children: ReactNode;
  contexts: CapturedContexts;
}) {
  return (
    <QueryClientProvider client={contexts.queryClient}>
      <ThemeContext.Provider value={contexts.theme}>
        <ApiKeyContext.Provider value={contexts.apiKey}>{children}</ApiKeyContext.Provider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
}

export function GlobalModalProvider({ children }: GlobalModalProviderProps) {
  const themeContext = useTheme();
  const apiKeyContext = useApiKey();
  const queryClient = useQueryClient();

  const { colors } = themeContext;
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [snapPoints, setSnapPoints] = useState<string[]>(['50%']);

  // Capture current context values to pass to the portal
  const capturedContexts = useMemo<CapturedContexts>(
    () => ({
      apiKey: apiKeyContext,
      theme: themeContext,
      queryClient,
    }),
    [apiKeyContext, themeContext, queryClient]
  );

  const showModal = useCallback((content: ReactNode, options?: ModalOptions) => {
    setModalContent(content);
    setSnapPoints(options?.snapPoints ?? ['50%']);
    // Use setTimeout to ensure state is updated before presenting
    setTimeout(() => {
      bottomSheetModalRef.current?.present();
    }, 0);
  }, []);

  const hideModal = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    setModalContent(null);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  const handleDismiss = useCallback(() => {
    setModalContent(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      showModal,
      hideModal,
    }),
    [showModal, hideModal]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
        onDismiss={handleDismiss}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetView style={{ flex: 1 }}>
          <ContextBridge contexts={capturedContexts}>{modalContent}</ContextBridge>
        </BottomSheetView>
      </BottomSheetModal>
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within GlobalModalProvider');
  }
  return context;
}

