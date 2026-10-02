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
    // Source unique : Vroomly (dossier §2-3). PagesJaunes cite « Lm Motors » à Vergigny :
    // l'adresse doit être confirmée par le gérant (ou l'avis SIRENE de l'établissement).
    rue: 'Rue Robert Raclot',
    // ❓ Inconnu. Si l'adresse officielle n'a vraiment pas de numéro, mettre '' (chaîne vide) après confirmation.
    numero: null,
    complement: null, // ex. « Centre commercial Le Rami » — à confirmer sur place
    codePostal: '89290',
    ville: 'Champs-sur-Yonne',
    departement: 'Yonne',
    region: 'Bourgogne-Franche-Comté',
    pays: 'FR',
    // Passer à true quand le gérant a confirmé l'adresse complète.
    valide: false,
  },

  // Coordonnées GPS exactes de l'atelier, en texte avec au moins 5 décimales,
  // relevées sur la fiche Google de l'atelier (JAMAIS celles du dossier, qui sont
  // celles d'autres commerces de la rue). Format : { lat: '47.7xxxx', lng: '3.5xxxx' }
  geo: null,

  // Format d'affichage français, ex. '03 86 00 00 00'. Les liens tel: et WhatsApp
  // sont générés automatiquement (indicatif +33 ajouté).
  telephone: null,
  // Numéro WhatsApp (même format possible, ex. '06 12 34 56 78').
  whatsapp: null,
  email: null,

  /**
   * Horaires d'ouverture. `null` = inconnus.
   * Format attendu : 7 entrées, du lundi au dimanche, heures au format HH:MM :
   *   [
   *     { jour: 'Lundi', plages: [['08:00', '12:00'], ['14:00', '18:30']] },
   *     ...
   *     { jour: 'Dimanche', plages: [] },   // fermé
   *   ]
   * `npm run verifier` refuse un format incorrect.
   */
  horaires: null,
  // Le garage est-il ouvert les jours fériés ? true / false (réponse du gérant).
  // Tant que c'est `null`, le statut « Ouvert / Fermé » n'est pas affiché les jours fériés.
  ouvertJoursFeries: null,
  // Fermetures datées (congés…), ex. [{ du: '2027-08-09', au: '2027-08-22', texte: 'Congés d’été' }]
  fermeturesDates: [],

  paiement: {
    // ex. ['Carte bancaire', 'Espèces', 'Chèque']
    moyens: null,
    // Vroomly affiche « Facilités de paiement » : à confirmer (offre du garage ou de la plateforme ?).
    facilites: null,
  },

  liens: {
    // Lien court « Demander des avis » fourni par la fiche Google Business Profile
    // (ouvre directement le formulaire d'avis). Sert au bouton et au QR code.
    googleAvis: null,
    // Lien de la fiche Google Maps de l'établissement.
    googleFiche: null,
    // Identifiant de lieu Google (Place ID) de la fiche, pour des itinéraires exacts.
    googlePlaceId: null,
    facebook: null,
    instagram: null,
    // Fiche Vroomly propre au garage (URL exacte à récupérer).
    vroomly: null,
  },

  // Mentions légales — à recopier depuis l'extrait Kbis / avis SIRENE / extrait RNE fourni par le gérant.
  // Piste non prouvée : SAS LM MOTORS constituée le 24/06/2026 (dossier §2) ; ou entreprise individuelle.
  legal: {
    // 'societe' (SAS, SARL…) ou 'ei' (entrepreneur individuel) — d'après le Kbis / l'extrait RNE.
    statut: null,
    // Société : dénomination sociale. EI : nom et prénom de l'entrepreneur (affichés suivis de « EI »).
    raisonSociale: null,
    formeJuridique: null, // sociétés : ex. 'SAS', 'SARL'
    capital: null, // sociétés uniquement, ex. '1 000 €'
    siege: null,
    // Immatriculation telle qu'indiquée sur le Kbis / l'extrait, ex. 'RCS Auxerre 123 456 789' ou 'RNE 123 456 789'.
    immatriculation: null,
    siret: null,
    // Numéro de TVA intracommunautaire, ou false si l'entreprise n'est pas assujettie (franchise en base).
    tvaIntracom: null,
    // = représentant légal figurant sur le Kbis (président de la SAS) ou l'entrepreneur individuel lui-même.
    directeurPublication: null,
    // Médiateur de la consommation avec lequel le garage a réellement signé (liste officielle :
    // economie.gouv.fr/mediation-conso). Format : { nom, adresse, site }
    mediateur: null,
  },

  hebergeur: {
    // À recopier depuis les mentions légales de l'hébergeur au moment de la mise en ligne.
    nom: null,
    adresse: null,
    telephone: null,
    // Pays de l'hébergeur et cadre du transfert si hors UE (ex. 'États-Unis — Data Privacy Framework'),
    // à vérifier auprès de l'hébergeur avant de le renseigner.
    transfertHorsUE: null,
  },

  // Domaine mesuré par Plausible Analytics (sans cookie). `null` = pas de statistiques.
  analytics: { plausibleDomain: null },

  formulaire: {
    // `null` = Netlify Forms (penser à activer « Form detection » dans Netlify).
    // Sinon, URL d'un service de formulaires (ex. Formspree) qui accepte un POST multipart.
    endpoint: null,
    // Nom du service tiers si `endpoint` est renseigné (ex. 'Formspree'), pour la confidentialité.
    prestataire: null,
    // Adresse e-mail (ou numéro) qui REÇOIT les notifications de demandes, confirmée par le gérant.
    notificationsVers: null,
    // Date (AAAA-MM-JJ) d'une demande test envoyée depuis le site en ligne ET reçue par le gérant.
    testeEnLigne: null,
    // Durée de conservation des demandes, décidée par le gérant et réellement appliquée
    // (purge des demandes dans Netlify et des e-mails de notification). Principe : le temps de traiter
    // la demande et la durée de validité du devis ; si des travaux suivent, le dossier client a sa
    // propre durée. Ex. : '6 mois après la dernière réponse du garage'.
    dureeConservation: null,
  },

  // Le devis est-il gratuit ? (R.111-3 C. conso : un devis ne peut être facturé que si le client
  // en est informé à l'avance.) payant: true/false ; prix (TTC) et deduitSiTravaux si payant.
  devis: { payant: null, prix: null, deduitSiTravaux: null },

  visuels: {
    // Chemin du logo officiel dans /public (ex. '/logo.svg'). `null` = logo typographique provisoire.
    logo: null,
    // Photos réelles de l'atelier dans /public/photos, ex. [{ src: '/photos/atelier.jpg', alt: 'Atelier LM Motors' }]
    photos: [],
  },
};

/** Arguments commerciaux : affichés seulement une fois validés par le gérant. */
export const engagements = [
  { titre: 'Devis avant réparation', texte: 'Un devis détaillé vous est remis avant toute réparation.', valide: false },
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
  // À mesurer (Google Maps / ViaMichelin) avant publication, ex. 'Environ 10 minutes en voiture'.
  tempsDepuisAuxerre: null,
};
