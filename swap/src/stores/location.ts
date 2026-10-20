import * as Location from 'expo-location';
import { create } from 'zustand';

import { approximate } from '@/domain/geo';
import type { ApproxCoords } from '@/domain/listing';

export type LocationStatus = 'unknown' | 'requesting' | 'granted' | 'denied' | 'unavailable';

type LocationState = {
  status: LocationStatus;
  /** Position arrondie à ~1 km, gardée en mémoire uniquement (jamais stockée ni envoyée). */
  coords: ApproxCoords | null;
  /** Vérifie l'autorisation existante sans afficher de demande. */
  refresh: () => Promise<void>;
  /** Demande l'autorisation (action explicite de l'utilisateur). */
  request: () => Promise<void>;
};

async function readPosition(): Promise<ApproxCoords | null> {
  const last = await Location.getLastKnownPositionAsync({ maxAge: 10 * 60_000 });
  const position =
    last ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }).catch(() => null));
  if (!position) return null;
  return approximate({ lat: position.coords.latitude, lng: position.coords.longitude });
}

export const useLocation = create<LocationState>()((set, get) => ({
  status: 'unknown',
  coords: null,
  refresh: async () => {
    try {
      const permission = await Location.getForegroundPermissionsAsync();
      if (!permission.granted) {
        set({ status: permission.canAskAgain ? 'unknown' : 'denied' });
        return;
      }
      const coords = await readPosition();
      set({ status: coords ? 'granted' : 'unavailable', coords });
    } catch {
      set({ status: 'unavailable' });
    }
  },
  request: async () => {
    if (get().status === 'requesting') return;
    set({ status: 'requesting' });
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        set({ status: 'denied', coords: null });
        return;
      }
      const coords = await readPosition();
      set({ status: coords ? 'granted' : 'unavailable', coords });
    } catch {
      set({ status: 'unavailable' });
    }
  },
}));
