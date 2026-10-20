import { useLocalSearchParams } from 'expo-router';
import { Clock, SearchX, SlidersHorizontal, X } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, Pressable, ScrollView, StyleSheet, View, type TextInputInstance } from 'react-native';

import { CATEGORY_ICONS } from '@/components/category-icons';
import { DemoBanner } from '@/components/layout/DemoBanner';
import { Screen } from '@/components/layout/Screen';
import { countActiveFilters, DEFAULT_FILTERS, FiltersSheet, type Filters } from '@/components/listing/FiltersSheet';
import { ListingCard, ListingCardSkeleton } from '@/components/listing/ListingCard';
import { useGridLayout } from '@/components/listing/useGridLayout';
import { AppText, Chip, ErrorView, SearchField, StateView } from '@/components/ui';
import { CATEGORIES, CATEGORY_IDS, type CategoryId } from '@/domain/categories';
import { normalizeText, type ListingResult } from '@/domain/search';
import { useListingSearch } from '@/features/listings/hooks';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useLocation } from '@/stores/location';
import { useRecentSearches } from '@/stores/recent-searches';
import { colors, screenPadding, spacing } from '@/theme';

const isCategoryId = (v: unknown): v is CategoryId => typeof v === 'string' && (CATEGORY_IDS as readonly string[]).includes(v);

export default function ExplorerScreen() {
  const params = useLocalSearchParams<{ focus?: string; category?: string }>();
  const inputRef = useRef<TextInputInstance>(null);
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const initialCategories = (category: unknown): CategoryId[] => (isCategoryId(category) ? [category] : []);
  const [categoryIds, setCategoryIds] = useState<CategoryId[]>(() => initialCategories(params.category));
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const debouncedText = useDebouncedValue(text);
  const origin = useLocation((s) => s.coords);
  const recentSearches = useRecentSearches();
  const { cardWidth, gap } = useGridLayout();

  // Navigation depuis l'Accueil : une nouvelle catégorie demandée remplace la sélection.
  const paramsKey = `${params.category ?? ''}|${params.focus ?? ''}`;
  const [lastParamsKey, setLastParamsKey] = useState(paramsKey);
  if (paramsKey !== lastParamsKey) {
    setLastParamsKey(paramsKey);
    if (isCategoryId(params.category) || params.focus === undefined) setCategoryIds(initialCategories(params.category));
  }
  useEffect(() => {
    if (params.focus === '1') {
      const id = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(id);
    }
  }, [params.focus]);

  const query = useListingSearch({
    text: debouncedText,
    categoryIds,
    conditions: filters.conditions,
    origin,
    maxDistanceKm: origin ? filters.maxDistanceKm : null,
    sort: filters.sort === 'distance' && !origin ? 'recent' : filters.sort,
  });

  const categorySuggestions = useMemo(() => {
    const n = normalizeText(text);
    if (n.length < 2) return [];
    return CATEGORIES.filter((c) => normalizeText(c.label).includes(n) && !categoryIds.includes(c.id));
  }, [text, categoryIds]);

  const toggleCategory = (id: CategoryId) =>
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const submit = () => {
    recentSearches.add(text);
    Keyboard.dismiss();
  };

  const activeFilters = countActiveFilters(filters);
  const showSuggestions = focused && (text.length === 0 ? recentSearches.items.length > 0 : categorySuggestions.length > 0);
  const results = query.data ?? [];

  const header = (
    <View style={styles.header}>
      <AppText variant="h1" accessibilityRole="header" style={styles.padded}>
        Explorer
      </AppText>
      <View style={styles.padded}>
        <SearchField
          ref={inputRef}
          value={text}
          onChangeText={setText}
          onClear={() => setText('')}
          onSubmitEditing={submit}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Rechercher un objet, une marque…"
        />
      </View>

      {showSuggestions ? (
        <View style={[styles.padded, styles.suggestions]}>
          {text.length === 0 ? (
            <>
              <View style={styles.suggestionsHeader}>
                <AppText variant="labelStrong">Recherches récentes</AppText>
                <Pressable onPress={recentSearches.clear} hitSlop={8} accessibilityRole="button">
                  <AppText variant="caption" color="violet">
                    Effacer
                  </AppText>
                </Pressable>
              </View>
              {recentSearches.items.map((term) => (
                <View key={term} style={styles.recentRow}>
                  <Pressable
                    style={styles.recentTerm}
                    onPress={() => setText(term)}
                    accessibilityRole="button"
                    accessibilityLabel={`Rechercher ${term}`}
                  >
                    <Clock size={16} color={colors.inkTertiary} />
                    <AppText variant="callout" numberOfLines={1} style={styles.flex}>
                      {term}
                    </AppText>
                  </Pressable>
                  <Pressable
                    onPress={() => recentSearches.remove(term)}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={`Supprimer ${term} des recherches récentes`}
                  >
                    <X size={16} color={colors.inkTertiary} />
                  </Pressable>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.wrap}>
              {categorySuggestions.map((c) => (
                <Chip
                  key={c.id}
                  label={`Catégorie : ${c.label}`}
                  icon={CATEGORY_ICONS[c.id]}
                  onPress={() => {
                    toggleCategory(c.id);
                    setText('');
                  }}
                />
              ))}
            </View>
          )}
        </View>
      ) : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} keyboardShouldPersistTaps="handled">
        <Chip
          label={activeFilters ? `Filtres · ${activeFilters}` : 'Filtres'}
          icon={SlidersHorizontal}
          selected={activeFilters > 0}
          onPress={() => setFiltersOpen(true)}
        />
        {CATEGORIES.map((c) => (
          <Chip key={c.id} label={c.label} selected={categoryIds.includes(c.id)} onPress={() => toggleCategory(c.id)} />
        ))}
      </ScrollView>

      <View style={styles.padded}>
        <DemoBanner />
      </View>

      {query.isSuccess ? (
        <AppText variant="caption" color="inkSecondary" style={styles.padded} accessibilityLiveRegion="polite">
          {results.length === 0 ? 'Aucun résultat' : `${results.length} objet${results.length > 1 ? 's' : ''}`}
        </AppText>
      ) : null}
    </View>
  );

  const renderEmpty = () => {
    if (query.isPending) {
      return (
        <View style={[styles.skeletonGrid, { gap }]}>
          {[0, 1, 2, 3].map((i) => (
            <ListingCardSkeleton key={i} width={cardWidth} />
          ))}
        </View>
      );
    }
    if (query.isError) return <ErrorView error={query.error} onRetry={() => void query.refetch()} compact />;
    return (
      <StateView
        icon={SearchX}
        compact
        title="Aucun objet trouvé"
        message="Essaie un autre mot-clé ou retire quelques filtres."
        actionLabel={activeFilters || categoryIds.length || text ? 'Tout effacer' : undefined}
        onAction={() => {
          setText('');
          setCategoryIds([]);
          setFilters(DEFAULT_FILTERS);
        }}
      />
    );
  };

  return (
    <Screen>
      <FlatList<ListingResult>
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => <ListingCard listing={item} width={cardWidth} />}
        columnWrapperStyle={[styles.padded, { gap }]}
        ItemSeparatorComponent={() => <View style={{ height: gap + 4 }} />}
        ListHeaderComponent={header}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />
      <FiltersSheet
        visible={filtersOpen}
        value={filters}
        onChange={setFilters}
        onClose={() => setFiltersOpen(false)}
        resultCount={query.isSuccess ? results.length : null}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.huge },
  header: { gap: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.lg },
  padded: { paddingHorizontal: screenPadding },
  chips: { paddingHorizontal: screenPadding, gap: spacing.sm },
  suggestions: { gap: spacing.sm },
  suggestionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 40 },
  recentTerm: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 40 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  flex: { flex: 1 },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: screenPadding, rowGap: spacing.xl },
});
