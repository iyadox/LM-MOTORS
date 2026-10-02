import { garage, acces } from '../data/garage.mjs';
import { services } from '../data/services.mjs';

/**
 * Mode du site.
 *  - « brouillon » (par défaut) : tout s'affiche, les éléments non confirmés sont signalés,
 *    le site est exclu des moteurs de recherche (noindex).
 *  - « production » : seuls les éléments confirmés s'affichent, le site est indexable.
 * Build de production : `npm run build:production` (lance d'abord la vérification).
 */
export const BROUILLON = import.meta.env.PUBLIC_MODE !== 'production';

export const servicesVisibles = services.filter((s) => s.valide || BROUILLON);

/** '03 86 00 00 00' → 'tel:+33386000000' */
export function lienTel(numero) {
  if (!numero) return null;
  const chiffres = String(numero).replace(/[^\d+]/g, '');
  if (chiffres.startsWith('+')) return `tel:${chiffres}`;
  if (chiffres.startsWith('0')) return `tel:+33${chiffres.slice(1)}`;
  return `tel:${chiffres}`;
}

/** Numéro au format international E.164, pour les données structurées. */
export function telInternational(numero) {
  const l = lienTel(numero);
  return l ? l.replace('tel:', '') : null;
}

export function lienWhatsApp(numero, texte = '') {
  if (!numero) return null;
  const n = String(numero).replace(/\D/g, '');
  return `https://wa.me/${n}${texte ? `?text=${encodeURIComponent(texte)}` : ''}`;
}

export function lienEmail(email, sujet = '') {
  if (!email) return null;
  return `mailto:${email}${sujet ? `?subject=${encodeURIComponent(sujet)}` : ''}`;
}

export const adresse = garage.adresse;

/** « 12 Rue Robert Raclot » ou « Rue Robert Raclot » si le numéro est inconnu. */
export const ligneRue = [adresse.numero, adresse.rue].filter(Boolean).join(' ');
export const ligneVille = `${adresse.codePostal} ${adresse.ville}`;
export const adresseComplete = [ligneRue, adresse.complement, ligneVille].filter(Boolean).join(', ');

/** Lien d'itinéraire Google Maps : fiche exacte si connue, sinon recherche de l'adresse. */
export const lienItineraire =
  garage.liens.googleFiche ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ligneRue}, ${ligneVille}`)}`;

export const telephonePrincipal = garage.telephone;
export const lienAppel = lienTel(garage.telephone);
export const lienWhatsAppDevis = lienWhatsApp(
  garage.whatsapp,
  `Bonjour ${garage.nom}, je souhaite un devis pour mon véhicule : `,
);

export const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

/** [['08:00','12:00'],['14:00','18:30']] → '8h00 – 12h00 · 14h00 – 18h30' */
export function formaterPlages(plages) {
  if (!plages || plages.length === 0) return 'Fermé';
  const h = (t) => t.replace(/^0/, '').replace(':', 'h');
  return plages.map(([a, b]) => `${h(a)} – ${h(b)}`).join(' · ');
}

const JOURS_SCHEMA = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
      streetAddress: ligneRue,
      postalCode: adresse.codePostal,
      addressLocality: adresse.ville,
      addressRegion: adresse.region,
      addressCountry: adresse.pays,
    },
  };
  if (garage.telephone) d.telephone = telInternational(garage.telephone);
  if (garage.email) d.email = garage.email;
  if (garage.geo) d.geo = { '@type': 'GeoCoordinates', latitude: garage.geo.lat, longitude: garage.geo.lng };
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

export { garage, acces };
