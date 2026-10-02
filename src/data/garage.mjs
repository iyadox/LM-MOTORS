/**
 * SOURCE UNIQUE DE VÉRITÉ — informations du garage LM Motors.
 *
 * Règle absolue : on n'invente rien.
 *   - Une valeur `null` signifie « inconnue » : le site masque l'élément en production
 *     et l'affiche comme « à compléter » en mode brouillon.
 *   - Chaque valeur renseignée doit venir du gérant ou d'une source listée dans
 *     recherche/dossier-lm-motors.md.
 *
 * Pour mettre le site en ligne : remplir les champs `null`, puis lancer
 * `npm run verifier` qui liste tout ce qui manque encore.
 */
export const garage = {
  nom: 'LM Motors',
  // Source : fiche Vroomly « Garage Lm Motors » (dossier §2).
  type: 'Garage automobile',

  adresse: {
    rue: 'Rue Robert Raclot', // Source : Vroomly (dossier §2)
    numero: null, // ❓ Inconnu — à demander au gérant
    complement: null, // ex. « Centre commercial Le Rami » — à confirmer sur place
    codePostal: '89290',
    ville: 'Champs-sur-Yonne',
    departement: 'Yonne',
    region: 'Bourgogne-Franche-Comté',
    pays: 'FR',
  },

  // Coordonnées GPS exactes de l'atelier (après géocodage de l'adresse complète).
  // Format : { lat: 47.0, lng: 3.0 }
  geo: null,

  // Format d'affichage français, ex. '03 86 00 00 00'. Le lien tel: est généré automatiquement.
  telephone: null,
  telephoneSecondaire: null,
  // Numéro WhatsApp au format international, chiffres uniquement, ex. '33612345678'.
  whatsapp: null,
  email: null,

  /**
   * Horaires d'ouverture. `null` = inconnus.
   * Format attendu (7 entrées, du lundi au dimanche) :
   *   [
   *     { jour: 'Lundi', plages: [['08:00', '12:00'], ['14:00', '18:30']] },
   *     ...
   *     { jour: 'Dimanche', plages: [] },   // fermé
   *   ]
   */
  horaires: null,
  // Texte libre affiché sous les horaires, ex. « Fermé du 10 au 25 août ».
  fermetures: null,

  paiement: {
    // ex. ['Carte bancaire', 'Espèces', 'Chèque']
    moyens: null,
    // Vroomly affiche « Facilités de paiement » : à confirmer (offre du garage ou de la plateforme ?).
    facilites: null,
  },

  liens: {
    // Lien « Laisser un avis » de la fiche Google Business Profile (à créer / revendiquer).
    googleAvis: null,
    // Lien de la fiche Google Maps de l'établissement.
    googleFiche: null,
    facebook: null,
    instagram: null,
    // Fiche Vroomly propre au garage (URL exacte à récupérer).
    vroomly: null,
  },

  // Mentions légales — à recopier depuis l'extrait Kbis fourni par le gérant.
  // Piste non prouvée : SAS LM MOTORS constituée le 24/06/2026 (dossier §2).
  legal: {
    raisonSociale: null,
    formeJuridique: null,
    capital: null,
    siege: null,
    rcs: null,
    siret: null,
    tvaIntracom: null,
    directeurPublication: null,
    // Médiateur de la consommation (obligatoire pour un professionnel qui vend à des particuliers).
    mediateur: null,
  },

  hebergeur: {
    // Rempli au moment du choix de l'hébergeur (ex. Netlify, Inc., 512 2nd Street, San Francisco…).
    nom: null,
    adresse: null,
    contact: null,
  },

  // Domaine mesuré par Plausible Analytics (sans cookie). `null` = pas de statistiques.
  analytics: { plausibleDomain: null },

  formulaire: {
    // `null` = Netlify Forms (les demandes arrivent dans le tableau de bord Netlify + par e-mail).
    // Sinon, URL d'un service de formulaires (ex. Formspree) qui accepte un POST multipart.
    endpoint: null,
    // Durée de conservation des demandes (politique de confidentialité). Proposition à valider.
    dureeConservation: '3 ans à compter du dernier contact',
    dureeConservationValidee: false,
  },

  visuels: {
    // Chemin du logo officiel dans /public (ex. '/logo.svg'). `null` = logo typographique provisoire.
    logo: null,
    // Photos réelles de l'atelier dans /public/photos, ex. [{ src: '/photos/atelier.jpg', alt: 'Atelier LM Motors' }]
    photos: [],
  },
};

/** Arguments commerciaux : affichés seulement une fois validés par le gérant. */
export const engagements = [
  { titre: 'Devis avant intervention', texte: 'Vous connaissez le prix avant que l’on touche à votre véhicule.', valide: false },
  { titre: 'Toutes marques', texte: 'Entretien et réparation de véhicules légers, quelle que soit la marque.', valide: false },
  { titre: 'Interlocuteur unique', texte: 'Vous parlez directement au mécanicien qui intervient sur votre voiture.', valide: false },
  { titre: 'Paiement en plusieurs fois', texte: 'Des facilités de paiement pour étaler les grosses réparations.', valide: false },
];

/** Repères d'accès vérifiés (dossier §3 et §8). */
export const acces = {
  // Vérifié : Champs-sur-Yonne est au sud-sud-est d'Auxerre.
  situation: 'au sud d’Auxerre',
  // Vérifié : la gare « Champs - Saint-Bris » est sur le territoire de la commune.
  gare: 'Champs - Saint-Bris',
  // Vérifié : centre commercial Le Rami, rue Robert Raclot / rue de la Croix Bersan.
  // On ne sait PAS encore si l'atelier est dans le centre : ne pas l'affirmer.
  repereRue: 'centre commercial Le Rami',
  // À mesurer (Google Maps / ViaMichelin) avant publication.
  tempsDepuisAuxerre: null,
};
