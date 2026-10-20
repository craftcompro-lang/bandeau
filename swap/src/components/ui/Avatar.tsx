import { Image } from 'expo-image';
import { User } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { colors, fontFamily } from '@/theme';

import { AppText } from './AppText';

type Props = { name: string | null; uri?: string | null; size?: number };

/** Photo de profil ou initiale sur fond violet doux. */
export function Avatar({ name, uri, size = 40 }: Props) {
  const dimension = { width: size, height: size, borderRadius: size / 2 };
  if (uri) {
    return (
      <Image source={{ uri }} style={[styles.base, dimension]} contentFit="cover" accessibilityLabel={name ?? 'Avatar'} />
    );
  }
  if (!name) {
    return (
      <View style={[styles.base, styles.fallback, dimension]} accessibilityLabel="Invité">
        <User size={size * 0.5} color={colors.violet} strokeWidth={2} />
      </View>
    );
  }
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <View style={[styles.base, styles.fallback, dimension]} accessibilityLabel={`Avatar de ${name}`}>
      <AppText
        style={{ fontFamily: fontFamily.semibold, fontSize: size * 0.4, lineHeight: size * 0.5 }}
        color="violet"
      >
        {initial}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
  fallback: { backgroundColor: colors.violetSoft, alignItems: 'center', justifyContent: 'center' },
});
