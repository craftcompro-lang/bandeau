import { useQuery } from '@tanstack/react-query';

import { listingsRepository } from '@/data/listings-repository';
import type { ListingQueryInput } from '@/domain/search';

export const listingKeys = {
  all: ['listings'] as const,
  search: (query: ListingQueryInput) => ['listings', 'search', query] as const,
  detail: (id: string) => ['listings', 'detail', id] as const,
  mine: () => ['listings', 'mine'] as const,
};

export function useListingSearch(query: ListingQueryInput, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: listingKeys.search(query),
    queryFn: () => listingsRepository.search(query),
    enabled: options?.enabled ?? true,
    placeholderData: (previous) => previous,
  });
}

export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: listingKeys.detail(id ?? ''),
    queryFn: () => listingsRepository.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useMyListings() {
  return useQuery({
    queryKey: listingKeys.mine(),
    queryFn: () => listingsRepository.listMine(),
  });
}
