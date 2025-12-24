import { ColorPalette } from '../entity/Colors';
import { ThemeMode } from '../source/ThemeStorageService';

/**
 * Repository interface for theme management
 */
export interface ThemeRepository {
  /**
   * Get the current theme mode
   */
  getThemeMode(): Promise<ThemeMode | null>;

  /**
   * Set the theme mode
   */
  setThemeMode(mode: ThemeMode): Promise<void>;

  /**
   * Get colors for the given theme mode
   */
  getColors(mode: ThemeMode): ColorPalette;

  /**
   * Clear theme preference (reset to default)
   */
  clearThemeMode(): Promise<void>;
}

