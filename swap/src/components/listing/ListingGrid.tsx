import { StyleSheet, View } from 'react-native';

import type { ListingResult } from '@/domain/search';
import { screenPadding } from '@/theme';

import { ListingCard, ListingCardSkeleton } from './ListingCard';
import { useGridLayout } from './useGridLayout';

/** Grille non virtualisée — pour de petites sections (≤ 12 éléments). */
export function ListingGrid({ listings }: { listings: ListingResult[] }) {
  const { cardWidth, gap } = useGridLayout();
  return (
    <View style={[styles.grid, { gap, rowGap: gap + 4 }]}>
      {listings.map((l) => (
        <ListingCard key={l.id} listing={l} width={cardWidth} />
      ))}
    </View>
  );
}

export function ListingGridSkeleton({ count = 4 }: { count?: number }) {
  const { cardWidth, gap } = useGridLayout();
  return (
    <View style={[styles.grid, { gap, rowGap: gap + 4 }]}>
      {Array.from({ length: count }, (_, i) => (
        <ListingCardSkeleton key={i} width={cardWidth} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: screenPadding },
});
