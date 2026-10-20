import type { TextStyle } from 'react-native';

/** Familles Montserrat chargées au démarrage (voir src/app/_layout.tsx). */
export const fontFamily = {
  regular: 'Montserrat_400Regular',
  medium: 'Montserrat_500Medium',
  semibold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
} as const;

/**
 * Échelle typographique — basée sur la charte (H1 32/40, H2 24/32, H3 18/28,
 * Body 16/24, Caption 14/20) et complétée pour les besoins mobiles.
 */
export const typography = {
  display: { fontFamily: fontFamily.bold, fontSize: 32, lineHeight: 40, letterSpacing: -0.6 },
  h1: { fontFamily: fontFamily.bold, fontSize: 26, lineHeight: 32, letterSpacing: -0.4 },
  h2: { fontFamily: fontFamily.semibold, fontSize: 20, lineHeight: 26, letterSpacing: -0.2 },
  h3: { fontFamily: fontFamily.semibold, fontSize: 17, lineHeight: 22, letterSpacing: -0.1 },
  body: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24 },
  bodyMedium: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 24 },
  callout: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 20 },
  labelStrong: { fontFamily: fontFamily.semibold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
  footnote: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
  micro: { fontFamily: fontFamily.medium, fontSize: 11, lineHeight: 14, letterSpacing: 0.1 },
  button: { fontFamily: fontFamily.bold, fontSize: 17, lineHeight: 22 },
  buttonSmall: { fontFamily: fontFamily.semibold, fontSize: 14, lineHeight: 18 },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
