import { ColorPalette, darkColors, lightColors } from '../entity/Colors';
import { ThemeMode, ThemeStorageService } from '../source/ThemeStorageService';
import { ThemeRepository } from './ThemeRepository';

/**
 * Implementation of ThemeRepository
 */
export class ThemeRepositoryImpl implements ThemeRepository {
  private storageService: ThemeStorageService;

  constructor() {
    this.storageService = new ThemeStorageService();
  }

  async getThemeMode(): Promise<ThemeMode | null> {
    return this.storageService.getThemeMode();
  }

  async setThemeMode(mode: ThemeMode): Promise<void> {
    return this.storageService.setThemeMode(mode);
  }

  getColors(mode: ThemeMode): ColorPalette {
    return mode === 'dark' ? darkColors : lightColors;
  }

  async clearThemeMode(): Promise<void> {
    return this.storageService.clearThemeMode();
  }
}

