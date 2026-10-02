// Captures d'écran du site généré (dist/) — usage : node scripts/captures.mjs [chemin...]
// Variables : DIST (dossier à servir), PORT, SORTIE (dossier des images), TRANCHES=1 (images découpées).
// Lance un petit serveur statique local puis photographie les pages en mobile et desktop.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

const DIST = process.env.DIST || new URL('../dist/', import.meta.url).pathname;
const PORT = Number(process.env.PORT || 4321);
const SORTIE = process.env.SORTIE || new URL('../.captures/', import.meta.url).pathname;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };

const serveur = createServer(async (req, res) => {
  let chemin = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let fichier = join(DIST, chemin);
  try {
    if ((await stat(fichier)).isDirectory()) fichier = join(fichier, 'index.html');
    res.writeHead(200, { 'content-type': TYPES[extname(fichier)] || 'application/octet-stream' });
    res.end(await readFile(fichier));
  } catch {
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    try { res.end(await readFile(join(DIST, '404.html'))); } catch { res.end('404'); }
  }
});
await new Promise((r) => serveur.listen(PORT, r));
await mkdir(SORTIE, { recursive: true });

const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['/'];
const navigateur = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const formats = [
  { nom: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { nom: 'desktop', viewport: { width: 1366, height: 900 }, deviceScaleFactor: 1 },
];
for (const f of formats) {
  const ctx = await navigateur.newContext({ viewport: f.viewport, deviceScaleFactor: f.deviceScaleFactor, isMobile: f.isMobile, hasTouch: f.hasTouch, locale: 'fr-FR', timezoneId: 'Europe/Paris' });
  const page = await ctx.newPage();
  const erreurs = [];
  page.on('console', (m) => m.type() === 'error' && erreurs.push(m.text()));
  page.on('pageerror', (e) => erreurs.push(String(e)));
  for (const p of pages) {
    await page.goto(`http://localhost:${PORT}${p}`, { waitUntil: 'networkidle' });
    const nom = (p.replace(/\//g, '_').replace(/^_|_$/g, '') || 'accueil') + `-${f.nom}.png`;
    await page.screenshot({ path: join(SORTIE, nom), fullPage: true });
    // Tranches lisibles (TRANCHES=1) : une image par hauteur d'écran x 2.
    if (process.env.TRANCHES) {
      const hauteur = await page.evaluate(() => document.documentElement.scrollHeight);
      const pas = f.viewport.height * 2;
      for (let y = 0, i = 1; y < hauteur; y += pas, i++) {
        await page.screenshot({ path: join(SORTIE, nom.replace('.png', `-${i}.png`)), fullPage: true, clip: { x: 0, y, width: f.viewport.width, height: Math.min(pas, hauteur - y) } });
      }
    }
    console.log(`${f.nom} ${p} → ${nom}${erreurs.length ? ' ERREURS: ' + erreurs.join(' | ') : ''}`);
    erreurs.length = 0;
  }
  await ctx.close();
}
await navigateur.close();
serveur.close();
