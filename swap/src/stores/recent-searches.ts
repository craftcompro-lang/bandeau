import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const MAX_RECENT = 8;

type RecentSearchesState = {
  items: string[];
  add: (term: string) => void;
  remove: (term: string) => void;
  clear: () => void;
};

/** Recherches récentes, stockées uniquement sur l'appareil. */
export const useRecentSearches = create<RecentSearchesState>()(
  persist(
    (set) => ({
      items: [],
      add: (term) => {
        const clean = term.trim();
        if (clean.length < 2) return;
        set((state) => ({
          items: [clean, ...state.items.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, MAX_RECENT),
        }));
      },
      remove: (term) => set((state) => ({ items: state.items.filter((t) => t !== term) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'swap.recent-searches.v1', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
