import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { CategoryId } from '@/domain/categories';
import type { Listing } from '@/domain/listing';
import { colors } from '@/theme';

import { CATEGORY_ICONS } from '../category-icons';

const PLACEHOLDER_BG: Record<CategoryId, string> = {
  mode: colors.blush,
  sneakers: colors.mist,
  tech: colors.violetSoft,
  'jeux-video': colors.violetSoft,
  maison: colors.blush,
  sport: colors.mist,
  livres: colors.blush,
  enfants: colors.mist,
  accessoires: colors.violetSoft,
};

type Props = {
  listing: Pick<Listing, 'photos' | 'categoryId' | 'title'>;
  style?: StyleProp<ViewStyle>;
  iconSize?: number;
};

/** Photo principale de l'annonce, ou visuel neutre de catégorie si aucune photo. */
export function ListingPhoto({ listing, style, iconSize = 36 }: Props) {
  const photo = listing.photos[0];
  if (photo) {
    return (
      <View style={[styles.frame, style]}>
        <Image
          source={{ uri: photo.url }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={180}
          accessibilityLabel={`Photo : ${listing.title}`}
        />
      </View>
    );
  }
  const Icon = CATEGORY_ICONS[listing.categoryId];
  return (
    <View
      style={[styles.frame, styles.placeholder, { backgroundColor: PLACEHOLDER_BG[listing.categoryId] }, style]}
      accessibilityLabel="Aucune photo"
    >
      <Icon size={iconSize} color={colors.inkTertiary} strokeWidth={1.4} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: 'hidden', backgroundColor: colors.mist },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
});
