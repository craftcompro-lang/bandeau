import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/theme';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

type Props = {
  label: string;
  icon: LucideIcon;
  selected?: boolean;
  onPress: () => void;
};

/** Raccourci de catégorie (pictogramme dans une tuile arrondie + libellé). */
export function CategoryTile({ label, icon: Icon, selected = false, onPress }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      haptic="selection"
      accessibilityRole="button"
      accessibilityLabel={`Catégorie ${label}`}
      accessibilityState={{ selected }}
      style={styles.container}
    >
      <View style={[styles.tile, selected ? styles.tileSelected : styles.tileIdle]}>
        <Icon size={22} color={selected ? colors.white : colors.ink} strokeWidth={1.9} />
      </View>
      <AppText variant="micro" color={selected ? 'violet' : 'inkSecondary'} numberOfLines={1} align="center">
        {label}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: { width: 64, alignItems: 'center', gap: spacing.xs + 2 },
  tile: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileIdle: { backgroundColor: colors.mist },
  tileSelected: { backgroundColor: colors.violet },
});
