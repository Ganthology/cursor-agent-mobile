import { Platform, TextStyle } from 'react-native';

/**
 * Typography scale definitions
 */
export const typography = {
  /**
   * Font families
   * - sans: Clean display font for headings and UI
   * - mono: Monospace for code, IDs, technical info
   */
  fontFamily: {
    // System sans-serif - clean and readable
    sans: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: undefined,
    }),
    // Monospace for code/technical content
    mono: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'Courier',
    }),
  },

  /**
   * Font sizes
   */
  fontSize: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
  },

  /**
   * Font weights
   */
  fontWeight: {
    normal: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },

  /**
   * Line heights
   */
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

/**
 * Pre-built text styles
 * - Display styles use sans font for clean UI
 * - Code styles use mono font for technical content
 */
export const textStyles = {
  // Display styles (sans font)
  heading1: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
  } as TextStyle,

  heading2: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
  } as TextStyle,

  heading3: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  } as TextStyle,

  body: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
  } as TextStyle,

  bodySmall: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
  } as TextStyle,

  caption: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
  } as TextStyle,

  label: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  } as TextStyle,

  button: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  } as TextStyle,

  // Monospace styles (for code, IDs, technical info)
  mono: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
  } as TextStyle,

  monoSmall: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
  } as TextStyle,

  monoCaption: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
  } as TextStyle,
} as const;

