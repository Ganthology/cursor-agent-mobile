import { ApiKeyProvider } from '@/modules/apiKeyManagement/context/ApiKeyContext';
import { GlobalModalProvider } from '@/modules/modal/context/GlobalModalContext';
import { QueryProvider } from '@/modules/query/QueryProvider';
import { ThemeProvider } from '@/modules/theme';
import { ToastProvider } from '@/modules/toast/ToastContext';
import { Toaster } from '@/modules/toast/Toaster';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <KeyboardProvider>
          <QueryProvider>
            <ThemeProvider>
              <ToastProvider>
                <ApiKeyProvider>
                  <GlobalModalProvider>
                    {children}
                    <Toaster />
                  </GlobalModalProvider>
                </ApiKeyProvider>
              </ToastProvider>
            </ThemeProvider>
          </QueryProvider>
        </KeyboardProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

