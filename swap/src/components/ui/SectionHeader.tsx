import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme';

import { AppText } from './AppText';

type Props = { title: string; subtitle?: string; actionLabel?: string; onAction?: () => void };

export function SectionHeader({ title, subtitle, actionLabel, onAction }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.titles}>
        <AppText variant="h2" accessibilityRole="header">
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color="inkSecondary">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel} — ${title}`}
          style={({ pressed }) => [styles.action, pressed && { opacity: 0.6 }]}
        >
          <AppText variant="labelStrong" color="ink">
            {actionLabel}
          </AppText>
          <ChevronRight size={16} color={colors.ink} strokeWidth={2.4} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing.md },
  titles: { flex: 1, gap: 2 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingVertical: spacing.xs },
});
