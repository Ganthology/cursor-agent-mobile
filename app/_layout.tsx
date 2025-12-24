import { AppProviders } from '@/modules/app/providers/AppProviders';
import { useTheme } from '@/modules/theme';
import { Stack } from 'expo-router';

function RootNavigator() {
  const { themeMode } = useTheme();

  return (
    <Stack
      key={themeMode}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="agent/[id]"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
