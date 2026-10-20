import { router } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ListingGrid, ListingGridSkeleton } from '@/components/listing/ListingGrid';
import { ErrorView, StateView } from '@/components/ui';
import { useListingSearch } from '@/features/listings/hooks';
import { useFavorites } from '@/stores/favorites';
import { spacing } from '@/theme';

export default function FavoritesScreen() {
  const ids = useFavorites((s) => s.ids);
  const query = useListingSearch({ limit: 100 });
  const favorites = useMemo(() => (query.data ?? []).filter((l) => ids.includes(l.id)), [query.data, ids]);

  return (
    <Screen>
      <ScreenHeader title="Favoris" />
      <ScrollView contentContainerStyle={styles.content}>
        {query.isPending ? (
          <ListingGridSkeleton />
        ) : query.isError ? (
          <ErrorView error={query.error} onRetry={() => void query.refetch()} />
        ) : favorites.length === 0 ? (
          <View style={styles.empty}>
            <StateView
              icon={Heart}
              tone="coral"
              title="Aucun favori"
              message="Touche le cœur d’une annonce pour la retrouver ici. Tes favoris sont gardés sur cet appareil."
              actionLabel="Explorer les objets"
              onAction={() => router.navigate('/explorer')}
            />
          </View>
        ) : (
          <ListingGrid listings={favorites} />
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.sm, paddingBottom: spacing.huge, flexGrow: 1 },
  empty: { flex: 1, justifyContent: 'center' },
});
