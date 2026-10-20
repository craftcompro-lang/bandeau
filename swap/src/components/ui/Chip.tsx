import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/theme';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: LucideIcon;
  accessibilityLabel?: string;
};

/** Filtre sélectionnable (pilule). */
export function Chip({ label, selected = false, onPress, icon: Icon, accessibilityLabel }: ChipProps) {
  const content = (
    <View style={[styles.chip, selected ? styles.selected : styles.idle]}>
      {Icon ? <Icon size={16} color={selected ? colors.white : colors.ink} strokeWidth={2} /> : null}
      <AppText variant="label" color={selected ? 'white' : 'ink'} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
  if (!onPress) return content;
  return (
    <PressableScale
      onPress={onPress}
      haptic="selection"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
    >
      {content}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 36,
    paddingHorizontal: spacing.md + 2,
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    borderWidth: 1,
  },
  idle: { backgroundColor: colors.white, borderColor: colors.border },
  selected: { backgroundColor: colors.violet, borderColor: colors.violet },
});
