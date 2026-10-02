// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { pagesMasquees } from './src/lib/visibilite.mjs';

// Une seule source pour le mode : variables d'environnement, puis fichier .env (comme Vite).
const ENV = { ...loadEnv('production', process.cwd(), ['PUBLIC_', 'SITE_']), ...process.env };
const PRODUCTION = ENV.PUBLIC_MODE === 'production';

// Adresse publique du site : SITE_URL, sinon l'URL fournie par Netlify au moment du build.
const SITE_URL = ENV.SITE_URL || ENV.URL || 'https://lm-motors.example';
const masquees = pagesMasquees(PRODUCTION);

/**
 * Garde-fous intégrés au build lui-même (ils s'appliquent quelle que soit la commande) :
 *  - production : refus si une information bloquante manque, puis contrôle du site généré ;
 *  - brouillon : tout le site est marqué « noindex » par en-tête HTTP (Netlify).
 */
const gardeFous = {
  name: 'garde-fous',
  hooks: {
    'astro:config:setup': async ({ command }) => {
      if (command !== 'build' || !PRODUCTION) return;
      // manques.mjs lit process.env : y reporter une adresse définie dans .env.
      if (ENV.SITE_URL && !process.env.SITE_URL) process.env.SITE_URL = ENV.SITE_URL;
      const { listerManques } = await import('./src/data/manques.mjs');
      const bloquants = listerManques().filter((m) => m.niveau === 'bloquant');
      if (bloquants.length) {
        throw new Error(`Production refusée (${bloquants.length} information(s) bloquante(s)) : ${bloquants.map((m) => m.libelle).join(' ; ')}. Voir npm run verifier.`);
      }
    },
    'astro:build:done': async ({ dir }) => {
      if (!PRODUCTION) {
        await writeFile(new URL('_headers', dir), '/*\n  X-Robots-Tag: noindex, nofollow\n');
        return;
      }
      // Vraies redirections HTTP pour les pages non publiées (« ! » : un fichier existe à ce chemin).
      if (masquees.length) await writeFile(new URL('_redirects', dir), masquees.map((p) => `${p} / 301!`).join('\n') + '\n');
      execFileSync('node', [fileURLToPath(new URL('./scripts/controle-build.mjs', import.meta.url))], {
        env: { ...process.env, DIST: fileURLToPath(dir) },
        stdio: 'inherit',
      });
    },
  },
};

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => {
        const chemin = new URL(page).pathname;
        return !/\/(merci|brouillon|avis\/carte)\/$/.test(chemin) && !masquees.includes(chemin);
      },
    }),
    gardeFous,
  ],
});
