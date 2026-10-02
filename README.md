# LM Motors : site web

Site du garage **LM Motors**, rue Robert Raclot, 89290 Champs-sur-Yonne (Yonne), au sud d'Auxerre.

Le site est conçu pour **apporter des clients au garage**, pas seulement pour le présenter :

- **appel en un clic** : bouton fixe en bas de l'écran sur mobile, et dans l'en-tête ;
- **WhatsApp**, avec un message pré-rempli ;
- **formulaire de devis ou de rendez-vous** : véhicule, besoin, photo, créneau souhaité. Les demandes arrivent par e-mail au garage (Netlify Forms) ;
- **pages par prestation** (vidange, freins, pneus, diagnostic…) et **pages locales** (« Garage près d'Auxerre », de Monéteau, de Venoy…) pour le référencement autour d'Auxerre ;
- **statut « Ouvert / Fermé » en direct**, calculé à l'heure de Paris, dès que les horaires sont renseignés ;
- **collecte d'avis Google** : une page dédiée, plus une **carte imprimable avec QR code** (`/avis/carte/`) à poser au comptoir ;
- **suivi des contacts** (clics sur « Appeler », WhatsApp, demandes envoyées), via Plausible, sans cookie ;
- **données structurées** schema.org `AutoRepair`, sitemap, mentions légales et politique de confidentialité.

## Règle d'or : aucune information inventée

Toutes les informations du garage sont dans **`src/data/`** :

| Fichier | Contenu |
|---|---|
| `garage.mjs` | Coordonnées, horaires, liens, mentions légales, arguments commerciaux |
| `services.mjs` | Prestations : textes descriptifs, prix, validation |
| `communes.mjs` | Communes de la zone : données INSEE et La Poste vérifiées, trajets |
| `avis.mjs` | Vrais avis clients, recopiés avec accord |
| `faq.mjs` | Questions fréquentes (informations générales vérifiables) |

Une valeur **`null`** signifie « inconnue ». Le site masque alors l'élément au lieu d'inventer.
Les prestations et les arguments ont un champ **`valide`** : seuls ceux confirmés par le gérant apparaissent en production.

D'où viennent les informations déjà présentes : [`recherche/dossier-lm-motors.md`](recherche/dossier-lm-motors.md).
Ce qu'il faut demander au gérant : [`recherche/questions-gerant.md`](recherche/questions-gerant.md).

## Deux modes

| | Brouillon (par défaut) | Production |
|---|---|---|
| Commande | `npm run build` | `npm run build:production` |
| Éléments non confirmés | affichés avec la mention « À confirmer » ou « À compléter » | masqués |
| Moteurs de recherche | exclus (`noindex` + `robots.txt`) | autorisés, avec sitemap |
| Bandeau « version de travail » | oui, avec un lien vers `/brouillon/` | non |

`npm run build:production` **refuse de construire le site** tant qu'une information bloquante manque : raison sociale, Siret, directeur de publication, hébergeur, au moins un moyen de contact, au moins une prestation validée.
`npm run verifier` affiche la liste à jour. La page `/brouillon/` du site en version de travail l'affiche aussi.

## Commandes

```bash
npm install
npm run dev               # site en local sur http://localhost:4321
npm run build             # version de travail dans dist/
npm run verifier          # liste des informations manquantes
npm run build:production  # version finale (échoue s'il manque une info bloquante)
npm run captures -- / /devis/   # captures d'écran mobile + desktop dans .captures/
```

## Mise en ligne (Netlify, gratuit pour ce volume)

1. Créer un site Netlify relié à ce dépôt GitHub. `netlify.toml` est déjà configuré.
2. Variable d'environnement **`SITE_URL`** : l'adresse définitive, par exemple `https://www.lm-motors.fr`. Elle sert aux URL canoniques et au sitemap.
3. **Notifications des demandes** : Netlify → *Forms* → *Form notifications* → e-mail du garage. Chaque demande de devis arrive alors par e-mail, et reste consultable dans le tableau de bord Netlify.
4. Une fois les informations complétées, remplacer dans `netlify.toml` la commande `npm run build` par `npm run build:production`.
5. Statistiques (facultatif) : créer le site sur plausible.io, puis renseigner `analytics.plausibleDomain` dans `garage.mjs`.

Pour utiliser un autre service de formulaires (Formspree…), renseigner `formulaire.endpoint` dans `garage.mjs`.

## À faire autour du site (hors code)

- Créer ou revendiquer la **fiche Google Business Profile**, avec la même adresse et le même téléphone que le site, puis renseigner `liens.googleAvis` et `liens.googleFiche`. Le QR code d'avis se génère tout seul.
- Compléter la fiche **Vroomly** existante et l'inscrire dans les annuaires gratuits (PagesJaunes, idGarages…), avec des coordonnées identiques partout.
- Mesurer les **temps de trajet** réels depuis chaque commune (`communes.mjs` → `trajet`).
- Ajouter de **vraies photos** de l'atelier dans `public/photos/`, et le logo s'il existe.
