# Logo SWAP — emplacement des fichiers officiels

Les PNG de ce dossier sont des **extractions provisoires** de la charte officielle
(`docs/brand/charte-swap.png`) : la zone du logo est découpée et le fond retiré, sans aucun
redessin. Leur résolution est limitée par celle de la charte (~440 px de large pour le logo).

## Remplacer par les fichiers définitifs

Déposer les exports officiels **avec les mêmes noms**, fond transparent, en PNG ≥ 3× la taille
d’affichage (idéalement 1200 px de large) :

| Fichier | Contenu attendu |
| --- | --- |
| `swap-wordmark.png` | Logo horizontal, version principale (sans signature) |
| `swap-logo-baseline.png` | Logo + signature « ÉCHANGE AUJOURD’HUI, MEILLEUR DEMAIN » |
| `swap-symbol.png` | Symbole seul (S fléché) |
| `swap-wordmark-on-dark.png` | Version pour fond sombre |
| `swap-wordmark-mono.png` | Version monochrome bleu nuit |
| `swap-wordmark-white.png` | Version monochrome blanche |

Si les proportions changent, mettre à jour les ratios dans `src/components/brand/Logo.tsx`.

Icônes d’application (dossier `assets/`) : `icon.png` (1024×1024, sans transparence),
`android-icon-foreground.png`, `android-icon-monochrome.png`, `splash-icon.png`.

Pour un logo vectoriel (SVG), fournir les fichiers : l’intégration via `react-native-svg`
est prévue (dépendance déjà installée).
