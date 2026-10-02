// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL publique du site. À remplacer par le vrai nom de domaine une fois acheté
// (ou définir la variable d'environnement SITE_URL au moment du build).
const SITE_URL = process.env.SITE_URL || 'https://lm-motors.example';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !/\/(merci|brouillon|avis\/carte)\/$/.test(page),
    }),
  ],
});
