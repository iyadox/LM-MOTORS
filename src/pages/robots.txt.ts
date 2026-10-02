import type { APIRoute } from 'astro';
import { BROUILLON } from '../lib/site.mjs';

// En version de travail, le site est fermé aux moteurs de recherche.
export const GET: APIRoute = ({ site }) => {
  const contenu = BROUILLON
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`;
  return new Response(contenu, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
