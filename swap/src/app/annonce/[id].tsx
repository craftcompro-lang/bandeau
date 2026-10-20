import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeftRight, ChevronLeft, MapPin, SearchX, Tag } from 'lucide-react-native';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CATEGORY_ICONS } from '@/components/category-icons';
import { FavoriteButton } from '@/components/listing/FavoriteButton';
import { ListingPhoto } from '@/components/listing/ListingPhoto';
import { OwnerCard } from '@/components/listing/OwnerCard';
import { AppText, Badge, Button, Chip, ErrorView, IconButton, Skeleton, StateView } from '@/components/ui';
import { listingsRepository } from '@/data/listings-repository';
import { getCategoryLabel } from '@/domain/categories';
import { distanceKm, formatDistance } from '@/domain/geo';
import { CONDITIONS } from '@/domain/listing';
import { useListing } from '@/features/listings/hooks';
import { useLocation } from '@/stores/location';
import { colors, radii, screenPadding, shadows, spacing } from '@/theme';

const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

const relativeDate = (iso: string) => {
  const hours = Math.round((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (hours < 1) return 'à l’instant';
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  return `il y a ${days} jour${days > 1 ? 's' : ''}`;
};

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const listing = useListing(id);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const origin = useLocation((s) => s.coords);

  if (listing.isPending || listing.isError || !listing.data) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.inlineBar}>
          <IconButton icon={ChevronLeft} variant="soft" accessibilityLabel="Retour" onPress={goBack} />
        </View>
        {listing.isPending ? (
          <View style={styles.loading}>
            <Skeleton height={width * 0.9} radius={0} />
            <View style={[styles.padded, { gap: spacing.md }]}>
              <Skeleton height={26} width="70%" />
              <Skeleton height={16} width="45%" />
              <Skeleton height={80} />
            </View>
          </View>
        ) : listing.isError ? (
          <ErrorView error={listing.error} onRetry={() => void listing.refetch()} />
        ) : (
          <StateView
            icon={SearchX}
            title="Annonce introuvable"
            message="Elle a peut-être été retirée par son propriétaire."
            actionLabel="Retour"
            onAction={goBack}
          />
        )}
      </SafeAreaView>
    );
  }

  const item = listing.data;
  const isMine = item.owner.id === listingsRepository.currentUserId();
  const available = item.status === 'active';
  const distance = origin && item.coords ? formatDistance(distanceKm(origin, item.coords)) : null;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 + insets.bottom }} showsVerticalScrollIndicator={false}>
        <ListingPhoto listing={item} style={{ width, height: width * 0.9 }} iconSize={72} />

        <View style={[styles.padded, styles.body]}>
          {item.isDemo ? <Badge label="Annonce fictive — démo" tone="coral" /> : null}
          <View style={styles.titleBlock}>
            <AppText variant="h1">{item.title}</AppText>
            <AppText variant="callout" color="inkSecondary">
              {[item.brand, item.size && `Taille ${item.size}`, CONDITIONS[item.condition]].filter(Boolean).join(' · ')}
            </AppText>
          </View>

          <View style={styles.metaRow}>
            <Badge label={getCategoryLabel(item.categoryId)} icon={CATEGORY_ICONS[item.categoryId]} tone="violet" />
            <View style={styles.location}>
              <MapPin size={14} color={colors.inkSecondary} strokeWidth={2.2} />
              <AppText variant="caption" color="inkSecondary">
                {item.city}
                {distance ? ` · ${distance}` : ''}
              </AppText>
            </View>
          </View>

          {item.description ? (
            <AppText variant="body" color="ink">
              {item.description}
            </AppText>
          ) : null}

          {item.wantedCategoryIds.length > 0 ? (
            <View style={styles.wanted}>
              <View style={styles.wantedTitle}>
                <ArrowLeftRight size={16} color={colors.coralStrong} strokeWidth={2.4} />
                <AppText variant="h3">Recherche en échange</AppText>
              </View>
              <View style={styles.wrap}>
                {item.wantedCategoryIds.map((c) => (
                  <Chip key={c} label={getCategoryLabel(c)} icon={CATEGORY_ICONS[c]} />
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.ownerBlock}>
            <AppText variant="h3">Proposé par</AppText>
            <OwnerCard owner={item.owner} />
          </View>

          <View style={styles.footnote}>
            <Tag size={14} color={colors.inkTertiary} />
            <AppText variant="footnote" color="inkTertiary">
              Publiée {relativeDate(item.createdAt)}
            </AppText>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['top']} style={styles.floatingBar} pointerEvents="box-none">
        <IconButton icon={ChevronLeft} variant="surface" accessibilityLabel="Retour" onPress={goBack} />
        <FavoriteButton listingId={item.id} title={item.title} size={44} />
      </SafeAreaView>

      <View style={[styles.actionBar, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        {isMine ? (
          <Button label="C’est ton annonce" variant="secondary" disabled />
        ) : (
          <Button
            label={available ? 'Proposer un échange' : 'Objet indisponible'}
            variant="exchange"
            icon={ArrowLeftRight}
            disabled={!available}
            onPress={() => router.push({ pathname: '/echange/proposer', params: { listingId: item.id } })}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  loading: { gap: spacing.xl },
  padded: { paddingHorizontal: screenPadding },
  body: {
    gap: spacing.xl,
    paddingTop: spacing.xl,
    marginTop: -spacing.xl,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    backgroundColor: colors.background,
  },
  titleBlock: { gap: spacing.xs },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' },
  location: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  wanted: { gap: spacing.md },
  wantedTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  ownerBlock: { gap: spacing.md },
  footnote: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  floatingBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: screenPadding - spacing.xs,
    paddingTop: spacing.sm,
  },
  inlineBar: { paddingHorizontal: screenPadding - spacing.xs, paddingVertical: spacing.sm },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    ...shadows.raised,
  },
});
