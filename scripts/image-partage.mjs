// Génère public/og.png (aperçu des partages WhatsApp / Facebook, 1200×630) à partir du
// logo typographique provisoire et de faits vérifiés uniquement. À relancer si le nom
// ou la charte changent : node scripts/image-partage.mjs
// Dès qu'une vraie photo existe (garage.visuels.photos), elle est utilisée à la place.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const racine = new URL('../', import.meta.url);
// Polices intégrées en base64 (une page générée ne peut pas lire de fichiers locaux).
const police = (chemin) => `data:font/woff2;base64,${readFileSync(new URL(`node_modules/${chemin}`, racine)).toString('base64')}`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'Barlow Condensed'; font-weight: 700; src: url('${police('@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2')}'); }
@font-face { font-family: 'Inter'; font-weight: 100 900; src: url('${police('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')}'); }
html, body { margin: 0; }
body { width: 1200px; height: 630px; box-sizing: border-box; padding: 80px 90px; color: #fff; font-family: 'Inter';
  background: linear-gradient(115deg, transparent 66%, rgba(255,106,19,.18) 66%, rgba(255,106,19,.18) 69%, transparent 69%),
    repeating-linear-gradient(135deg, rgba(255,255,255,.03) 0 2px, transparent 2px 22px), #101318;
  display: flex; flex-direction: column; justify-content: center; gap: 26px; }
.logo { display: flex; align-items: center; gap: 26px; }
.mono { width: 120px; height: 120px; background: #ff6a13; color: #101318; border-radius: 18px; transform: skewX(-8deg);
  display: grid; place-items: center; font-family: 'Barlow Condensed'; font-weight: 700; font-size: 66px; }
.mono span { transform: skewX(8deg); }
.nom { font-family: 'Barlow Condensed'; font-weight: 700; font-size: 112px; letter-spacing: .03em; line-height: 1; }
.titre { font-family: 'Barlow Condensed'; font-weight: 700; font-size: 64px; text-transform: uppercase; line-height: 1.05; }
.titre b { color: #ff6a13; font-weight: 700; }
.lieu { font-size: 32px; color: #c3cad3; font-weight: 500; }
</style></head><body>
<div class="logo"><div class="mono"><span>LM</span></div><div class="nom">LM MOTORS</div></div>
<div class="titre">Garage automobile<br><b>à Champs-sur-Yonne</b></div>
<div class="lieu">89290 · Yonne · au sud d’Auxerre</div>
</body></html>`;

const navigateur = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await navigateur.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: fileURLToPath(new URL('public/og.png', racine)) });
await navigateur.close();
console.log('public/og.png généré');
