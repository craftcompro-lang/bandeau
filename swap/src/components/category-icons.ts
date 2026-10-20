import {
  Baby,
  BookOpen,
  Dumbbell,
  Footprints,
  Gamepad2,
  LayoutGrid,
  type LucideIcon,
  Shirt,
  Smartphone,
  Sofa,
  Watch,
} from 'lucide-react-native';

import type { CategoryId } from '@/domain/categories';

export const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  mode: Shirt,
  sneakers: Footprints,
  tech: Smartphone,
  'jeux-video': Gamepad2,
  maison: Sofa,
  sport: Dumbbell,
  livres: BookOpen,
  enfants: Baby,
  accessoires: Watch,
};

export const ALL_CATEGORIES_ICON: LucideIcon = LayoutGrid;
