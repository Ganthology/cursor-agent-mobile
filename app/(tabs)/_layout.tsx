import { useTheme } from '@/modules/theme';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// iOS 26+ has native glass view support
const isIOS26OrNewer = Platform.OS === 'ios' && Number(Platform.Version) >= 26;

interface TabItem {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFilled: keyof typeof Ionicons.glyphMap;
}

const tabs: TabItem[] = [
  {
    name: 'index',
    label: 'Compose',
    icon: 'add-circle-outline',
    iconFilled: 'add-circle',
  },
  {
    name: 'history',
    label: 'History',
    icon: 'time-outline',
    iconFilled: 'time',
  },
  {
    name: 'settings',
    label: 'Setup',
    icon: 'settings-outline',
    iconFilled: 'settings',
  },
];

function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: Math.max(insets.bottom, 16),
      left: 16,
      right: 16,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 28,
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor: colors.border,
      // Shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      borderRadius: 20,
    },
    tabItemActive: {
      backgroundColor: colors.accentMuted,
    },
    tabLabel: {
      fontSize: 11,
      fontWeight: '500',
      marginTop: 4,
    },
    tabLabelActive: {
      color: colors.accent,
    },
    tabLabelInactive: {
      color: colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const tabConfig = tabs.find((t) => t.name === route.name);
          const label = tabConfig?.label || options.title || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const iconName = isFocused
            ? tabConfig?.iconFilled || 'ellipse'
            : tabConfig?.icon || 'ellipse-outline';

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tabItem, isFocused && styles.tabItemActive]}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={isFocused ? colors.accent : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function NativeTabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: 'plus.circle', selected: 'plus.circle.fill' }} />
        <Label>Compose</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="history">
        <Icon sf={{ default: 'clock', selected: 'clock.fill' }} />
        <Label>History</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} />
        <Label>Setup</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function FloatingTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Compose' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="settings" options={{ title: 'Setup' }} />
    </Tabs>
  );
}

export default function TabsLayout() {
  // Use native tabs with glass view on iOS 26+, floating pill tabs elsewhere
  if (isIOS26OrNewer) {
    return <NativeTabsLayout />;
  }
  return <FloatingTabsLayout />;
}
