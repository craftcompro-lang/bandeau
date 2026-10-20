import { FlaskConical } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { listingsRepository } from '@/data/listings-repository';
import { colors, radii, spacing } from '@/theme';

import { AppText } from '../ui/AppText';

/** Signale clairement que les annonces affichées sont fictives. */
export function DemoBanner() {
  if (!listingsRepository.isDemo) return null;
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <FlaskConical size={16} color={colors.night} strokeWidth={2} />
      <AppText variant="caption" color="ink" style={styles.text}>
        Mode démo : annonces et profils fictifs, aucun échange réel.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.blush,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: { flex: 1 },
});
