import type { APIRoute } from 'astro';
import { garage, telE164, ligneRue, adresse } from '../lib/site.mjs';

/** Fiche contact (vCard) du garage, générée seulement si le numéro de téléphone est connu. */
export function getStaticPaths() {
  return telE164 ? [{ params: { fichier: 'lm-motors' } }] : [];
}

export const GET: APIRoute = ({ site }) => {
  const lignes = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${garage.nom} (garage)`,
    `ORG:${garage.nom}`,
    `TEL;TYPE=WORK,VOICE:${telE164}`,
    garage.email ? `EMAIL;TYPE=WORK:${garage.email}` : null,
    `ADR;TYPE=WORK:;;${ligneRue};${adresse.ville};;${adresse.codePostal};France`,
    site ? `URL:${site.href}` : null,
    'END:VCARD',
  ].filter(Boolean);
  return new Response(lignes.join('\r\n') + '\r\n', { headers: { 'Content-Type': 'text/vcard; charset=utf-8' } });
};
