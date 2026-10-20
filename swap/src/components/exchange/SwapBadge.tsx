import { ArrowUpDown } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { colors, shadows } from '@/theme';

/** Pastille corail « ⇄ » entre les deux objets. */
export function SwapBadge() {
  return (
    <View style={styles.wrap} accessible={false} importantForAccessibility="no-hide-descendants">
      <View style={styles.circle}>
        <ArrowUpDown size={22} color={colors.white} strokeWidth={2.6} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', height: 20, zIndex: 2 },
  circle: {
    marginTop: -16,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.coral,
    borderWidth: 4,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.coralGlow,
  },
});
