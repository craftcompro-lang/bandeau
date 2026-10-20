import type { ApproxCoords } from './listing';

const EARTH_RADIUS_KM = 6371;

/** Distance orthodromique (formule de haversine), en kilomètres. */
export function distanceKm(a: ApproxCoords, b: ApproxCoords): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Arrondit une position à ~1 km pour ne jamais manipuler de position précise. */
export function approximate(coords: ApproxCoords): ApproxCoords {
  return { lat: Math.round(coords.lat * 100) / 100, lng: Math.round(coords.lng * 100) / 100 };
}

/**
 * Libellé de distance honnête : les positions sont arrondies à ~1 km,
 * donc on n'affiche jamais de précision inférieure.
 */
export function formatDistance(km: number): string {
  if (km < 1.5) return 'à moins de 2 km';
  if (km < 10) return `à ${Math.round(km)} km`;
  if (km < 100) return `à ${Math.round(km / 5) * 5} km`;
  return `à ${Math.round(km / 10) * 10} km`;
}
