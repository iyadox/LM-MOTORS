import type { APIRoute } from 'astro';
import { BROUILLON } from '../lib/site.mjs';

// En version de travail, l'exploration reste autorisée pour que les moteurs voient le
// « noindex » des pages (balise meta + en-tête X-Robots-Tag) et n'indexent rien.
export const GET: APIRoute = ({ site }) => {
  const contenu = BROUILLON
    ? 'User-agent: *\nAllow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`;
  return new Response(contenu, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
