import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = 'app_theme_mode';

export type ThemeMode = 'light' | 'dark';

/**
 * Service for persisting theme preference to storage
 */
export class ThemeStorageService {
  async getThemeMode(): Promise<ThemeMode | null> {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      return null;
    } catch (error) {
      console.error('Failed to load theme preference:', error);
      return null;
    }
  }

  async setThemeMode(mode: ThemeMode): Promise<void> {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
      throw error;
    }
  }

  async clearThemeMode(): Promise<void> {
    try {
      await AsyncStorage.removeItem(THEME_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear theme preference:', error);
      throw error;
    }
  }
}

