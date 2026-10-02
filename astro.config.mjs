// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { writeFile } from 'node:fs/promises';

const PRODUCTION = process.env.PUBLIC_MODE === 'production';

// Adresse publique du site : SITE_URL, sinon l'URL fournie par Netlify au moment du build.
const SITE_URL = process.env.SITE_URL || process.env.URL || 'https://lm-motors.example';
if (PRODUCTION && /\.example(\/|$)/.test(SITE_URL)) {
  throw new Error('SITE_URL manquant : définir l’adresse définitive du site avant le build de production.');
}

/** En version de travail, tout le site est marqué « noindex » par en-tête HTTP (Netlify). */
const enteteBrouillon = {
  name: 'entete-brouillon',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      if (PRODUCTION) return;
      await writeFile(new URL('_headers', dir), '/*\n  X-Robots-Tag: noindex, nofollow\n');
    },
  },
};

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !/\/(merci|brouillon|avis\/carte)\/$/.test(page),
    }),
    enteteBrouillon,
  ],
});
