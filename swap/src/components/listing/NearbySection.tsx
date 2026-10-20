import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { MapPin, MapPinOff } from 'lucide-react-native';

import { useListingSearch } from '@/features/listings/hooks';
import { useLocation } from '@/stores/location';
import { colors, radii, screenPadding, spacing } from '@/theme';

import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { ListingCard, ListingCardSkeleton } from './ListingCard';

const NEARBY_RADIUS_KM = 30;
const CARD_WIDTH = 156;

/** « À proximité » : uniquement avec une position réelle autorisée par l'utilisateur. */
export function NearbySection() {
  const { status, coords, request } = useLocation();
  const query = useListingSearch(
    { origin: coords, maxDistanceKm: NEARBY_RADIUS_KM, sort: 'distance', limit: 10 },
    { enabled: status === 'granted' && coords !== null },
  );

  if (status !== 'granted' || !coords) {
    const denied = status === 'denied';
    return (
      <View style={styles.prompt}>
        <View style={styles.promptIcon}>
          {denied ? (
            <MapPinOff size={20} color={colors.violet} strokeWidth={2.2} />
          ) : (
            <MapPin size={20} color={colors.violet} strokeWidth={2.2} />
          )}
        </View>
        <View style={styles.promptText}>
          <AppText variant="labelStrong">
            {denied ? 'Localisation désactivée' : status === 'unavailable' ? 'Position indisponible' : 'Objets près de chez toi'}
          </AppText>
          <AppText variant="caption" color="inkSecondary">
            {denied
              ? 'Autorise la localisation dans les Réglages pour voir les objets proches.'
              : 'Ta position approximative sert uniquement à calculer les distances.'}
          </AppText>
        </View>
        <Button
          label={denied ? 'Réglages' : status === 'unavailable' ? 'Réessayer' : 'Activer'}
          size="sm"
          variant="primary"
          fullWidth={false}
          loading={status === 'requesting'}
          onPress={() => (denied ? void Linking.openSettings() : void request())}
        />
      </View>
    );
  }

  if (query.isPending) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {[0, 1, 2].map((i) => (
          <ListingCardSkeleton key={i} width={CARD_WIDTH} />
        ))}
      </ScrollView>
    );
  }

  const items = query.data ?? [];
  if (query.isError || items.length === 0) {
    return (
      <View style={styles.empty}>
        <AppText variant="caption" color="inkSecondary">
          {query.isError
            ? 'Impossible de charger les objets proches pour le moment.'
            : `Aucun objet dans un rayon de ${NEARBY_RADIUS_KM} km pour l’instant.`}
        </AppText>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.map((l) => (
        <ListingCard key={l.id} listing={l} width={CARD_WIDTH} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: screenPadding, gap: spacing.md },
  prompt: {
    marginHorizontal: screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.mist,
  },
  promptIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptText: { flex: 1, gap: 2 },
  empty: { paddingHorizontal: screenPadding },
});
