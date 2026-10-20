import { Camera, FileText, Eye, MapPin, Repeat, Tags, type LucideIcon } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { AppText, Button } from '@/components/ui';
import { colors, radii, screenPadding, spacing } from '@/theme';

const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Camera, title: 'Photos', text: 'Jusqu’à 8 photos, compressées automatiquement.' },
  { icon: FileText, title: 'Titre et description', text: 'Décris ton objet honnêtement, défauts compris.' },
  { icon: Tags, title: 'Catégorie, état et marque', text: 'Pour être trouvé par les bonnes personnes.' },
  { icon: MapPin, title: 'Zone géographique', text: 'Seule une zone approximative est affichée.' },
  { icon: Repeat, title: 'Ce que tu recherches', text: 'Les catégories qui t’intéressent en échange.' },
  { icon: Eye, title: 'Aperçu puis publication', text: 'Vérifie ton annonce avant de la publier.' },
];

export default function PublishScreen() {
  const insets = useSafeAreaInsets();
  return (
    <Screen>
      <ScreenHeader title="Publier un objet" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <AppText variant="h1">Propose un objet à l’échange</AppText>
          <AppText variant="callout" color="inkSecondary">
            La publication nécessite un compte. Voici les étapes qui t’attendent.
          </AppText>
        </View>
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <View key={title} style={styles.step}>
            <View style={styles.stepIcon}>
              <Icon size={20} color={colors.coralStrong} strokeWidth={2} />
            </View>
            <View style={styles.flex}>
              <AppText variant="labelStrong">
                {i + 1}. {title}
              </AppText>
              <AppText variant="caption" color="inkSecondary">
                {text}
              </AppText>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <Button label="Disponible avec les comptes" variant="exchange" disabled />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: screenPadding, paddingBottom: spacing.xxl, gap: spacing.lg },
  intro: { gap: spacing.sm, marginBottom: spacing.sm },
  step: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.coralSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
