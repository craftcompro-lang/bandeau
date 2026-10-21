import { router } from 'expo-router';
import { Bell, PackageOpen } from 'lucide-react-native';
import { useMemo } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { Logo } from '@/components/brand/Logo';
import { ALL_CATEGORIES_ICON, CATEGORY_ICONS } from '@/components/category-icons';
import { DemoBanner } from '@/components/layout/DemoBanner';
import { Screen } from '@/components/layout/Screen';
import { ListingCard, ListingCardSkeleton } from '@/components/listing/ListingCard';
import { ListingGrid } from '@/components/listing/ListingGrid';
import { NearbySection } from '@/components/listing/NearbySection';
import { useGridLayout } from '@/components/listing/useGridLayout';
import {
  Avatar,
  CategoryTile,
  ErrorView,
  IconButton,
  PressableScale,
  SearchLauncher,
  SectionHeader,
  StateView,
} from '@/components/ui';
import { CATEGORIES } from '@/domain/categories';
import type { ListingResult } from '@/domain/search';
import { useListingSearch } from '@/features/listings/hooks';
import { useFavorites } from '@/stores/favorites';
import { colors, screenPadding, spacing } from '@/theme';

const openExplorer = (params: { focus?: string; category?: string }) =>
  router.navigate({ pathname: '/explorer', params });

export default function HomeScreen() {
  const recent = useListingSearch({ sort: 'recent', limit: 40 });
  const favoriteIds = useFavorites((s) => s.ids);
  const { cardWidth, gap } = useGridLayout();

  // « Pour toi » : règle simple et transparente — mêmes catégories que tes favoris.
  const forYou = useMemo(() => {
    const all = recent.data ?? [];
    const favCategories = new Set(all.filter((l) => favoriteIds.includes(l.id)).map((l) => l.categoryId));
    if (favCategories.size === 0) return [];
    return all.filter((l) => favCategories.has(l.categoryId) && !favoriteIds.includes(l.id)).slice(0, 4);
  }, [recent.data, favoriteIds]);

  const header = (
    <View style={styles.header}>
      <View style={styles.topBar}>
        <PressableScale
          onPress={() => router.navigate('/profil')}
          accessibilityRole="button"
          accessibilityLabel="Mon profil"
          style={styles.avatar}
        >
          <Avatar name={null} size={34} />
        </PressableScale>
        <Logo height={30} />
        <IconButton icon={Bell} accessibilityLabel="Notifications" onPress={() => router.push('/notifications')} />
      </View>

      <View style={styles.padded}>
        <SearchLauncher label="Rechercher un objet, une marque…" onPress={() => openExplorer({ focus: '1' })} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
        <CategoryTile label="Tout" icon={ALL_CATEGORIES_ICON} selected onPress={() => openExplorer({})} />
        {CATEGORIES.map((c) => (
          <CategoryTile
            key={c.id}
            label={c.label}
            icon={CATEGORY_ICONS[c.id]}
            onPress={() => openExplorer({ category: c.id })}
          />
        ))}
      </ScrollView>

      <View style={styles.padded}>
        <DemoBanner />
      </View>

      <View style={styles.section}>
        <View style={styles.padded}>
          <SectionHeader title="À proximité" />
        </View>
        <NearbySection />
      </View>

      {forYou.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.padded}>
            <SectionHeader title="Pour toi" subtitle="Selon les catégories de tes favoris" />
          </View>
          <ListingGrid listings={forYou} />
        </View>
      ) : null}

      <View style={[styles.padded, styles.recentHeader]}>
        <SectionHeader title="Récemment ajoutés" actionLabel="Voir tout" onAction={() => openExplorer({})} />
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (recent.isPending) {
      return (
        <View style={[styles.skeletonGrid, { gap }]}>
          {[0, 1, 2, 3].map((i) => (
            <ListingCardSkeleton key={i} width={cardWidth} />
          ))}
        </View>
      );
    }
    if (recent.isError) return <ErrorView error={recent.error} onRetry={() => void recent.refetch()} compact />;
    return (
      <StateView
        icon={PackageOpen}
        compact
        title="Aucune annonce pour l’instant"
        message="Les nouveaux objets proposés à l’échange apparaîtront ici."
      />
    );
  };

  return (
    <Screen>
      <FlatList<ListingResult>
        data={recent.data ?? []}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => <ListingCard listing={item} width={cardWidth} />}
        columnWrapperStyle={[styles.column, { gap }]}
        ItemSeparatorComponent={() => <View style={{ height: gap + 4 }} />}
        ListHeaderComponent={header}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={recent.isRefetching}
            onRefresh={() => void recent.refetch()}
            tintColor={colors.violet}
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.huge },
  header: { gap: spacing.lg, paddingBottom: spacing.lg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenPadding - spacing.md + 2,
    paddingTop: spacing.xs,
  },
  avatar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  padded: { paddingHorizontal: screenPadding },
  categories: { paddingHorizontal: screenPadding - spacing.xs, gap: spacing.xs },
  section: { gap: spacing.md, marginTop: spacing.xs },
  recentHeader: { marginTop: spacing.sm },
  column: { paddingHorizontal: screenPadding },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: screenPadding, rowGap: spacing.xl },
});
