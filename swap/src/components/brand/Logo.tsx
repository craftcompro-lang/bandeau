import { View, type StyleProp, type ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { BRAND_SVG } from './svg-sources';

/**
 * Logo SWAP — fichiers vectoriels officiels (assets/brand/*.svg).
 *
 * Teintes :
 * - couleur : lettres bleu nuit + flèches violet/corail — sur fond clair (par défaut)
 * - sombre  : lettres blanches + flèches violet/corail — sur fond foncé
 * - encre   : monochrome bleu nuit
 * - blanc   : monochrome blanc
 */
export type LogoTone = 'couleur' | 'sombre' | 'encre' | 'blanc';
export type LogoKind = 'logo' | 'symbole';

const SOURCES = {
  logo: {
    couleur: BRAND_SVG.logoCouleur,
    sombre: BRAND_SVG.logoSombre,
    encre: BRAND_SVG.logoEncre,
    blanc: BRAND_SVG.logoBlanc,
  },
  symbole: {
    couleur: BRAND_SVG.symboleCouleur,
    sombre: BRAND_SVG.symboleSombre,
    encre: BRAND_SVG.symboleEncre,
    blanc: BRAND_SVG.symboleBlanc,
  },
} as const;

/** Proportions des viewBox officiels (logo 2570×814, symbole 822×822). */
const RATIO: Record<LogoKind, number> = { logo: 2570 / 814, symbole: 1 };

type Props = {
  kind?: LogoKind;
  tone?: LogoTone;
  height: number;
  style?: StyleProp<ViewStyle>;
};

export function Logo({ kind = 'logo', tone = 'couleur', height, style }: Props) {
  return (
    <View
      style={[{ height, width: height * RATIO[kind] }, style]}
      accessible
      accessibilityRole="image"
      accessibilityLabel="SWAP"
    >
      <SvgXml xml={SOURCES[kind][tone]} width="100%" height="100%" />
    </View>
  );
}
