import type { ViewStyle } from 'react-native';

export { colors, brand } from './colors';
export type { ColorToken } from './colors';
export { typography, fontFamily } from './typography';
export type { TypographyVariant } from './typography';

/** Grille de 4 pt. */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

/** Marge horizontale standard des écrans. */
export const screenPadding = spacing.xl;

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

/** Hauteurs de contrôles harmonisées (cible tactile ≥ 44 pt). */
export const sizes = {
  buttonLg: 54,
  buttonMd: 46,
  buttonSm: 36,
  input: 48,
  iconButton: 44,
  icon: 22,
  iconSm: 18,
  tabBar: 64,
} as const;

/** Ombres discrètes, teintées bleu nuit. */
export const shadows = {
  card: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  raised: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  coralGlow: {
    shadowColor: '#E9483C',
    shadowOpacity: 0.32,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
} as const satisfies Record<string, ViewStyle>;

export const motion = {
  fast: 120,
  base: 200,
  slow: 320,
  pressScale: 0.97,
} as const;
