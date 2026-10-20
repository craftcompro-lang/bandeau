import { Pencil } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { getCategoryLabel } from '@/domain/categories';
import { CONDITIONS, type Listing } from '@/domain/listing';
import { colors, radii, shadows, spacing } from '@/theme';

import { ListingPhoto } from '../listing/ListingPhoto';
import { OwnerCard } from '../listing/OwnerCard';
import { AppText } from '../ui/AppText';

type Props = {
  label: string;
  listing: Listing;
  onEdit?: () => void;
  showOwner?: boolean;
};

/** Un côté de l'échange : « Ton objet » ou « Son objet ». */
export function ExchangeItemCard({ label, listing, onEdit, showOwner = false }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppText variant="labelStrong" color="inkSecondary">
          {label}
        </AppText>
        {onEdit ? (
          <Pressable
            onPress={onEdit}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`Modifier — ${label}`}
            style={({ pressed }) => [styles.edit, pressed && { opacity: 0.6 }]}
          >
            <Pencil size={14} color={colors.violet} strokeWidth={2.4} />
            <AppText variant="labelStrong" color="violet">
              Modifier
            </AppText>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.row}>
        <ListingPhoto listing={listing} style={styles.photo} iconSize={30} />
        <View style={styles.info}>
          <AppText variant="h3" numberOfLines={2}>
            {listing.title}
          </AppText>
          <AppText variant="caption" color="inkSecondary" numberOfLines={1}>
            {[listing.brand ?? getCategoryLabel(listing.categoryId), listing.size && `Taille ${listing.size}`]
              .filter(Boolean)
              .join(' · ')}
          </AppText>
          <AppText variant="caption" color="inkSecondary" numberOfLines={1}>
            {CONDITIONS[listing.condition]} · {listing.city}
          </AppText>
        </View>
      </View>
      {showOwner ? (
        <View style={styles.owner}>
          <OwnerCard owner={listing.owner} compact />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadows.card,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  edit: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  photo: { width: 96, height: 96, borderRadius: radii.md },
  info: { flex: 1, gap: 2 },
  owner: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
});
