import { z } from 'zod';

import { getCategoryLabel } from './categories';
import { distanceKm } from './geo';
import {
  approxCoordsSchema,
  categoryIdSchema,
  conditionSchema,
  type Listing,
} from './listing';

export const SORT_OPTIONS = {
  recent: 'Plus récents',
  oldest: 'Plus anciens',
  distance: 'Plus proches',
} as const;
export type SortOption = keyof typeof SORT_OPTIONS;

export const listingQuerySchema = z.object({
  text: z.string().trim().max(100).default(''),
  categoryIds: z.array(categoryIdSchema).default([]),
  conditions: z.array(conditionSchema).default([]),
  origin: approxCoordsSchema.nullable().default(null),
  maxDistanceKm: z.number().positive().max(1000).nullable().default(null),
  sort: z.enum(['recent', 'oldest', 'distance']).default('recent'),
  excludeOwnerId: z.string().nullable().default(null),
  limit: z.number().int().positive().max(100).default(60),
});
export type ListingQuery = z.infer<typeof listingQuerySchema>;
export type ListingQueryInput = z.input<typeof listingQuerySchema>;

export type ListingResult = Listing & { distanceKm: number | null };

/** Minuscules, sans accents, espaces normalisés. */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function searchableText(listing: Listing): string {
  return normalizeText(
    [
      listing.title,
      listing.brand ?? '',
      listing.size ?? '',
      listing.description,
      getCategoryLabel(listing.categoryId),
      listing.city,
    ].join(' '),
  );
}

/**
 * Filtre et trie des annonces. Sert à la fois au mode démo et de spécification
 * pour la requête serveur (phase 2) : mêmes règles, mêmes résultats.
 */
export function searchListings(listings: readonly Listing[], input: ListingQueryInput): ListingResult[] {
  const query = listingQuerySchema.parse(input);
  const tokens = normalizeText(query.text).split(' ').filter(Boolean);

  const results: ListingResult[] = [];
  for (const listing of listings) {
    if (listing.status !== 'active') continue;
    if (query.excludeOwnerId && listing.owner.id === query.excludeOwnerId) continue;
    if (query.categoryIds.length && !query.categoryIds.includes(listing.categoryId)) continue;
    if (query.conditions.length && !query.conditions.includes(listing.condition)) continue;

    if (tokens.length) {
      const haystack = searchableText(listing);
      if (!tokens.every((t) => haystack.includes(t))) continue;
    }

    const distance = query.origin && listing.coords ? distanceKm(query.origin, listing.coords) : null;
    if (query.maxDistanceKm !== null) {
      // Sans position connue, un filtre de distance ne peut pas être appliqué honnêtement.
      if (distance === null || distance > query.maxDistanceKm) continue;
    }
    results.push({ ...listing, distanceKm: distance });
  }

  const byDate = (a: ListingResult, b: ListingResult) => b.createdAt.localeCompare(a.createdAt);
  switch (query.sort) {
    case 'recent':
      results.sort(byDate);
      break;
    case 'oldest':
      results.sort((a, b) => -byDate(a, b));
      break;
    case 'distance':
      results.sort((a, b) => {
        if (a.distanceKm === null && b.distanceKm === null) return byDate(a, b);
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
      break;
  }
  return results.slice(0, query.limit);
}
