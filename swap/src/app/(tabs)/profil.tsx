import Constants from 'expo-constants';
import { router, type Href } from 'expo-router';
import { ChevronRight, Heart, ShieldCheck, type LucideIcon } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Logo } from '@/components/brand/Logo';
import { Screen } from '@/components/layout/Screen';
import { AppText, Avatar, Button, Divider } from '@/components/ui';
import { listingsRepository } from '@/data/listings-repository';
import { useFavorites } from '@/stores/favorites';
import { colors, radii, screenPadding, spacing } from '@/theme';

export default function ProfileScreen() {
  const favoritesCount = useFavorites((s) => s.ids.length);
  const version = Constants.expoConfig?.version ?? '—';

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppText variant="h1" accessibilityRole="header">
          Profil
        </AppText>

        <View style={styles.guestCard}>
          <Avatar name={null} size={64} />
          <View style={styles.guestText}>
            <AppText variant="h2" align="center">
              Bienvenue sur SWAP
            </AppText>
            <AppText variant="callout" color="inkSecondary" align="center">
              Crée ton compte pour publier tes objets, proposer des échanges et discuter.
            </AppText>
          </View>
          <Button
            label="Connexion bientôt disponible"
            disabled
            accessibilityHint="La création de compte sera activée prochainement"
          />
        </View>

        <View style={styles.menu}>
          <MenuRow
            icon={Heart}
            label="Favoris"
            detail={favoritesCount ? String(favoritesCount) : undefined}
            href="/favoris"
          />
          <Divider inset={56} />
          <MenuRow icon={ShieldCheck} label="SWAP Protect" href="/protect" />
        </View>

        <View style={styles.footer}>
          <Logo variant="baseline" height={76} />
          <AppText variant="footnote" color="inkTertiary" align="center">
            Version {version}
            {listingsRepository.isDemo ? ' · mode démo' : ''}
          </AppText>
        </View>
      </ScrollView>
    </Screen>
  );
}

function MenuRow({ icon: Icon, label, detail, href }: { icon: LucideIcon; label: string; detail?: string; href: Href }) {
  return (
    <Pressable
      onPress={() => router.push(href)}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.mist }]}
    >
      <View style={styles.rowIcon}>
        <Icon size={20} color={colors.violet} strokeWidth={2} />
      </View>
      <AppText variant="bodyMedium" style={styles.flex}>
        {label}
      </AppText>
      {detail ? (
        <AppText variant="label" color="inkSecondary">
          {detail}
        </AppText>
      ) : null}
      <ChevronRight size={18} color={colors.inkTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: screenPadding, paddingTop: spacing.md, paddingBottom: spacing.huge, gap: spacing.xxl },
  guestCard: {
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.xxl,
    borderRadius: radii.xl,
    backgroundColor: colors.mist,
  },
  guestText: { gap: spacing.xs, alignItems: 'center' },
  menu: {
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, minHeight: 56 },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: colors.violetSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { alignItems: 'center', gap: spacing.md, marginTop: spacing.xl },
});
