import * as SystemUI from 'expo-system-ui';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ColorPalette, darkColors, lightColors } from '../data/entity/Colors';
import { ThemeRepositoryImpl } from '../data/repository/ThemeRepositoryImpl';
import { ThemeMode } from '../data/source/ThemeStorageService';

interface ThemeContextValue {
  isDark: boolean;
  themeMode: ThemeMode;
  colors: ColorPalette;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [isLoaded, setIsLoaded] = useState(false);
  const [repository] = useState(() => new ThemeRepositoryImpl());

  // Update system UI background color when theme changes
  useEffect(() => {
    const colors = themeMode === 'dark' ? darkColors : lightColors;
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [themeMode]);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await repository.getThemeMode();
      if (savedTheme) {
        setThemeMode(savedTheme);
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveThemePreference = async (mode: ThemeMode) => {
    try {
      await repository.setThemeMode(mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
    saveThemePreference(newMode);
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    saveThemePreference(mode);
  };

  const value: ThemeContextValue = {
    isDark: themeMode === 'dark',
    themeMode,
    colors: themeMode === 'dark' ? darkColors : lightColors,
    toggleTheme,
    setTheme,
  };

  if (!isLoaded) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
