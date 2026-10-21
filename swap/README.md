# SWAP — application mobile de troc

Application React Native (Expo) permettant aux particuliers d’échanger des objets sans les acheter.
Ce dossier contient le code de l’app. La charte graphique de référence est dans
[`docs/brand/charte-swap.png`](docs/brand/charte-swap.png).

## Tester sur ton iPhone (5 minutes)

Prérequis sur ton ordinateur : [Node.js 22 LTS](https://nodejs.org) et Git.
Sur l’iPhone : l’app **Expo Go** (App Store), à jour.

```bash
git clone https://github.com/craftcompro-lang/bandeau.git
cd bandeau
git checkout claude/swap-barter-app-dev-5j1ro6
cd swap
npm install
npx expo start
```

1. Un QR code s’affiche dans le terminal.
2. Ouvre l’appareil photo de l’iPhone, vise le QR code, touche la notification : SWAP s’ouvre dans Expo Go.
3. Ordinateur et iPhone doivent être sur le **même Wi-Fi**. Sinon : `npx expo start --tunnel`.

Les modifications du code s’affichent instantanément sur le téléphone.

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm start` | Lance le serveur de développement (QR code pour Expo Go) |
| `npm run start:tunnel` | Idem, via un tunnel (réseaux différents) |
| `npm run web` | Aperçu dans le navigateur |
| `npm run typecheck` | Vérification TypeScript stricte |
| `npm run lint` | ESLint (config Expo) |
| `npm test` | Tests automatisés (Jest) |
| `npm run brand:build` | Régénère le code du logo après mise à jour des SVG officiels |

## Variables d’environnement

Copier `.env.example` en `.env.local` (jamais commité). Toutes les variables `EXPO_PUBLIC_*`
sont **publiques** (embarquées dans l’app) : aucune clé secrète ne doit y figurer.

| Variable | Obligatoire | Description |
| --- | --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | Phase 2 | URL du projet Supabase |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Phase 2 | Clé publique « anon » (protégée par RLS) |
| `EXPO_PUBLIC_DATA_MODE` | Non | `demo` (annonces fictives signalées) ou `live`. Par défaut : `demo` tant que Supabase n’est pas configuré |

Les secrets serveur (clé `service_role` Supabase, clés Stripe, prestataires) vivront uniquement
dans les Edge Functions / secrets Supabase, jamais dans l’app.

## Architecture

```
swap/
├── app.json                  Configuration Expo (nom, icônes, permissions)
├── assets/brand/             Logos officiels SVG (voir README du dossier)
├── docs/                     Charte, design system
├── scripts/                  Outils (génération du code du logo)
└── src/
    ├── app/                  Écrans (Expo Router : 1 fichier = 1 route)
    │   ├── (tabs)/           Accueil, Explorer, Publier (+), Messages, Profil
    │   ├── annonce/[id].tsx  Fiche annonce
    │   ├── echange/proposer.tsx  Proposition d’échange
    │   ├── protect.tsx       SWAP Protect
    │   └── …                 Favoris, notifications, publication, 404
    ├── components/           UI réutilisable
    │   ├── ui/               Design system (texte, boutons, chips, états…)
    │   ├── layout/           Écran, en-têtes, barre d’onglets, feuilles modales
    │   ├── listing/          Cartes et blocs d’annonces
    │   ├── exchange/         Blocs d’échange, frise SWAP Protect
    │   └── brand/            Logo
    ├── domain/               Logique métier pure et testée (aucune dépendance UI)
    │   ├── exchange.ts       Machine à états des échanges
    │   ├── search.ts         Règles de recherche / filtres / tri
    │   ├── geo.ts            Distances (positions arrondies ~1 km)
    │   └── listing.ts        Schémas Zod des données
    ├── data/                 Accès aux données (dépôt d’annonces, données démo isolées)
    ├── features/             Hooks TanStack Query par fonctionnalité
    ├── stores/               État local partagé (Zustand) : favoris, recherches, position
    ├── lib/                  Services externes (env validé, client Supabase)
    └── theme/                Tokens : couleurs, typographie, espacements, rayons, ombres
```

Principes :
- **Les écrans ne savent pas d’où viennent les données** : `src/data/listings-repository.ts`
  sert la démo aujourd’hui et Supabase en phase 2, sans modifier l’UI.
- **Les règles métier sont pures et testées** (`src/domain`). Elles serviront de spécification
  aux contrôles côté serveur (RLS, fonctions PostgreSQL) : le client ne valide jamais seul.
- **Aucune donnée inventée présentée comme réelle** : le mode démo est signalé sur chaque écran
  concerné ; vérification d’identité, notes et échanges terminés restent à zéro.

## État de la phase 1

| Fonctionne dès maintenant | Nécessite un service externe / une phase suivante |
| --- | --- |
| Logo vectoriel officiel et icônes d’app | |
| Navigation 5 onglets + bouton central | Comptes et connexion (Supabase Auth — phase 2) |
| Design system complet (Montserrat, palette officielle) | Annonces réelles, photos, publication (phase 2) |
| Accueil : recherche, catégories, « À proximité », « Pour toi », récents | Envoi réel des propositions, messagerie (phase 3) |
| Explorer : recherche texte, filtres catégorie/état/distance, tri, suggestions | Vérification d’identité (prestataire — phase 5) |
| Fiche annonce, favoris (sur l’appareil) | Livraison, paiements (après accords contractuels) |
| Proposition d’échange (choix de l’objet, message) — envoi désactivé en démo | |
| SWAP Protect (présentation honnête, statuts « En préparation ») | |
| Localisation approximative réelle (distance affichée seulement si calculable) | |
| Machine à états des échanges + 25 tests automatisés | |

## Qualité

```bash
npm run typecheck && npm run lint && npm test
```
