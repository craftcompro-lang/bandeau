import { router } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { getCategoryLabel } from '@/domain/categories';
import { formatDistance } from '@/domain/geo';
import { CONDITIONS } from '@/domain/listing';
import type { ListingResult } from '@/domain/search';
import { colors, radii, spacing } from '@/theme';

import { AppText } from '../ui/AppText';
import { PressableScale } from '../ui/PressableScale';
import { Skeleton } from '../ui/Skeleton';
import { FavoriteButton } from './FavoriteButton';
import { ListingPhoto } from './ListingPhoto';

export const CARD_PHOTO_RATIO = 1.12;

type Props = { listing: ListingResult; width: number };

export function ListingCard({ listing, width }: Props) {
  const overline = listing.brand ?? getCategoryLabel(listing.categoryId);
  const details = [listing.size && `T. ${listing.size}`, CONDITIONS[listing.condition]].filter(Boolean).join(' · ');
  const distance = listing.distanceKm !== null ? formatDistance(listing.distanceKm) : null;

  return (
    <PressableScale
      onPress={() => router.push({ pathname: '/annonce/[id]', params: { id: listing.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${listing.title}, ${CONDITIONS[listing.condition]}, ${listing.city}`}
      scaleTo={0.98}
      style={{ width }}
    >
      <View>
        <ListingPhoto listing={listing} style={[styles.photo, { height: width / CARD_PHOTO_RATIO }]} />
        <View style={styles.favorite}>
          <FavoriteButton listingId={listing.id} title={listing.title} />
        </View>
      </View>
      <View style={styles.body}>
        <AppText variant="micro" color="inkTertiary" numberOfLines={1} style={styles.overline}>
          {overline}
        </AppText>
        <AppText variant="labelStrong" numberOfLines={1}>
          {listing.title}
        </AppText>
        <AppText variant="caption" color="inkSecondary" numberOfLines={1}>
          {details}
        </AppText>
        <View style={styles.location}>
          <MapPin size={12} color={colors.inkTertiary} strokeWidth={2.2} />
          <AppText variant="footnote" color="inkTertiary" numberOfLines={1} style={styles.locationText}>
            {listing.city}
            {distance ? ` · ${distance}` : ''}
          </AppText>
        </View>
      </View>
    </PressableScale>
  );
}

export function ListingCardSkeleton({ width }: { width: number }) {
  return (
    <View style={{ width, gap: spacing.sm }}>
      <Skeleton height={width / CARD_PHOTO_RATIO} radius={radii.md} />
      <Skeleton height={14} width="80%" />
      <Skeleton height={12} width="55%" />
    </View>
  );
}

const styles = StyleSheet.create({
  photo: { width: '100%', borderRadius: radii.md },
  favorite: { position: 'absolute', top: spacing.sm, right: spacing.sm },
  body: { paddingTop: spacing.sm, paddingHorizontal: 2, gap: 2 },
  overline: { textTransform: 'uppercase', letterSpacing: 0.6 },
  location: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  locationText: { flex: 1 },
});
