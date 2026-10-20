import { Check, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/theme';

import { AppText } from '../ui/AppText';

export type TimelineStep = {
  key: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  state: 'done' | 'current' | 'todo';
};

/** Suivi des étapes d'un échange (icône, libellé, état). */
export function ProtectTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <View accessibilityRole="list">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const last = index === steps.length - 1;
        const done = step.state === 'done';
        return (
          <View
            key={step.key}
            style={styles.row}
            accessible
            accessibilityLabel={`${step.title}, ${step.subtitle}, ${done ? 'terminé' : step.state === 'current' ? 'en cours' : 'à venir'}`}
          >
            <View style={styles.rail}>
              <View style={[styles.icon, done || step.state === 'current' ? styles.iconActive : styles.iconIdle]}>
                <Icon size={18} color={done || step.state === 'current' ? colors.coralStrong : colors.inkTertiary} strokeWidth={2} />
              </View>
              {!last ? <View style={[styles.line, done && styles.lineDone]} /> : null}
            </View>
            <View style={styles.text}>
              <AppText variant="labelStrong" color={step.state === 'todo' ? 'inkSecondary' : 'ink'}>
                {step.title}
              </AppText>
              <AppText variant="footnote" color="inkSecondary">
                {step.subtitle}
              </AppText>
            </View>
            <View style={[styles.check, done ? styles.checkDone : styles.checkTodo]}>
              {done ? <Check size={13} color={colors.white} strokeWidth={3.2} /> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, minHeight: 60 },
  rail: { alignItems: 'center', width: 40 },
  icon: { width: 40, height: 40, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  iconActive: { backgroundColor: colors.coralSoft },
  iconIdle: { backgroundColor: colors.mist },
  line: { flex: 1, width: 2, backgroundColor: colors.border, marginVertical: 2 },
  lineDone: { backgroundColor: colors.blush },
  text: { flex: 1, paddingTop: 2, gap: 1, paddingBottom: spacing.md },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginTop: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: { backgroundColor: colors.violet },
  checkTodo: { borderWidth: 1.5, borderColor: colors.borderStrong },
});
