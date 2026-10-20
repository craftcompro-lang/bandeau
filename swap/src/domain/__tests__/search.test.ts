import { DEMO_LISTINGS } from '@/data/demo/demo-data';

import { distanceKm, formatDistance } from '../geo';
import type { Listing } from '../listing';
import { normalizeText, searchListings } from '../search';

const paris = { lat: 48.86, lng: 2.35 };

describe('normalizeText', () => {
  it('ignore la casse, les accents et la ponctuation', () => {
    expect(normalizeText('  Écran — Très BON état ! ')).toBe('ecran tres bon etat');
  });
});

describe('searchListings', () => {
  it('trouve par marque sans tenir compte des accents ni de la casse', () => {
    const results = searchListings(DEMO_LISTINGS, { text: 'sony' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((l) => l.brand === 'Sony')).toBe(true);
  });

  it('exige que tous les mots soient présents', () => {
    expect(searchListings(DEMO_LISTINGS, { text: 'nike 42' }).map((l) => l.id)).toEqual(['demo-1']);
    expect(searchListings(DEMO_LISTINGS, { text: 'nike lampe' })).toHaveLength(0);
  });

  it('filtre par catégorie et par état', () => {
    const results = searchListings(DEMO_LISTINGS, { categoryIds: ['sneakers'], conditions: ['very_good'] });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((l) => l.categoryId === 'sneakers' && l.condition === 'very_good')).toBe(true);
  });

  it('exclut les annonces non actives et celles de l’utilisateur', () => {
    const archived: Listing = { ...DEMO_LISTINGS[0]!, id: 'archived', status: 'archived' };
    const results = searchListings([...DEMO_LISTINGS, archived], { excludeOwnerId: 'demo-me' });
    expect(results.find((l) => l.id === 'archived')).toBeUndefined();
    expect(results.find((l) => l.owner.id === 'demo-me')).toBeUndefined();
  });

  it('trie du plus récent au plus ancien et inversement', () => {
    const recent = searchListings(DEMO_LISTINGS, { sort: 'recent' });
    const oldest = searchListings(DEMO_LISTINGS, { sort: 'oldest' });
    expect(recent[0]!.createdAt >= recent[1]!.createdAt).toBe(true);
    expect(oldest.map((l) => l.id)).toEqual([...recent].reverse().map((l) => l.id));
  });

  it('ne calcule aucune distance sans position connue', () => {
    expect(searchListings(DEMO_LISTINGS, {}).every((l) => l.distanceKm === null)).toBe(true);
  });

  it('un filtre de distance sans position ne renvoie rien plutôt que des résultats faux', () => {
    expect(searchListings(DEMO_LISTINGS, { maxDistanceKm: 10 })).toHaveLength(0);
  });

  it('filtre par rayon et trie par distance', () => {
    const results = searchListings(DEMO_LISTINGS, { origin: paris, maxDistanceKm: 30, sort: 'distance' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((l) => l.distanceKm !== null && l.distanceKm <= 30)).toBe(true);
    for (let i = 1; i < results.length; i++) {
      expect(results[i]!.distanceKm!).toBeGreaterThanOrEqual(results[i - 1]!.distanceKm!);
    }
  });
});

describe('géographie', () => {
  it('calcule une distance Paris–Lyon cohérente', () => {
    expect(distanceKm(paris, { lat: 45.76, lng: 4.85 })).toBeGreaterThan(380);
    expect(distanceKm(paris, { lat: 45.76, lng: 4.85 })).toBeLessThan(400);
  });

  it("n'affiche jamais une précision inférieure à l'arrondi des positions", () => {
    expect(formatDistance(0.2)).toBe('à moins de 2 km');
    expect(formatDistance(7.4)).toBe('à 7 km');
    expect(formatDistance(392)).toBe('à 390 km');
  });
});
