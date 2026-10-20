import { BadgeCheck, ShieldQuestion } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import type { OwnerSummary } from '@/domain/listing';
import { colors, radii, spacing } from '@/theme';

import { AppText } from '../ui/AppText';
import { Avatar } from '../ui/Avatar';

const memberSinceLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

/**
 * Propriétaire d'une annonce. Le badge « Identité vérifiée » n'apparaît que si
 * le serveur l'a confirmé (prestataire d'identité) ; aucune note n'est inventée.
 */
export function OwnerCard({ owner, compact = false }: { owner: OwnerSummary; compact?: boolean }) {
  const stats =
    owner.ratingCount > 0 && owner.ratingAverage !== null
      ? `${owner.ratingAverage.toFixed(1)} / 5 · ${owner.ratingCount} avis`
      : owner.completedExchanges > 0
        ? `${owner.completedExchanges} échange${owner.completedExchanges > 1 ? 's' : ''} terminé${owner.completedExchanges > 1 ? 's' : ''}`
        : 'Nouveau membre · aucun avis';

  return (
    <View style={[styles.card, compact && styles.compact]}>
      <Avatar name={owner.username} uri={owner.avatarUrl} size={compact ? 36 : 44} />
      <View style={styles.text}>
        <AppText variant="labelStrong" numberOfLines={1}>
          {owner.username}
        </AppText>
        <AppText variant="footnote" color="inkSecondary" numberOfLines={1}>
          {stats}
          {compact ? '' : ` · membre depuis ${memberSinceLabel(owner.memberSince)}`}
        </AppText>
        <View style={styles.verification}>
          {owner.identityVerified ? (
            <>
              <BadgeCheck size={14} color={colors.violet} strokeWidth={2.2} />
              <AppText variant="micro" color="violet">
                Identité vérifiée
              </AppText>
            </>
          ) : (
            <>
              <ShieldQuestion size={14} color={colors.inkTertiary} strokeWidth={2} />
              <AppText variant="micro" color="inkTertiary">
                Identité non vérifiée
              </AppText>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.mist,
  },
  compact: { padding: 0, backgroundColor: 'transparent' },
  text: { flex: 1, gap: 1 },
  verification: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
});
