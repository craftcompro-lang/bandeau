import {
  BadgeCheck,
  CircleAlert,
  Handshake,
  Info,
  KeyRound,
  Package,
  PackageCheck,
  PartyPopper,
  ShieldCheck,
  Truck,
  UserCheck,
  type LucideIcon,
} from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ProtectTimeline, type TimelineStep } from '@/components/exchange/ProtectTimeline';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { AppText, Badge } from '@/components/ui';
import { colors, radii, screenPadding, shadows, spacing } from '@/theme';

/**
 * Présentation de SWAP Protect.
 * Règle : ne rien promettre qui ne soit pas réellement en place. Chaque brique
 * affiche son statut ; l'exemple de suivi est explicitement illustratif.
 */
type Feature = { icon: LucideIcon; title: string; text: string };

const FEATURES: Feature[] = [
  {
    icon: UserCheck,
    title: 'Profils et identité',
    text: 'Vérification par un prestataire spécialisé. Le badge n’est attribué qu’après une vérification réelle.',
  },
  {
    icon: Handshake,
    title: 'Accord des deux parties',
    text: 'Proposition, contre-proposition, acceptation : rien n’est validé par une seule personne.',
  },
  {
    icon: KeyRound,
    title: 'Remise en main propre',
    text: 'Un code à usage unique confirme la remise au moment du rendez-vous.',
  },
  {
    icon: Package,
    title: 'Envoi par colis',
    text: 'Suivi des deux colis, scellé numéroté et vidéo d’emballage facultative.',
  },
  {
    icon: CircleAlert,
    title: 'Signalement et litiges',
    text: 'Déclare un problème avec photos et explications : le support examine chaque dossier.',
  },
];

const EXAMPLE: TimelineStep[] = [
  { key: 'id', icon: BadgeCheck, title: 'Identités vérifiées', subtitle: 'Profils confirmés', state: 'done' },
  { key: 'ship', icon: Package, title: 'Colis expédiés', subtitle: 'Numéros de suivi transmis', state: 'done' },
  { key: 'transit', icon: Truck, title: 'En cours de livraison', subtitle: 'Suivi transporteur', state: 'done' },
  { key: 'recv', icon: PackageCheck, title: 'Objets reçus', subtitle: 'Confirmation des deux parties', state: 'todo' },
  { key: 'done', icon: PartyPopper, title: 'Échange terminé', subtitle: 'Laissez votre avis', state: 'todo' },
];

const LIMITS = [
  'Une vidéo d’emballage ou un QR code ne prouvent pas à eux seuls le contenu d’un colis.',
  'Un code de remise confirme qu’une remise a eu lieu, pas l’état de l’objet.',
  'À ce stade, SWAP n’assure pas et ne garantit pas les objets échangés.',
];

export default function ProtectScreen() {
  return (
    <Screen>
      <ScreenHeader title="SWAP Protect" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <AppText variant="display" align="center">
            Des échanges plus sûrs, étape par étape.
          </AppText>
          <AppText variant="callout" color="inkSecondary" align="center">
            SWAP Protect regroupe les garde-fous qui accompagnent chaque échange. Ils sont activés
            progressivement, après tests et validation juridique.
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText variant="h2" accessibilityRole="header">
            Ce qui encadre ton échange
          </AppText>
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <View key={title} style={styles.feature}>
              <View style={styles.featureIcon}>
                <Icon size={20} color={colors.violet} strokeWidth={2} />
              </View>
              <View style={styles.featureText}>
                <View style={styles.featureTitle}>
                  <AppText variant="labelStrong" style={styles.flex}>
                    {title}
                  </AppText>
                  <Badge label="En préparation" tone="neutral" />
                </View>
                <AppText variant="caption" color="inkSecondary">
                  {text}
                </AppText>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.exampleHeader}>
            <AppText variant="h2" accessibilityRole="header">
              Exemple de suivi
            </AppText>
            <Badge label="Illustration" tone="coral" />
          </View>
          <View style={styles.card}>
            <ProtectTimeline steps={EXAMPLE} />
          </View>
        </View>

        <View style={styles.limits}>
          <View style={styles.limitsTitle}>
            <Info size={18} color={colors.ink} strokeWidth={2.2} />
            <AppText variant="h3">Bon à savoir</AppText>
          </View>
          {LIMITS.map((line) => (
            <View key={line} style={styles.limitRow}>
              <View style={styles.bullet} />
              <AppText variant="caption" color="inkSecondary" style={styles.flex}>
                {line}
              </AppText>
            </View>
          ))}
        </View>

        <View style={styles.footerCard}>
          <View style={styles.footerIcon}>
            <ShieldCheck size={30} color={colors.white} strokeWidth={2} />
          </View>
          <View style={styles.flex}>
            <AppText variant="h3">SWAP Protect</AppText>
            <AppText variant="caption" color="inkSecondary">
              Le module de confiance de SWAP : vérification, suivi et gestion des litiges, activés progressivement.
            </AppText>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: screenPadding, paddingBottom: spacing.huge, gap: spacing.xxxl },
  hero: { gap: spacing.md, paddingTop: spacing.md },
  section: { gap: spacing.lg },
  feature: { flexDirection: 'row', gap: spacing.md },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.violetSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1, gap: 2 },
  featureTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  exampleHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadows.card,
  },
  limits: { gap: spacing.sm, padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.mist },
  limitsTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  limitRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  bullet: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.inkTertiary, marginTop: 7 },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.violetSoft,
  },
  footerIcon: {
    width: 60,
    height: 60,
    borderRadius: radii.md,
    backgroundColor: colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
