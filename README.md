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
| Moteurs de recherche | exclus (`noindex` en balise et en en-tête HTTP) | autorisés, avec sitemap |
| Formulaire | sert aux tests de réception (message « version de travail ») | actif |
| Pages communes | toutes visibles | seulement celles dont le trajet est mesuré |

`npm run build:production` **refuse de construire le site** tant qu'une information bloquante manque. Exemples :
- adresse confirmée, téléphone, e-mail ;
- mentions légales complètes, médiateur, durée de conservation ;
- au moins une prestation validée ;
- adresse qui reçoit les demandes, et **demande test reçue** ;
- `SITE_URL`.

Après le build, `scripts/controle-build.mjs` vérifie qu'aucune mention « À confirmer » ni prestation non validée n'a fuité dans les pages, et qu'aucun lien interne n'est cassé.

`npm run verifier` affiche la liste à jour, et la page `/brouillon/` de la version de travail la reprend.

## Commandes

```bash
npm install
npm run dev               # site en local sur http://localhost:4321
npm run build             # version de travail dans dist/
npm run verifier          # liste des informations manquantes
npm run build:production  # version finale (échoue s'il manque une info bloquante)
npm run captures -- / /devis/   # captures d'écran mobile + desktop dans .captures/
npm run image-partage     # régénère public/og.png (aperçu des partages)
```

## Mise en ligne (Netlify, gratuit pour ce volume)

1. Créer un site Netlify relié à ce dépôt GitHub. `netlify.toml` est déjà configuré.
2. **Activer la détection des formulaires**, désactivée par défaut sur les nouveaux sites : *Project configuration → Forms → Form detection → Enable*, puis redéployer. Le formulaire « devis » doit apparaître dans l'onglet *Forms*. Sans cela, **toutes les demandes sont perdues**.
3. **Notifications** : *Forms → Form notifications → Email notification*, vers l'adresse du gérant (`formulaire.notificationsVers`). L'objet de chaque e-mail résume la demande : prestation, véhicule, commune, mode de rappel.
4. **Test réel** : depuis un smartphone, envoyer une demande sur l'adresse Netlify (le brouillon déployé suffit). Vérifier que le gérant reçoit l'e-mail, en regardant aussi dans ses spams. Noter la date dans `formulaire.testeEnLigne`.
5. Chaque semaine, regarder l'onglet *Spam submissions* de Netlify : les demandes classées en spam n'envoient pas d'e-mail.
6. Variable d'environnement **`SITE_URL`** = adresse définitive, par exemple `https://www.lm-motors.fr`. Elle sert aux canoniques, au sitemap et aux données structurées. À défaut, Netlify fournit `URL`.
7. Une fois les informations complètes, remplacer dans `netlify.toml` la commande `npm run build` par `npm run build:production`.

Pour utiliser un autre service de formulaires (Formspree…), renseigner `formulaire.endpoint` et `formulaire.prestataire` dans `garage.mjs`.

## Mesurer ce que le site rapporte

- Chaque demande indique la **page du site d'où elle a été envoyée** : une prestation, une page commune, l'accueil… Si le client arrive directement sur le formulaire, elle indique aussi le site d'origine et les paramètres `utm_*`. Rien n'est stocké sur l'appareil du visiteur, donc aucun bandeau de consentement n'est nécessaire.
- Sur la fiche Google, utiliser comme lien du site : `https://<domaine>/?utm_source=google&utm_medium=fiche`. Faire de même sur Vroomly.
- Facultatif, statistiques sans cookie avec Plausible : renseigner `analytics.plausibleDomain`, puis créer les objectifs suivants :

  | Objectif | Ce qu'il mesure |
  |---|---|
  | page vue `/merci/` | demandes envoyées |
  | `Appel`, `WhatsApp`, `Clic devis`, `Itinéraire`, `Avis Google` | clics sur les boutons, avec la propriété `lieu` (en-tête, barre mobile, héros…) |
  | `Formulaire commencé` | formulaires ouverts, pour calculer le taux d'abandon |

## À faire autour du site (hors code)

- Créer ou revendiquer la **fiche Google Business Profile**, avec exactement la même adresse et le même téléphone que le site. Renseigner ensuite :
  - `liens.googleAvis` : lien court « Demander des avis » ;
  - `liens.googleFiche` ;
  - `liens.googlePlaceId`.

  Le QR code d'avis se génère tout seul.
- **Demander des avis** avec la page `/avis/carte/` (non référencée), qui propose 4 cartes à imprimer par feuille et un message prêt à envoyer par SMS ou WhatsApp après chaque intervention. Jamais de contrepartie, et une demande à tous les clients.
- Compléter la fiche **Vroomly** existante et inscrire le garage dans les annuaires gratuits (PagesJaunes, idGarages…), avec des coordonnées identiques partout.
- Mesurer les **temps de trajet** réels depuis chaque commune (`communes.mjs` → `trajet`). Chaque page commune n'est publiée qu'une fois son trajet renseigné.
- Ajouter de **vraies photos** de l'atelier dans `public/photos/` (`visuels.photos`), et le logo s'il existe.
- Afficher à l'atelier les taux horaires et forfaits TTC (arrêté du 27 mars 1987).
