import { garage, acces } from '../data/garage.mjs';
import { services } from '../data/services.mjs';
import { avis } from '../data/avis.mjs';
import { communes, pagePrete } from '../data/communes.mjs';
import { versE164 } from './telephone.mjs';

/**
 * Mode du site.
 *  - « brouillon » (par défaut) : tout s'affiche, les éléments non confirmés sont signalés,
 *    le site est exclu des moteurs de recherche (noindex).
 *  - « production » : seuls les éléments confirmés s'affichent, le site est indexable.
 * Build de production : `npm run build:production` (lance d'abord la vérification).
 */
export const BROUILLON = import.meta.env.PUBLIC_MODE !== 'production';

export const servicesVisibles = services.filter((s) => s.valide || BROUILLON);
/** Communes dont la page est publiée (en production : seulement celles qui ont un vrai contenu). */
export const communesVisibles = communes.filter((c) => BROUILLON || pagePrete(c));
/** La page /avis/ n'a de sens que s'il y a un lien pour laisser un avis ou de vrais avis à montrer. */
export const pageAvisVisible = BROUILLON || Boolean(garage.liens.googleAvis) || avis.length > 0;

/** Liste lisible des prestations affichées : « entretien et vidange, freinage, pneus ». */
export function listePrestations(max = 4) {
  const noms = servicesVisibles.map((s) => s.titre.toLowerCase());
  if (noms.length === 0) return '';
  const pris = noms.slice(0, max);
  return pris.length > 1 ? `${pris.slice(0, -1).join(', ')} et ${pris.at(-1)}` : pris[0];
}

/** Élision : de('Auxerre') → « d’Auxerre », de('Venoy') → « de Venoy ». */
export const de = (nom) => (/^[AEIOUYÂÉÈÊÎÔ]/i.test(nom) ? `d’${nom}` : `de ${nom}`);

export { versE164 };

export function lienTel(numero) {
  const e = versE164(numero);
  return e ? `tel:${e}` : null;
}

export function lienWhatsApp(numero, texte = '') {
  const e = versE164(numero);
  if (!e) return null;
  return `https://wa.me/${e.slice(1)}${texte ? `?text=${encodeURIComponent(texte)}` : ''}`;
}

export function lienEmail(email, sujet = '') {
  if (!email) return null;
  return `mailto:${email}${sujet ? `?subject=${encodeURIComponent(sujet)}` : ''}`;
}

export const adresse = garage.adresse;

/** « 12 rue Robert Raclot » ou « rue Robert Raclot » si le numéro est inconnu. */
export const ligneRue = [adresse.numero, adresse.rue].filter(Boolean).join(' ');
/** Pour une phrase : « au 12 rue Robert Raclot » ou « rue Robert Raclot » si le numéro est inconnu. */
const rueMinuscule = adresse.rue.replace(/^(Rue|Avenue|Boulevard|Chemin|Route|Place|Impasse|Allée)\b/, (m) => m.toLowerCase());
export const rueTexte = adresse.numero ? `au ${adresse.numero} ${rueMinuscule}` : rueMinuscule;
export const ligneVille = `${adresse.codePostal} ${adresse.ville}`;
export const adresseComplete = [ligneRue, adresse.complement, ligneVille].filter(Boolean).join(', ');

const destinationTexte = encodeURIComponent(`${ligneRue}, ${ligneVille}`);
const placeId = garage.liens.googlePlaceId ? `&destination_place_id=${encodeURIComponent(garage.liens.googlePlaceId)}` : '';

/** Lien d'itinéraire Google Maps : fiche exacte si connue, sinon l'adresse. */
export const lienItineraire =
  garage.liens.googleFiche || `https://www.google.com/maps/dir/?api=1&destination=${destinationTexte}${placeId}`;

/** Itinéraire depuis une commune. */
export function lienItineraireDepuis(origine) {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origine)}&destination=${destinationTexte}${placeId}`;
}

export const telE164 = versE164(garage.telephone);
export const lienAppel = lienTel(garage.telephone);
export const whatsappE164 = versE164(garage.whatsapp);

/** Texte WhatsApp pré-rempli, éventuellement pour une prestation précise. */
export function lienWhatsAppDevis(prestation) {
  const texte = prestation
    ? `Bonjour ${garage.nom}, je souhaite un devis pour : ${prestation}. Mon véhicule : `
    : `Bonjour ${garage.nom}, je souhaite un devis pour mon véhicule : `;
  return lienWhatsApp(garage.whatsapp, texte);
}

export { JOURS, formaterPlages } from './horaires.mjs';

const JOURS_SCHEMA = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const geoValide = (v) => /^-?\d+\.\d{5,}$/.test(String(v));

/** Données structurées schema.org (AutoRepair) — uniquement les champs connus. */
export function donneesStructurees(siteUrl) {
  const d = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    '@id': `${siteUrl}#garage`,
    name: garage.nom,
    url: siteUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: [ligneRue, adresse.complement].filter(Boolean).join(', '),
      postalCode: adresse.codePostal,
      addressLocality: adresse.ville,
      addressRegion: adresse.region,
      addressCountry: adresse.pays,
    },
  };
  if (telE164) d.telephone = telE164;
  if (garage.email) d.email = garage.email;
  if (garage.geo && geoValide(garage.geo.lat) && geoValide(garage.geo.lng)) {
    d.geo = { '@type': 'GeoCoordinates', latitude: Number(garage.geo.lat), longitude: Number(garage.geo.lng) };
  }
  if (garage.horaires) {
    d.openingHoursSpecification = garage.horaires.flatMap((j, i) =>
      (j.plages || []).map(([opens, closes]) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${JOURS_SCHEMA[i]}`,
        opens,
        closes,
      })),
    );
  }
  if (garage.paiement.moyens) d.paymentAccepted = garage.paiement.moyens.join(', ');
  const sameAs = [garage.liens.googleFiche, garage.liens.facebook, garage.liens.instagram, garage.liens.vroomly].filter(Boolean);
  if (sameAs.length) d.sameAs = sameAs;
  const valides = services.filter((s) => s.valide);
  if (valides.length) {
    d.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Prestations',
      itemListElement: valides.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.titre, url: `${siteUrl}services/${s.slug}/` },
      })),
    };
  }
  return d;
}

export { garage, acces, avis };
