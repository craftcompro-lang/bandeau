import { Text, type TextProps } from 'react-native';

import { colors, typography, type ColorToken, type TypographyVariant } from '@/theme';

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: ColorToken;
  align?: 'left' | 'center' | 'right';
};

/**
 * Texte de l'app : uniquement Montserrat et l'échelle typographique.
 * La taille suit les réglages d'accessibilité du téléphone (plafonnée pour
 * préserver la mise en page).
 */
export function AppText({ variant = 'body', color = 'ink', align, style, ...props }: AppTextProps) {
  return (
    <Text
      maxFontSizeMultiplier={1.35}
      {...props}
      style={[typography[variant], { color: colors[color] }, align && { textAlign: align }, style]}
    />
  );
}
