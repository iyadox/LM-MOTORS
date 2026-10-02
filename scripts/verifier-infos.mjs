#!/usr/bin/env node
// Liste les informations manquantes avant la mise en ligne.
//   npm run verifier            → affiche la liste
//   node scripts/verifier-infos.mjs --strict → échoue s'il reste un élément bloquant
//                                              (utilisé par `npm run build:production`)
import { listerManques, ORDRE_NIVEAUX } from '../src/data/manques.mjs';

const strict = process.argv.includes('--strict');
const manques = listerManques().sort((a, b) => ORDRE_NIVEAUX[a.niveau] - ORDRE_NIVEAUX[b.niveau]);
const symboles = { bloquant: '✖', important: '!', utile: '·' };

if (manques.length === 0) {
  console.log('✔ Toutes les informations sont renseignées.');
  process.exit(0);
}

console.log('\nInformations à compléter (src/data/*.mjs) :\n');
for (const m of manques) {
  console.log(`  ${symboles[m.niveau]} [${m.niveau.padEnd(9)}] ${m.rubrique} — ${m.libelle}${m.aide ? `  (${m.aide})` : ''}`);
}
const bloquants = manques.filter((m) => m.niveau === 'bloquant').length;
console.log(`\n${bloquants} bloquant(s), ${manques.length - bloquants} autre(s).\n`);

if (strict && bloquants > 0) {
  console.error('✖ Mise en ligne refusée : des informations bloquantes manquent (aucune information ne doit être inventée).');
  process.exit(1);
}
