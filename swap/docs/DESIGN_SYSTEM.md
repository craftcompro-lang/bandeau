# Design system SWAP

Source : charte officielle (`docs/brand/charte-swap.png`). Code : `src/theme/` et `src/components/ui/`.

## Couleurs

| Token | Valeur | Usage |
| --- | --- | --- |
| `violet` | #7A4DFF | Actions principales, onglet actif, sélection |
| `coral` | #FF6B5B | Accents d’échange (pastille ⇄, icônes, favoris) |
| `coralStrong` | #E9483C | Fond des boutons d’échange portant du texte |
| `night` / `ink` | #0F172A | Titres, texte principal |
| `blush` | #FDE8E6 | Surfaces secondaires (bandeau démo) |
| `mist` | #F4F5F8 | Fonds de champs, tuiles, séparateurs |
| `white` | #FFFFFF | Surfaces principales |

Teintes dérivées (mélanges de la palette, aucune couleur externe) : `violetPressed`, `violetSoft`,
`coralPressed`, `coralSoft`, `inkSecondary` (5,6:1), `inkTertiary` (4,0:1), `border`.

### Décisions d’accessibilité
- Le corail officiel n’atteint que **2,8:1** avec du texte blanc. Les boutons d’échange utilisent
  `coralStrong` (3,85:1, libellé gras 17 px). Pour viser 4,5:1 strict, utiliser `#D93A2F`.
- Le violet officiel atteint 4,85:1 avec le blanc : conforme AA.
- Onglet actif en **violet** (règle « violet = fonctionnalités principales »), bouton central
  « Publier » en corail (action liée à l’échange), comme sur la maquette.
- Boutons désactivés : fond gris clair + texte gris foncé (lisible), jamais texte blanc sur gris.

## Typographie — Montserrat uniquement

| Variante | Graisse | Taille / interligne |
| --- | --- | --- |
| `display` | Bold | 32 / 40 |
| `h1` | Bold | 26 / 32 |
| `h2` | SemiBold | 20 / 26 |
| `h3` | SemiBold | 17 / 22 |
| `body` | Regular | 16 / 24 |
| `callout` | Regular | 15 / 22 |
| `label` / `labelStrong` | Medium / SemiBold | 14 / 20 |
| `caption` | Medium | 13 / 18 |
| `footnote` | Regular | 12 / 16 |
| `micro` | Medium | 11 / 14 |
| `button` | Bold | 17 / 22 |

Le texte suit la taille de police du téléphone (plafonnée à ×1,35 pour préserver la mise en page).

## Espacements, rayons, tailles

- Grille de 4 pt : 4, 8, 12, 16, 20, 24, 32, 40. Marge d’écran : 20.
- Rayons : 6, 10, 14 (cartes), 18, 24 (feuilles), pilule.
- Boutons : 54 (grand), 46, 36. Cibles tactiles ≥ 44 pt.

## Composants

`AppText`, `Button` (primary / exchange / secondary / ghost / danger), `IconButton`, `Chip`,
`CategoryTile`, `Badge`, `Avatar`, `SearchField` / `SearchLauncher`, `SectionHeader`,
`StateView` / `ErrorView`, `Skeleton`, `Divider`, `PressableScale` (compression + haptique),
`Sheet` (feuille modale), `ScreenHeader`, `Screen`, `TabBar`, `Logo`.

Annonces et échanges : `ListingCard`, `ListingGrid`, `ListingPhoto`, `FavoriteButton`,
`OwnerCard`, `ExchangeItemCard`, `SwapBadge`, `ProtectTimeline`.

## États obligatoires de chaque écran
Chargement (squelettes), vide, erreur réseau (avec « Réessayer »), refus d’autorisation
(localisation), non connecté, actions désactivées. Aucun bouton sans effet.
