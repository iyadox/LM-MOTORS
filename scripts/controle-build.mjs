#!/usr/bin/env node
// Contrôle du site généré (dist/), lancé après `npm run build:production` :
//  - aucune mention « À confirmer / À compléter » ni prestation non validée dans les pages ;
//  - aucun domaine provisoire (*.example) ;
//  - liens internes valides, JSON-LD lisible ;
//  - longueur des titres et descriptions (avertissement seulement).
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { services } from '../src/data/services.mjs';

const DIST = process.env.DIST || new URL('../dist/', import.meta.url).pathname;
const production = !process.argv.includes('--brouillon');
const erreurs = [];
const avertissements = [];

async function lister(dossier) {
  const sortie = [];
  for (const nom of await readdir(dossier)) {
    const chemin = join(dossier, nom);
    if ((await stat(chemin)).isDirectory()) sortie.push(...(await lister(chemin)));
    else sortie.push(chemin);
  }
  return sortie;
}

const fichiers = await lister(DIST);
const existe = new Set(fichiers.map((f) => '/' + relative(DIST, f)));
const cible = (href) => {
  const chemin = decodeURIComponent(href.split(/[?#]/)[0]);
  if (!chemin) return true;
  return existe.has(chemin) || existe.has(chemin.replace(/\/?$/, '/index.html')) || existe.has(chemin + '.html');
};
const nonValides = services.filter((s) => !s.valide).map((s) => s.titre);

for (const f of fichiers.filter((x) => x.endsWith('.html'))) {
  const page = '/' + relative(DIST, f);
  const html = await readFile(f, 'utf8');
  const redirection = /http-equiv="refresh"/.test(html);
  if (production && !redirection) {
    if (/class="[^"]*\b(a-confirmer|manquant)\b/.test(html)) erreurs.push(`${page} : contient une mention « À confirmer / À compléter »`);
    const texte = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
    for (const t of nonValides) if (texte.includes(t)) erreurs.push(`${page} : cite la prestation non validée « ${t} »`);
  }
  if (production && /\.example\b/.test(html)) erreurs.push(`${page} : contient le domaine provisoire .example`);
  for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
    if (!href.startsWith('//') && !cible(href)) erreurs.push(`${page} : lien interne cassé ${href}`);
  }
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(json);
    } catch {
      erreurs.push(`${page} : JSON-LD illisible`);
    }
  }
  if (!redirection && !/noindex/.test(html)) {
    const titre = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '';
    const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
    if (titre.length > 65) avertissements.push(`${page} : titre de ${titre.length} caractères`);
    if (desc.length > 160) avertissements.push(`${page} : description de ${desc.length} caractères`);
  }
}

// Le sitemap ne doit lister que de vraies pages publiées (ni redirection, ni noindex).
for (const f of production ? fichiers.filter((x) => /sitemap-\d+\.xml$/.test(x)) : []) {
  const xml = await readFile(f, 'utf8');
  for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const chemin = new URL(loc).pathname;
    const html = join(DIST, chemin.endsWith('/') ? `${chemin}index.html` : chemin);
    let contenu = null;
    try {
      contenu = await readFile(html, 'utf8');
    } catch {
      erreurs.push(`sitemap : ${chemin} ne correspond à aucune page`);
      continue;
    }
    if (/http-equiv="refresh"/.test(contenu)) erreurs.push(`sitemap : ${chemin} est une redirection`);
    else if (/name="robots" content="noindex/.test(contenu)) erreurs.push(`sitemap : ${chemin} est en noindex`);
  }
}

for (const a of avertissements) console.warn(`  ! ${a}`);
for (const e of erreurs) console.error(`  ✖ ${e}`);
console.log(`Contrôle du site : ${erreurs.length} erreur(s), ${avertissements.length} avertissement(s).`);
process.exit(erreurs.length ? 1 : 0);
