# Logo SWAP — fichiers officiels

Les SVG de ce dossier sont les **fichiers vectoriels officiels** de la marque. Ils sont
affichés dans l'app via `react-native-svg` (net à toutes les tailles).

| Fichier | Usage |
| --- | --- |
| `logo-couleur.svg` | Logo principal — lettres bleu nuit, flèches violet/corail — **fond clair** |
| `logo-sombre.svg` | Logo — lettres blanches, flèches violet/corail — **fond foncé** |
| `logo-encre.svg` | Monochrome bleu nuit |
| `logo-blanc.svg` | Monochrome blanc |
| `symbole-*.svg` | Symbole seul (S fléché), mêmes déclinaisons |

Dans le code : `<Logo tone="couleur" height={30} />`, `<Logo kind="symbole" tone="sombre" … />`,
ou `<LogoWithSignature height={48} />` (logo + « ÉCHANGE AUJOURD’HUI / MEILLEUR DEMAIN »
composé en Montserrat).

## Mettre à jour un logo

1. Remplacer le SVG dans ce dossier (même nom).
2. Lancer `npm run brand:build` (régénère `src/components/brand/svg-sources.ts`).

## Icônes d'application (dossier `assets/`)

Générées depuis les SVG officiels :
- `icon.png` — symbole « sombre » sur fond bleu nuit #0F172A (icône principale de la charte)
- `android-icon-foreground.png` / `android-icon-monochrome.png` — icône adaptative Android
- `splash-icon.png` — symbole « couleur » sur l'écran de démarrage blanc
- `favicon.png` — version web
