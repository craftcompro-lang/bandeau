import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Favoris conservés sur l'appareil. En phase 2, ils seront synchronisés avec le
 * compte (table `favorites`) une fois l'utilisateur connecté.
 */
type FavoritesState = {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
};

export const useFavorites = create<FavoritesState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id) ? state.ids.filter((x) => x !== id) : [id, ...state.ids],
        })),
      clear: () => set({ ids: [] }),
    }),
    { name: 'swap.favorites.v1', storage: createJSONStorage(() => AsyncStorage) },
  ),
);

export const useIsFavorite = (id: string) => useFavorites((s) => s.ids.includes(id));
