import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { fontFamily, spacing, type ColorToken } from '@/theme';

import { AppText } from '../ui/AppText';
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

/** Logo + signature de marque, composée en Montserrat comme sur la charte. */
export function LogoWithSignature({ height, tone = 'couleur' }: { height: number; tone?: LogoTone }) {
  const color: ColorToken = tone === 'sombre' || tone === 'blanc' ? 'white' : 'ink';
  const size = Math.max(9, Math.round(height * 0.2));
  return (
    <View style={styles.signatureBlock} accessible accessibilityLabel="SWAP — Échange aujourd’hui, meilleur demain">
      <Logo height={height} tone={tone} />
      <AppText
        color={color}
        align="center"
        maxFontSizeMultiplier={1}
        style={[styles.signature, { fontSize: size, lineHeight: size * 1.6, letterSpacing: size * 0.32 }]}
      >
        ÉCHANGE AUJOURD’HUI{'\n'}MEILLEUR DEMAIN
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  signatureBlock: { alignItems: 'center', gap: spacing.sm },
  signature: { fontFamily: fontFamily.medium },
});
