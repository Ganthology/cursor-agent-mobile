/**
 * Color palette type definition
 */
export interface ColorPalette {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderFocused: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentMuted: string;
  inputBg: string;
  status: {
    running: string;
    finished: string;
    error: string;
    creating: string;
    expired: string;
  };
}

/**
 * Dark theme colors - Cursor web inspired
 */
export const darkColors: ColorPalette = {
  background: '#0d0d0d',
  surface: '#1a1a1a',
  surfaceElevated: '#242424',
  border: '#2d2d2d',
  borderFocused: '#404040',
  textPrimary: '#e0e0e0',
  textSecondary: '#858585',
  textMuted: '#5a5a5a',
  accent: '#007acc',
  accentMuted: 'rgba(0, 122, 204, 0.15)',
  inputBg: '#1a1a1a',
  status: {
    running: '#4ec9b0',
    finished: '#6a9955',
    error: '#f48771',
    creating: '#dcdcaa',
    expired: '#858585',
  },
};

/**
 * Light theme colors
 */
export const lightColors: ColorPalette = {
  background: '#ffffff',
  surface: '#f8f8f8',
  surfaceElevated: '#ffffff',
  border: '#e0e0e0',
  borderFocused: '#c0c0c0',
  textPrimary: '#1a1a1a',
  textSecondary: '#666666',
  textMuted: '#999999',
  accent: '#0066cc',
  accentMuted: 'rgba(0, 102, 204, 0.1)',
  inputBg: '#ffffff',
  status: {
    running: '#2d9687',
    finished: '#4a7c3b',
    error: '#d63826',
    creating: '#b89a1f',
    expired: '#808080',
  },
};
