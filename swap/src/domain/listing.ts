import { z } from 'zod';

import { CATEGORY_IDS } from './categories';

export const CONDITIONS = {
  new_with_tags: 'Neuf avec étiquette',
  new: 'Neuf sans étiquette',
  very_good: 'Très bon état',
  good: 'Bon état',
  fair: 'État correct',
} as const;

export type Condition = keyof typeof CONDITIONS;
export const CONDITION_IDS = Object.keys(CONDITIONS) as Condition[];

export const categoryIdSchema = z.enum(CATEGORY_IDS);
export const conditionSchema = z.enum(CONDITION_IDS as [Condition, ...Condition[]]);

/** Coordonnées volontairement approximatives (arrondies ~1 km) : jamais l'adresse exacte. */
export const approxCoordsSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
export type ApproxCoords = z.infer<typeof approxCoordsSchema>;

export const ownerSummarySchema = z.object({
  id: z.string().min(1),
  username: z.string().min(2).max(30),
  avatarUrl: z.string().url().nullable(),
  /** Uniquement vrai si un prestataire d'identité l'a confirmé côté serveur. */
  identityVerified: z.boolean(),
  completedExchanges: z.number().int().nonnegative(),
  ratingAverage: z.number().min(1).max(5).nullable(),
  ratingCount: z.number().int().nonnegative(),
  memberSince: z.string(),
});
export type OwnerSummary = z.infer<typeof ownerSummarySchema>;

export const listingPhotoSchema = z.object({
  url: z.string().url(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export const LISTING_STATUSES = ['draft', 'active', 'reserved', 'exchanged', 'archived'] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const listingSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(3).max(80),
  description: z.string().trim().max(2000),
  categoryId: categoryIdSchema,
  condition: conditionSchema,
  brand: z.string().trim().max(40).nullable(),
  size: z.string().trim().max(20).nullable(),
  photos: z.array(listingPhotoSchema).max(8),
  city: z.string().trim().min(1).max(60),
  coords: approxCoordsSchema.nullable(),
  wantedCategoryIds: z.array(categoryIdSchema).max(5),
  status: z.enum(LISTING_STATUSES),
  createdAt: z.string(),
  owner: ownerSummarySchema,
  /** Vrai pour les données fictives de démonstration — toujours signalé à l'écran. */
  isDemo: z.boolean(),
});
export type Listing = z.infer<typeof listingSchema>;
