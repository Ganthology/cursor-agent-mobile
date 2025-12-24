/**
 * Spacing scale (in pixels)
 */
export const spacing = {
  /** 0px */
  none: 0,
  /** 2px */
  '2xs': 2,
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  lg: 16,
  /** 20px */
  xl: 20,
  /** 24px */
  '2xl': 24,
  /** 32px */
  '3xl': 32,
  /** 40px */
  '4xl': 40,
  /** 48px */
  '5xl': 48,
} as const;

/**
 * Border radius scale
 */
export const borderRadius = {
  /** 0px */
  none: 0,
  /** 4px */
  sm: 4,
  /** 6px */
  md: 6,
  /** 8px */
  lg: 8,
  /** 12px */
  xl: 12,
  /** 16px */
  '2xl': 16,
  /** 9999px - full round */
  full: 9999,
} as const;

/**
 * Border widths
 */
export const borderWidth = {
  none: 0,
  thin: 1,
  medium: 2,
  thick: 3,
} as const;

/**
 * Icon sizes
 */
export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
} as const;

