import type { APIRoute } from 'astro';
import { garage, versE164, ligneRue, adresse } from '../lib/site.mjs';

/** Fiche contact (vCard) du garage, générée seulement si le numéro de rappel est confirmé. */
const rappel = versE164(garage.formulaire.numeroRappel);
export function getStaticPaths() {
  return rappel ? [{ params: { fichier: 'lm-motors' } }] : [];
}

export const GET: APIRoute = ({ site }) => {
  const lignes = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${garage.nom};;;;`,
    `FN:${garage.nom} (garage)`,
    `ORG:${garage.nom}`,
    `TEL;TYPE=WORK,VOICE:${rappel}`,
    garage.email ? `EMAIL;TYPE=WORK:${garage.email}` : null,
    `ADR;TYPE=WORK:;;${ligneRue};${adresse.ville};;${adresse.codePostal};France`,
    site ? `URL:${site.href}` : null,
    'END:VCARD',
  ].filter(Boolean);
  return new Response(lignes.join('\r\n') + '\r\n', { headers: { 'Content-Type': 'text/vcard; charset=utf-8' } });
};
