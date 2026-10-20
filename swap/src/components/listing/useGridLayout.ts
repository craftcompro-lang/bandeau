import { useWindowDimensions } from 'react-native';

import { screenPadding, spacing } from '@/theme';

export const GRID_GAP = spacing.lg;

/** Largeur des cartes pour une grille à deux colonnes alignée sur les marges d'écran. */
export function useGridLayout(columns = 2) {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 640) - screenPadding * 2;
  const cardWidth = Math.floor((contentWidth - GRID_GAP * (columns - 1)) / columns);
  return { cardWidth, gap: GRID_GAP, columns };
}
