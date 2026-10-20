/**
 * Palette SWAP — source : charte graphique officielle (docs/brand/charte-swap.png).
 * Les six couleurs de base sont officielles. Toutes les autres teintes sont
 * dérivées de ces six couleurs (mélanges calculés) pour les états interactifs
 * et l'accessibilité. Ne pas ajouter de couleur hors palette.
 */
export const brand = {
  violet: '#7A4DFF', // Violet principal — actions et identité
  coral: '#FF6B5B', // Corail accent — échanges et CTA
  night: '#0F172A', // Bleu nuit — titres et surfaces sombres
  blush: '#FDE8E6', // Rose pâle — surfaces secondaires
  mist: '#F4F5F8', // Gris clair — fonds et séparateurs
  white: '#FFFFFF', // Blanc — surfaces principales
} as const;

export const colors = {
  ...brand,

  // Violet dérivé (mélange avec bleu nuit / blanc)
  violetPressed: '#6F48EA', // violet + 10 % bleu nuit — contraste blanc 5.5:1
  violetSoft: '#F2EDFF', // violet + 90 % blanc — fonds d'éléments actifs
  violetSubtle: '#E4DBFF', // violet + 80 % blanc — bordures actives

  // Corail dérivé
  // Le corail officiel n'offre que 2.8:1 avec du texte blanc : pour les fonds de
  // boutons portant du texte, on utilise une teinte approfondie (3.85:1, texte gras 17 px).
  coralStrong: '#E9483C',
  coralPressed: '#DE3E32',
  coralSoft: '#FFF0EF', // corail + 90 % blanc

  // Neutres dérivés du bleu nuit (mélange avec blanc)
  ink: '#0F172A', // texte principal — 17.9:1
  inkSecondary: '#636875', // texte secondaire — 5.6:1 sur blanc
  inkTertiary: '#7B7F8A', // légendes, placeholders — 4.0:1 sur blanc
  inkDisabled: '#B7B9BF',
  border: '#E7E8ED',
  borderStrong: '#DBDCDF',
  surface: '#FFFFFF',
  background: '#FFFFFF',
  backgroundMuted: '#F4F5F8',
  overlay: 'rgba(15, 23, 42, 0.48)',

  // États (dérivés de la palette, pas de vert/orange hors charte)
  success: '#7A4DFF', // les confirmations restent dans l'identité violette
  danger: '#DE3E32',
  dangerSoft: '#FFF0EF',
} as const;

export type ColorToken = keyof typeof colors;
