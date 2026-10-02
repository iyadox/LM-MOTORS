/**
 * Liste tout ce qui manque encore avant de pouvoir publier le site.
 * Utilisé par la page /brouillon/ et par `npm run verifier`.
 *
 * niveau :
 *   - 'bloquant'   : la mise en ligne en production est refusée tant que c'est vide ;
 *   - 'important'  : le site fonctionne, mais perd en efficacité ou en crédibilité ;
 *   - 'utile'      : améliore le site, à faire quand c'est possible.
 */
import { garage, engagements, acces } from './garage.mjs';
import { services } from './services.mjs';
import { communes } from './communes.mjs';

export function listerManques() {
  const m = [];
  const ajouter = (niveau, rubrique, libelle, aide = '') => m.push({ niveau, rubrique, libelle, aide });

  // Contact
  if (!garage.telephone && !garage.whatsapp && !garage.email) {
    ajouter('bloquant', 'Contact', 'Au moins un moyen de contact (téléphone, WhatsApp ou e-mail)', 'garage.telephone / garage.whatsapp / garage.email');
  }
  if (!garage.telephone) ajouter('important', 'Contact', 'Numéro de téléphone (bouton « Appeler » sur mobile)', 'garage.telephone');
  if (!garage.whatsapp) ajouter('utile', 'Contact', 'Numéro WhatsApp', 'garage.whatsapp');
  if (!garage.email) ajouter('utile', 'Contact', 'Adresse e-mail professionnelle', 'garage.email');

  // Adresse et accès
  if (!garage.adresse.numero) ajouter('important', 'Adresse', 'Numéro dans la rue Robert Raclot', 'garage.adresse.numero');
  if (!garage.geo) ajouter('utile', 'Adresse', 'Coordonnées GPS exactes de l’atelier', 'garage.geo');
  if (!acces.tempsDepuisAuxerre) ajouter('utile', 'Accès', 'Temps de trajet mesuré depuis Auxerre', 'acces.tempsDepuisAuxerre');
  const sansTrajet = communes.filter((c) => !c.trajet).map((c) => c.nom);
  if (sansTrajet.length) ajouter('utile', 'Accès', `Trajets à mesurer depuis : ${sansTrajet.join(', ')}`, 'communes[].trajet');

  // Horaires
  if (!garage.horaires) ajouter('important', 'Horaires', 'Horaires d’ouverture', 'garage.horaires');

  // Prestations
  const validees = services.filter((s) => s.valide);
  if (validees.length === 0) {
    ajouter('bloquant', 'Prestations', 'Aucune prestation validée par le gérant', 'services[].valide');
  }
  const aValider = services.filter((s) => !s.valide).map((s) => s.titre);
  if (aValider.length) ajouter('important', 'Prestations', `À confirmer : ${aValider.join(', ')}`, 'services[].valide');
  if (!services.some((s) => s.prix)) ajouter('utile', 'Prestations', 'Prix ou forfaits affichables', 'services[].prix');
  const engAValider = engagements.filter((e) => !e.valide).map((e) => e.titre);
  if (engAValider.length) ajouter('important', 'Arguments', `À confirmer : ${engAValider.join(', ')}`, 'engagements[].valide');

  // Paiement
  if (!garage.paiement.moyens) ajouter('utile', 'Paiement', 'Moyens de paiement acceptés', 'garage.paiement.moyens');

  // Avis et présence en ligne
  if (!garage.liens.googleAvis) ajouter('important', 'Avis', 'Lien « Laisser un avis » Google (fiche Google Business Profile à créer)', 'garage.liens.googleAvis');
  if (!garage.liens.googleFiche) ajouter('utile', 'Avis', 'Lien de la fiche Google Maps', 'garage.liens.googleFiche');

  // Mentions légales
  const L = garage.legal;
  if (!L.raisonSociale) ajouter('bloquant', 'Mentions légales', 'Raison sociale (extrait Kbis)', 'garage.legal.raisonSociale');
  if (!L.formeJuridique) ajouter('important', 'Mentions légales', 'Forme juridique et capital', 'garage.legal.formeJuridique');
  if (!L.siege) ajouter('bloquant', 'Mentions légales', 'Adresse du siège social', 'garage.legal.siege');
  if (!L.siret) ajouter('bloquant', 'Mentions légales', 'Numéro SIRET', 'garage.legal.siret');
  if (!L.rcs) ajouter('important', 'Mentions légales', 'Immatriculation RCS', 'garage.legal.rcs');
  if (!L.tvaIntracom) ajouter('utile', 'Mentions légales', 'Numéro de TVA intracommunautaire', 'garage.legal.tvaIntracom');
  if (!L.directeurPublication) ajouter('bloquant', 'Mentions légales', 'Directeur de la publication', 'garage.legal.directeurPublication');
  if (!L.mediateur) ajouter('important', 'Mentions légales', 'Médiateur de la consommation', 'garage.legal.mediateur');
  if (!garage.hebergeur.nom) ajouter('bloquant', 'Mentions légales', 'Hébergeur du site (nom, adresse, contact)', 'garage.hebergeur');

  // Formulaire et confidentialité
  if (!garage.formulaire.dureeConservationValidee) ajouter('important', 'Confidentialité', `Durée de conservation des demandes à valider (proposée : ${garage.formulaire.dureeConservation})`, 'garage.formulaire.dureeConservationValidee');

  // Visuels
  if (!garage.visuels.photos.length) ajouter('utile', 'Visuels', 'Photos réelles de l’atelier (dossier public/photos/)', 'garage.visuels.photos');
  if (!garage.visuels.logo) ajouter('utile', 'Visuels', 'Logo officiel (un logo typographique provisoire est utilisé)', 'garage.visuels.logo');

  return m;
}

export const ORDRE_NIVEAUX = { bloquant: 0, important: 1, utile: 2 };
