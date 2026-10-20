/**
 * Catégories d'objets. En phase 2, la liste fait foi côté serveur
 * (table `categories`, administrable) ; ces identifiants restent stables.
 */
export const CATEGORY_IDS = [
  'mode',
  'sneakers',
  'tech',
  'jeux-video',
  'maison',
  'sport',
  'livres',
  'enfants',
  'accessoires',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export type Category = {
  id: CategoryId;
  label: string;
};

export const CATEGORIES: readonly Category[] = [
  { id: 'mode', label: 'Mode' },
  { id: 'sneakers', label: 'Sneakers' },
  { id: 'tech', label: 'Tech' },
  { id: 'jeux-video', label: 'Jeux vidéo' },
  { id: 'maison', label: 'Maison' },
  { id: 'sport', label: 'Sport' },
  { id: 'livres', label: 'Livres' },
  { id: 'enfants', label: 'Enfants' },
  { id: 'accessoires', label: 'Accessoires' },
];

const byId = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategoryLabel(id: CategoryId): string {
  return byId.get(id)?.label ?? id;
}
