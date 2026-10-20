/**
 * ⚠️ DONNÉES FICTIVES DE DÉMONSTRATION.
 * Utilisées uniquement quand EXPO_PUBLIC_DATA_MODE=demo (ou sans Supabase configuré).
 * Toujours signalées à l'écran (bandeau "Démo" + mention sur chaque fiche).
 * Jamais importées dans l'environnement de production.
 *
 * Aucune vérification d'identité, note ou échange terminé n'est inventé :
 * ces valeurs restent à zéro / non vérifiées.
 */
import type { Listing, OwnerSummary } from '@/domain/listing';

export const DEMO_CURRENT_USER_ID = 'demo-me';

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString();

const owner = (id: string, username: string, memberSince: string): OwnerSummary => ({
  id,
  username,
  avatarUrl: null,
  identityVerified: false,
  completedExchanges: 0,
  ratingAverage: null,
  ratingCount: 0,
  memberSince,
});

const me = owner(DEMO_CURRENT_USER_ID, 'toi (démo)', '2026-10-01');
const lea = owner('demo-lea', 'lea.m', '2026-09-12');
const karim = owner('demo-karim', 'karim_92', '2026-08-30');
const sofia = owner('demo-sofia', 'sofia.tr', '2026-09-03');
const hugo = owner('demo-hugo', 'hugo.lyon', '2026-07-21');
const ines = owner('demo-ines', 'ines_b', '2026-10-02');
const maxime = owner('demo-maxime', 'maxime.b', '2026-06-18');

type DemoInput = Omit<Listing, 'photos' | 'status' | 'isDemo' | 'createdAt' | 'brand' | 'size' | 'coords'> & {
  hoursAgo: number;
  brand?: string;
  size?: string;
  coords?: { lat: number; lng: number };
};

const make = ({ hoursAgo: h, brand, size, coords, ...rest }: DemoInput): Listing => ({
  ...rest,
  brand: brand ?? null,
  size: size ?? null,
  coords: coords ?? null,
  photos: [],
  status: 'active',
  createdAt: hoursAgo(h),
  isDemo: true,
});

export const DEMO_LISTINGS: Listing[] = [
  make({
    id: 'demo-1',
    title: 'Baskets Nike Air Force 1',
    description: 'Portées une dizaine de fois, semelle propre. Boîte d’origine incluse.',
    categoryId: 'sneakers',
    condition: 'very_good',
    brand: 'Nike',
    size: '42',
    city: 'Paris 11e',
    coords: { lat: 48.86, lng: 2.38 },
    wantedCategoryIds: ['tech', 'jeux-video'],
    owner: lea,
    hoursAgo: 2,
  }),
  make({
    id: 'demo-2',
    title: 'Appareil photo Sony Alpha 6000',
    description: 'Boîtier + objectif 16-50 mm, deux batteries et chargeur. Quelques traces d’usage sur la coque.',
    categoryId: 'tech',
    condition: 'good',
    brand: 'Sony',
    city: 'Paris 18e',
    coords: { lat: 48.89, lng: 2.35 },
    wantedCategoryIds: ['mode', 'sneakers'],
    owner: karim,
    hoursAgo: 5,
  }),
  make({
    id: 'demo-3',
    title: 'Doudoune The North Face Nuptse',
    description: 'Taille M, noire. Très chaude, aucun accroc. Lavée récemment.',
    categoryId: 'mode',
    condition: 'very_good',
    brand: 'The North Face',
    size: 'M',
    city: 'Paris 15e',
    coords: { lat: 48.84, lng: 2.29 },
    wantedCategoryIds: ['sneakers', 'accessoires'],
    owner: sofia,
    hoursAgo: 9,
  }),
  make({
    id: 'demo-4',
    title: 'Casque Sony WH-1000XM4',
    description: 'Réduction de bruit parfaite, housse et câble fournis. Coussinets en bon état.',
    categoryId: 'tech',
    condition: 'very_good',
    brand: 'Sony',
    city: 'Montreuil',
    coords: { lat: 48.86, lng: 2.44 },
    wantedCategoryIds: ['mode'],
    owner: ines,
    hoursAgo: 14,
  }),
  make({
    id: 'demo-5',
    title: 'Baskets New Balance 530',
    description: 'Blanc et argent, pointure 42. Très peu portées.',
    categoryId: 'sneakers',
    condition: 'very_good',
    brand: 'New Balance',
    size: '42',
    city: 'Boulogne-Billancourt',
    coords: { lat: 48.84, lng: 2.24 },
    wantedCategoryIds: ['tech'],
    owner: lea,
    hoursAgo: 20,
  }),
  make({
    id: 'demo-6',
    title: 'Nintendo Switch OLED',
    description: 'Console + dock + 2 Joy-Con. Écran sans rayure, protection posée dès l’achat.',
    categoryId: 'jeux-video',
    condition: 'good',
    brand: 'Nintendo',
    city: 'Lyon 3e',
    coords: { lat: 45.76, lng: 4.85 },
    wantedCategoryIds: ['tech', 'sport'],
    owner: hugo,
    hoursAgo: 26,
  }),
  make({
    id: 'demo-7',
    title: 'Lampe de bureau en laiton',
    description: 'Style années 70, ampoule E27. Fonctionne parfaitement.',
    categoryId: 'maison',
    condition: 'very_good',
    city: 'Bordeaux',
    coords: { lat: 44.84, lng: -0.58 },
    wantedCategoryIds: ['livres', 'maison'],
    owner: maxime,
    hoursAgo: 31,
  }),
  make({
    id: 'demo-8',
    title: 'Raquette de padel Bullpadel',
    description: 'Utilisée une saison, aucun choc sur le cadre. Housse incluse.',
    categoryId: 'sport',
    condition: 'good',
    brand: 'Bullpadel',
    city: 'Marseille 8e',
    coords: { lat: 43.26, lng: 5.38 },
    wantedCategoryIds: ['sneakers'],
    owner: karim,
    hoursAgo: 40,
  }),
  make({
    id: 'demo-9',
    title: 'Lot de 5 romans de poche',
    description: 'Collection Folio, bon état général. Liste des titres sur demande.',
    categoryId: 'livres',
    condition: 'good',
    city: 'Nantes',
    coords: { lat: 47.22, lng: -1.55 },
    wantedCategoryIds: ['livres', 'enfants'],
    owner: sofia,
    hoursAgo: 52,
  }),
  make({
    id: 'demo-10',
    title: 'Poussette compacte pliable',
    description: 'Pliage en une main, tient en cabine. Habillage pluie fourni.',
    categoryId: 'enfants',
    condition: 'good',
    city: 'Lille',
    coords: { lat: 50.63, lng: 3.06 },
    wantedCategoryIds: ['maison'],
    owner: ines,
    hoursAgo: 61,
  }),
  make({
    id: 'demo-11',
    title: 'Montre Casio vintage A168',
    description: 'Bracelet acier, rétroéclairage fonctionnel. Pile changée en septembre.',
    categoryId: 'accessoires',
    condition: 'very_good',
    brand: 'Casio',
    city: 'Paris 10e',
    coords: { lat: 48.87, lng: 2.36 },
    wantedCategoryIds: ['mode'],
    owner: maxime,
    hoursAgo: 75,
  }),
  make({
    id: 'demo-12',
    title: 'Veste en jean Levi’s',
    description: 'Coupe Trucker, taille L. Délavage clair.',
    categoryId: 'mode',
    condition: 'good',
    brand: 'Levi’s',
    size: 'L',
    city: 'Toulouse',
    coords: { lat: 43.6, lng: 1.44 },
    wantedCategoryIds: ['sneakers', 'accessoires'],
    owner: hugo,
    hoursAgo: 90,
  }),
  // Objets de l'utilisateur de démonstration
  make({
    id: 'demo-me-1',
    title: 'iPhone 14',
    description: '128 Go, violet. Batterie à 88 %. Toujours protégé par une coque.',
    categoryId: 'tech',
    condition: 'good',
    brand: 'Apple',
    city: 'Paris 11e',
    coords: { lat: 48.86, lng: 2.38 },
    wantedCategoryIds: ['sneakers', 'mode'],
    owner: me,
    hoursAgo: 30,
  }),
  make({
    id: 'demo-me-2',
    title: 'Manette PS5 DualSense',
    description: 'Blanche, aucun drift. Câble USB-C fourni.',
    categoryId: 'jeux-video',
    condition: 'very_good',
    brand: 'Sony',
    city: 'Paris 11e',
    coords: { lat: 48.86, lng: 2.38 },
    wantedCategoryIds: ['sport', 'sneakers'],
    owner: me,
    hoursAgo: 48,
  }),
];
