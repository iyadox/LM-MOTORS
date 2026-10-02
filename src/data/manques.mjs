/**
 * Liste tout ce qui manque encore avant de pouvoir publier le site.
 * Utilisé par la page /brouillon/ et par `npm run verifier` (donc sans dépendance à Vite).
 *
 * niveau :
 *   - 'bloquant'   : la mise en ligne en production est refusée tant que ce n'est pas réglé ;
 *   - 'important'  : le site fonctionne, mais perd en efficacité ou en crédibilité ;
 *   - 'utile'      : améliore le site, à faire quand c'est possible.
 */
import { garage, engagements, acces } from './garage.mjs';
import { services } from './services.mjs';
import { communes, pagePrete } from './communes.mjs';
import { avis } from './avis.mjs';
import { versE164 } from '../lib/telephone.mjs';
import { validerHoraires, validerFermetures } from '../lib/horaires.mjs';

const SOCIETES = /\b(SAS|SASU|SARL|EURL|SA|SNC|SCOP)\b/i;
const geoValide = (v) => /^-?\d+\.\d{5,}$/.test(String(v));

/** Adresse publique du site, fournie au build (SITE_URL, ou URL fournie par Netlify). */
export function urlDuSite() {
  const env = typeof process !== 'undefined' ? process.env : {};
  return env.SITE_URL || env.URL || null;
}

export function listerManques() {
  const m = [];
  const ajouter = (niveau, rubrique, libelle, aide = '') => m.push({ niveau, rubrique, libelle, aide });
  const L = garage.legal;
  const H = garage.hebergeur;
  const F = garage.formulaire;

  // Réception des demandes : sans cela, des clients peuvent être perdus sans que personne le sache.
  if (!F.notificationsVers) ajouter('bloquant', 'Demandes', 'Adresse qui reçoit les demandes de devis (notifications), confirmée par le gérant', 'garage.formulaire.notificationsVers');
  if (!F.testeEnLigne) ajouter('bloquant', 'Demandes', 'Demande test envoyée depuis le site en ligne et bien reçue par le gérant (date)', 'garage.formulaire.testeEnLigne');
  if (F.endpoint && !F.prestataire) ajouter('bloquant', 'Demandes', 'Nom du service de formulaires utilisé (confidentialité)', 'garage.formulaire.prestataire');
  if (!F.numeroRappel) ajouter('important', 'Demandes', 'Numéro qui s’affiche quand le garage rappelle un client', 'garage.formulaire.numeroRappel');
  else if (!versE164(F.numeroRappel)) ajouter('bloquant', 'Demandes', `Numéro de rappel au format non reconnu : « ${F.numeroRappel} »`, 'garage.formulaire.numeroRappel');
  if (!F.modesReponse) ajouter('important', 'Demandes', 'Moyens par lesquels le garage répond (appel, SMS, e-mail, WhatsApp)', 'garage.formulaire.modesReponse');

  // Adresse publique du site
  const url = urlDuSite();
  if (!url || /\.example(\/|$)/.test(url)) ajouter('bloquant', 'Mise en ligne', 'Adresse définitive du site (variable SITE_URL au moment du build)', 'SITE_URL');
  else if (/\.netlify\.app/.test(url)) ajouter('important', 'Mise en ligne', `Le site utilise l’adresse provisoire ${url} : définir le nom de domaine définitif`, 'SITE_URL');

  // Contact
  if (!garage.telephone) ajouter('bloquant', 'Contact', 'Numéro de téléphone (bouton « Appeler », mentions légales)', 'garage.telephone');
  else if (!versE164(garage.telephone)) ajouter('bloquant', 'Contact', `Numéro de téléphone au format non reconnu : « ${garage.telephone} »`, 'garage.telephone');
  if (garage.whatsapp && !versE164(garage.whatsapp)) ajouter('bloquant', 'Contact', `Numéro WhatsApp au format non reconnu : « ${garage.whatsapp} »`, 'garage.whatsapp');
  if (!garage.whatsapp) ajouter('utile', 'Contact', 'Numéro WhatsApp', 'garage.whatsapp');
  if (!garage.email) ajouter('bloquant', 'Contact', 'Adresse e-mail professionnelle (mentions légales, droits RGPD)', 'garage.email');

  // Adresse et accès
  if (!garage.adresse.valide) ajouter('bloquant', 'Adresse', 'Adresse de l’atelier confirmée par le gérant (une seule source aujourd’hui : Vroomly)', 'garage.adresse.valide');
  if (garage.adresse.numero === null) ajouter('bloquant', 'Adresse', 'Numéro dans la rue (ou chaîne vide si l’adresse officielle n’en a pas)', 'garage.adresse.numero');
  if (!garage.geo) ajouter('utile', 'Adresse', 'Coordonnées GPS exactes de l’atelier', 'garage.geo');
  else if (!geoValide(garage.geo.lat) || !geoValide(garage.geo.lng)) ajouter('important', 'Adresse', 'Coordonnées GPS : au moins 5 décimales, en texte', 'garage.geo');
  if (!acces.tempsDepuisAuxerre) ajouter('utile', 'Accès', 'Temps de trajet mesuré depuis Auxerre', 'acces.tempsDepuisAuxerre');
  const nonPretes = communes.filter((c) => !pagePrete(c)).map((c) => c.nom);
  if (nonPretes.length) ajouter('important', 'Pages communes', `Non publiées tant que le trajet n’est pas mesuré : ${nonPretes.join(', ')}`, 'communes[].trajet');

  // Horaires
  if (!garage.horaires) {
    ajouter('important', 'Horaires', 'Horaires d’ouverture', 'garage.horaires');
  } else {
    const erreurs = validerHoraires(garage.horaires);
    if (erreurs.length) ajouter('bloquant', 'Horaires', `Horaires mal formés : ${erreurs.join(' ; ')}`, 'garage.horaires');
    if (garage.ouvertJoursFeries === null) ajouter('important', 'Horaires', 'Ouvert ou fermé les jours fériés ? (sans réponse, le statut en direct est masqué ces jours-là)', 'garage.ouvertJoursFeries');
  }
  const erreursFermetures = validerFermetures(garage.fermeturesDates, garage.ouvertJoursFeries);
  if (erreursFermetures.length) ajouter('bloquant', 'Horaires', `Fermetures mal formées : ${erreursFermetures.join(' ; ')}`, 'garage.fermeturesDates / garage.ouvertJoursFeries');

  // Prestations
  const validees = services.filter((s) => s.valide);
  if (validees.length === 0) ajouter('bloquant', 'Prestations', 'Aucune prestation validée par le gérant', 'services[].valide');
  const aValider = services.filter((s) => !s.valide).map((s) => s.titre);
  if (aValider.length) ajouter('important', 'Prestations', `À confirmer (ligne par ligne) : ${aValider.join(', ')}`, 'services[].valide');
  for (const s of validees) {
    if (s.prix && !/TTC/i.test(s.prix)) ajouter('bloquant', 'Prestations', `Prix sans mention TTC pour « ${s.titre} » : « ${s.prix} »`, 'services[].prix');
  }
  if (!validees.some((s) => s.prix)) ajouter('utile', 'Prestations', 'Prix ou forfaits affichables (TTC)', 'services[].prix');
  const engAValider = engagements.filter((e) => !e.valide).map((e) => e.titre);
  if (engAValider.length) ajouter('important', 'Arguments', `À confirmer : ${engAValider.join(', ')}`, 'engagements[].valide');
  for (const e of engagements.filter((x) => x.valide && !x.texte)) ajouter('bloquant', 'Arguments', `Texte de l’argument « ${e.titre} » à écrire avec le gérant`, 'engagements[].texte');
  for (const s of validees.filter((x) => !x.textesValides)) ajouter('bloquant', 'Prestations', `Résumé et introduction de « ${s.titre} » à faire valider (ils apparaissent dans Google)`, 'services[].textesValides');

  // Paiement
  const P = garage.paiement;
  if (!P.moyens) ajouter('utile', 'Paiement', 'Moyens de paiement acceptés', 'garage.paiement.moyens');
  const paiementFractionneAnnonce = Boolean(P.facilites) || engagements.some((e) => e.titre === 'Paiement en plusieurs fois' && e.valide);
  if (paiementFractionneAnnonce && P.estUnCredit === null) ajouter('bloquant', 'Paiement', 'Paiement en plusieurs fois : s’agit-il d’un crédit (organisme, paiement fractionné) ?', 'garage.paiement.estUnCredit');
  if (paiementFractionneAnnonce && P.estUnCredit && !P.mentionCredit) ajouter('bloquant', 'Paiement', 'Mention légale obligatoire pour une offre de crédit (texte officiel en vigueur)', 'garage.paiement.mentionCredit');
  if (paiementFractionneAnnonce && !P.facilites) ajouter('bloquant', 'Paiement', 'Conditions exactes du paiement en plusieurs fois (échéances, frais, financeur)', 'garage.paiement.facilites');

  // Avis et présence en ligne
  if (!garage.liens.googleAvis) ajouter('important', 'Avis', 'Lien « Demander des avis » de la fiche Google Business Profile (à créer)', 'garage.liens.googleAvis');
  if (!garage.liens.googleFiche) ajouter('utile', 'Avis', 'Lien de la fiche Google Maps', 'garage.liens.googleFiche');
  if (!garage.liens.googlePlaceId) ajouter('utile', 'Avis', 'Identifiant de lieu Google (itinéraires exacts)', 'garage.liens.googlePlaceId');
  const AP = garage.avisPolitique;
  if (avis.length > 0 && (!AP.contrepartie || !AP.delaiPublication || !AP.dureeConservation)) {
    ajouter('bloquant', 'Avis', 'Politique de publication des avis : contrepartie, délai de publication, durée de conservation (D.111-17)', 'garage.avisPolitique');
  }

  // Mentions légales (art. 1-1 de la loi 2004-575 « LCEN », art. R.526-27 C. com., art. L.612-1 et L.616-1 C. conso)
  if (!['societe', 'ei'].includes(L.statut)) ajouter('bloquant', 'Mentions légales', 'Statut de l’exploitant : société ou entrepreneur individuel (Kbis / extrait RNE)', 'garage.legal.statut');
  if (!L.raisonSociale) ajouter('bloquant', 'Mentions légales', 'Dénomination sociale (ou nom de l’entrepreneur individuel)', 'garage.legal.raisonSociale');
  if (L.statut === 'societe') {
    if (!L.formeJuridique) ajouter('bloquant', 'Mentions légales', 'Forme juridique', 'garage.legal.formeJuridique');
    if (!L.capital) ajouter('bloquant', 'Mentions légales', 'Capital social', 'garage.legal.capital');
  }
  if (!L.siege) ajouter('bloquant', 'Mentions légales', L.statut === 'ei' ? 'Adresse de l’entreprise' : 'Adresse du siège social', 'garage.legal.siege');
  if (!L.siret) ajouter('bloquant', 'Mentions légales', 'Numéro SIRET de l’établissement', 'garage.legal.siret');
  if (!L.immatriculation) ajouter('bloquant', 'Mentions légales', 'Immatriculation (RCS ou RNE, telle qu’indiquée sur le Kbis / l’extrait)', 'garage.legal.immatriculation');
  if (L.tvaIntracom === null) ajouter('bloquant', 'Mentions légales', 'Numéro de TVA intracommunautaire (ou false si non assujetti)', 'garage.legal.tvaIntracom');
  if (!L.directeurPublication) ajouter('bloquant', 'Mentions légales', 'Directeur de la publication (représentant légal)', 'garage.legal.directeurPublication');
  const M = L.mediateur;
  if (!M || !M.nom || !M.adresse || !M.site) ajouter('bloquant', 'Mentions légales', 'Médiateur de la consommation : nom, adresse et site internet', 'garage.legal.mediateur');
  if (!H.nom || !H.adresse || !H.telephone) ajouter('bloquant', 'Mentions légales', 'Hébergeur du site : nom, adresse et téléphone', 'garage.hebergeur');
  if (!F.endpoint && (!H.transfertHorsUE || H.transfertHorsUE === 'non')) ajouter('bloquant', 'Confidentialité', 'Netlify Forms stocke les demandes aux États-Unis : recopier le cadre du transfert depuis la politique de Netlify (« non » impossible)', 'garage.hebergeur.transfertHorsUE');
  else if (H.nom && !H.transfertHorsUE) ajouter('important', 'Confidentialité', 'Pays de l’hébergeur et cadre d’un éventuel transfert hors UE (« non » si dans l’UE)', 'garage.hebergeur.transfertHorsUE');
  if (!F.dureeConservation) ajouter('bloquant', 'Confidentialité', 'Durée de conservation des demandes, décidée et appliquée par le gérant', 'garage.formulaire.dureeConservation');

  // Devis : gratuit ou payant ? (le client doit être informé à l'avance si le devis est payant)
  const D = garage.devis;
  if (D.payant === null) ajouter('important', 'Devis', 'Le devis est-il gratuit ou payant ? (affiché près du formulaire)', 'garage.devis.payant');
  else if (D.payant && (!D.prix || !/TTC/i.test(D.prix))) ajouter('bloquant', 'Devis', 'Prix du devis payant (TTC)', 'garage.devis.prix');
  if (D.diagnostic && !/TTC/i.test(D.diagnostic)) ajouter('bloquant', 'Devis', 'Prix du diagnostic préalable (TTC)', 'garage.devis.diagnostic');

  // Suivi
  if (!garage.analytics.plausibleDomain) ajouter('utile', 'Suivi', 'Mesure des appels et des demandes (Plausible, sans cookie)', 'garage.analytics.plausibleDomain');

  // Visuels
  if (!garage.visuels.photos.length) ajouter('important', 'Visuels', 'Photos réelles de l’atelier (dossier public/photos/)', 'garage.visuels.photos');
  if (!garage.visuels.logo) ajouter('utile', 'Visuels', 'Logo officiel (un logo typographique provisoire est utilisé)', 'garage.visuels.logo');

  return m;
}

export const ORDRE_NIVEAUX = { bloquant: 0, important: 1, utile: 2 };
