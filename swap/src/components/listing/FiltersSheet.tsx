import { StyleSheet, View } from 'react-native';

import { CONDITION_IDS, CONDITIONS, type Condition } from '@/domain/listing';
import { SORT_OPTIONS, type SortOption } from '@/domain/search';
import { useLocation } from '@/stores/location';
import { spacing } from '@/theme';

import { Sheet } from '../layout/Sheet';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';

export type Filters = {
  conditions: Condition[];
  maxDistanceKm: number | null;
  sort: SortOption;
};

export const DEFAULT_FILTERS: Filters = { conditions: [], maxDistanceKm: null, sort: 'recent' };
export const DISTANCE_OPTIONS = [5, 10, 30, 100] as const;

export function countActiveFilters(f: Filters) {
  return f.conditions.length + (f.maxDistanceKm !== null ? 1 : 0) + (f.sort !== 'recent' ? 1 : 0);
}

type Props = {
  visible: boolean;
  value: Filters;
  onChange: (next: Filters) => void;
  onClose: () => void;
  resultCount: number | null;
};

export function FiltersSheet({ visible, value, onChange, onClose, resultCount }: Props) {
  const { status, request } = useLocation();
  const hasLocation = status === 'granted';

  const toggleCondition = (c: Condition) =>
    onChange({
      ...value,
      conditions: value.conditions.includes(c) ? value.conditions.filter((x) => x !== c) : [...value.conditions, c],
    });

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Filtres"
      footer={
        <>
          <Button
            label="Réinitialiser"
            variant="secondary"
            size="md"
            style={styles.flex}
            onPress={() => onChange(DEFAULT_FILTERS)}
          />
          <Button
            label={resultCount === null ? 'Afficher' : `Afficher (${resultCount})`}
            size="md"
            style={styles.flex}
            onPress={onClose}
          />
        </>
      }
    >
      <View style={styles.group}>
        <AppText variant="h3">État</AppText>
        <View style={styles.wrap}>
          {CONDITION_IDS.map((c) => (
            <Chip key={c} label={CONDITIONS[c]} selected={value.conditions.includes(c)} onPress={() => toggleCondition(c)} />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <AppText variant="h3">Distance</AppText>
        {hasLocation ? (
          <View style={styles.wrap}>
            <Chip
              label="Partout"
              selected={value.maxDistanceKm === null}
              onPress={() => onChange({ ...value, maxDistanceKm: null })}
            />
            {DISTANCE_OPTIONS.map((km) => (
              <Chip
                key={km}
                label={`${km} km`}
                selected={value.maxDistanceKm === km}
                onPress={() => onChange({ ...value, maxDistanceKm: km })}
              />
            ))}
          </View>
        ) : (
          <View style={styles.locationOff}>
            <AppText variant="caption" color="inkSecondary" style={styles.flex}>
              {status === 'denied'
                ? 'Localisation refusée : autorise-la dans les Réglages pour filtrer par distance.'
                : 'Active ta localisation pour filtrer par distance.'}
            </AppText>
            {status !== 'denied' ? (
              <Button
                label="Activer"
                size="sm"
                fullWidth={false}
                loading={status === 'requesting'}
                onPress={() => void request()}
              />
            ) : null}
          </View>
        )}
      </View>

      <View style={styles.group}>
        <AppText variant="h3">Trier par</AppText>
        <View style={styles.wrap}>
          {(Object.keys(SORT_OPTIONS) as SortOption[])
            .filter((s) => s !== 'distance' || hasLocation)
            .map((s) => (
              <Chip key={s} label={SORT_OPTIONS[s]} selected={value.sort === s} onPress={() => onChange({ ...value, sort: s })} />
            ))}
        </View>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.md },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  locationOff: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
});
