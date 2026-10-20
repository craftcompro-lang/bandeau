import { dataMode } from '@/lib/env';
import type { Listing } from '@/domain/listing';
import { searchListings, type ListingQueryInput, type ListingResult } from '@/domain/search';

import { DEMO_CURRENT_USER_ID, DEMO_LISTINGS } from './demo/demo-data';

/**
 * Point d'accès unique aux annonces. Les écrans ne savent pas d'où viennent les
 * données : en phase 2, l'implémentation Supabase remplace la démo sans toucher à l'UI.
 */
export interface ListingsRepository {
  readonly isDemo: boolean;
  /** Identifiant de l'utilisateur courant, ou null si non connecté. */
  currentUserId(): string | null;
  search(query: ListingQueryInput): Promise<ListingResult[]>;
  getById(id: string): Promise<Listing | null>;
  listMine(): Promise<Listing[]>;
}

/** Latence simulée pour exercer les états de chargement en démo. */
const DEMO_LATENCY_MS = 350;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const demoRepository: ListingsRepository = {
  isDemo: true,
  currentUserId: () => DEMO_CURRENT_USER_ID,
  async search(query) {
    await wait(DEMO_LATENCY_MS);
    return searchListings(DEMO_LISTINGS, { excludeOwnerId: DEMO_CURRENT_USER_ID, ...query });
  },
  async getById(id) {
    await wait(DEMO_LATENCY_MS / 2);
    return DEMO_LISTINGS.find((l) => l.id === id) ?? null;
  },
  async listMine() {
    await wait(DEMO_LATENCY_MS / 2);
    return DEMO_LISTINGS.filter((l) => l.owner.id === DEMO_CURRENT_USER_ID && l.status === 'active');
  },
};

const NOT_CONNECTED = 'La connexion aux annonces réelles (Supabase) sera activée en phase 2.';

/** Placeholder explicite : échoue clairement plutôt que d'afficher de fausses données. */
const liveRepository: ListingsRepository = {
  isDemo: false,
  currentUserId: () => null,
  search: () => Promise.reject(new Error(NOT_CONNECTED)),
  getById: () => Promise.reject(new Error(NOT_CONNECTED)),
  listMine: () => Promise.reject(new Error(NOT_CONNECTED)),
};

export const listingsRepository: ListingsRepository = dataMode === 'demo' ? demoRepository : liveRepository;
