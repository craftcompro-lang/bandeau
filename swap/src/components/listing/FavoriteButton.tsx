import { Heart } from 'lucide-react-native';

import { useFavorites, useIsFavorite } from '@/stores/favorites';

import { IconButton } from '../ui/IconButton';

type Props = { listingId: string; title: string; variant?: 'surface' | 'soft'; size?: number };

export function FavoriteButton({ listingId, title, variant = 'surface', size = 32 }: Props) {
  const isFavorite = useIsFavorite(listingId);
  const toggle = useFavorites((s) => s.toggle);
  return (
    <IconButton
      icon={Heart}
      variant={variant}
      size={size}
      color={isFavorite ? 'coral' : 'ink'}
      filled={isFavorite}
      onPress={() => toggle(listingId)}
      accessibilityLabel={isFavorite ? `Retirer ${title} des favoris` : `Ajouter ${title} aux favoris`}
    />
  );
}
