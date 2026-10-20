import { type LucideIcon, WifiOff } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/theme';

import { AppText } from './AppText';
import { Button } from './Button';

type Props = {
  icon: LucideIcon;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'violet' | 'coral' | 'neutral';
  compact?: boolean;
};

/** État vide / information / refus d'autorisation. */
export function StateView({ icon: Icon, title, message, actionLabel, onAction, tone = 'violet', compact }: Props) {
  const bg = tone === 'coral' ? colors.coralSoft : tone === 'neutral' ? colors.mist : colors.violetSoft;
  const fg = tone === 'coral' ? colors.coralStrong : tone === 'neutral' ? colors.inkSecondary : colors.violet;
  return (
    <View style={[styles.container, compact && styles.compact]} accessibilityRole="summary">
      <View style={[styles.icon, { backgroundColor: bg }]}>
        <Icon size={26} color={fg} strokeWidth={2} />
      </View>
      <AppText variant="h3" align="center">
        {title}
      </AppText>
      {message ? (
        <AppText variant="callout" color="inkSecondary" align="center" style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="secondary" size="md" fullWidth={false} style={styles.action} />
      ) : null}
    </View>
  );
}

/** Erreur (réseau ou serveur) avec possibilité de réessayer. */
export function ErrorView({ error, onRetry, compact }: { error: unknown; onRetry?: () => void; compact?: boolean }) {
  const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue.';
  const isNetwork = /network|fetch|réseau/i.test(message);
  return (
    <StateView
      icon={WifiOff}
      tone="coral"
      compact={compact}
      title={isNetwork ? 'Connexion impossible' : 'Chargement impossible'}
      message={isNetwork ? 'Vérifie ta connexion internet puis réessaie.' : message}
      actionLabel={onRetry ? 'Réessayer' : undefined}
      onAction={onRetry}
    />
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingHorizontal: spacing.xxl, paddingVertical: spacing.huge, gap: spacing.sm },
  compact: { paddingVertical: spacing.xxl },
  icon: {
    width: 60,
    height: 60,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  message: { maxWidth: 320 },
  action: { marginTop: spacing.md },
});
