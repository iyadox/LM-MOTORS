/**
 * Avis affichés sur le site.
 *
 * Règle : uniquement de VRAIS avis, recopiés mot pour mot depuis la fiche Google, avec le prénom
 * ou les initiales tels qu'affichés publiquement. Sélection objective : les avis les plus récents,
 * QUELLE QUE SOIT LA NOTE (choisir seulement les bons avis est une pratique commerciale trompeuse,
 * art. L.121-4 C. conso). Jamais d'avis inventé, reformulé ou acheté.
 *
 * Exemple (dateExperience facultative, si l'auteur l'indique) :
 *   { texte: '…', auteur: 'Marie D.', date: '2026-11-03', dateExperience: 'octobre 2026', note: 5, source: 'Google', lien: 'https://…' }
 */
export const avis = [];
