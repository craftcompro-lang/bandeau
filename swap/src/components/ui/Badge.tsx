import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing, type ColorToken } from '@/theme';

import { AppText } from './AppText';

type Tone = 'neutral' | 'violet' | 'coral' | 'night' | 'outline';

const tones: Record<Tone, { bg: string; fg: ColorToken; border?: string }> = {
  neutral: { bg: colors.mist, fg: 'inkSecondary' },
  violet: { bg: colors.violetSoft, fg: 'violet' },
  coral: { bg: colors.coralSoft, fg: 'coralPressed' },
  night: { bg: colors.night, fg: 'white' },
  outline: { bg: colors.white, fg: 'inkSecondary', border: colors.border },
};

export function Badge({ label, tone = 'neutral', icon: Icon }: { label: string; tone?: Tone; icon?: LucideIcon }) {
  const t = tones[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg, borderColor: t.border ?? t.bg }]}>
      {Icon ? <Icon size={12} color={colors[t.fg]} strokeWidth={2.4} /> : null}
      <AppText variant="micro" color={t.fg} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
});
