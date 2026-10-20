import { Image } from 'expo-image';
import type { StyleProp, ImageStyle } from 'react-native';

/**
 * Logo SWAP.
 *
 * Les fichiers de assets/brand/ sont des extractions PROVISOIRES de la charte
 * officielle (aucun redessin). Pour passer aux fichiers définitifs, remplacer les
 * PNG du même nom par les exports officiels (voir assets/brand/README.md) :
 * aucun autre changement de code n'est nécessaire.
 */
const SOURCES = {
  wordmark: { file: require('../../../assets/brand/swap-wordmark.png'), ratio: 1281 / 405 },
  baseline: { file: require('../../../assets/brand/swap-logo-baseline.png'), ratio: 1281 / 537 },
  symbol: { file: require('../../../assets/brand/swap-symbol.png'), ratio: 537 / 519 },
  onDark: { file: require('../../../assets/brand/swap-wordmark-on-dark.png'), ratio: 486 / 168 },
  mono: { file: require('../../../assets/brand/swap-wordmark-mono.png'), ratio: 1281 / 405 },
  white: { file: require('../../../assets/brand/swap-wordmark-white.png'), ratio: 1281 / 405 },
} as const;

export type LogoVariant = keyof typeof SOURCES;

type Props = { variant?: LogoVariant; height: number; style?: StyleProp<ImageStyle> };

export function Logo({ variant = 'wordmark', height, style }: Props) {
  const { file, ratio } = SOURCES[variant];
  return (
    <Image
      source={file}
      style={[{ height, width: height * ratio }, style]}
      contentFit="contain"
      accessibilityRole="image"
      accessibilityLabel="SWAP"
    />
  );
}
