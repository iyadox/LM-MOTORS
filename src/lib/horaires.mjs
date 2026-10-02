/**
 * Logique des horaires, sans dépendance au navigateur : utilisée par la page
 * (statut « Ouvert / Fermé » en direct) et par `npm run verifier` (contrôle du format).
 */
export const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;

export const enMinutes = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
const lisible = (t) => t.replace(/^0/, '').replace(':', 'h');

/** Renvoie la liste des erreurs de format (vide si les horaires sont corrects). */
export function validerHoraires(horaires) {
  const erreurs = [];
  if (!Array.isArray(horaires) || horaires.length !== 7) return ['7 jours attendus, du lundi au dimanche'];
  horaires.forEach((j, i) => {
    if (j?.jour !== JOURS[i]) erreurs.push(`entrée ${i + 1} : « ${JOURS[i]} » attendu, « ${j?.jour} » trouvé`);
    if (!Array.isArray(j?.plages)) {
      erreurs.push(`${JOURS[i]} : « plages » doit être une liste`);
      return;
    }
    let finPrecedente = -1;
    for (const p of j.plages) {
      if (!Array.isArray(p) || p.length !== 2 || !HEURE.test(p[0]) || !HEURE.test(p[1])) {
        erreurs.push(`${JOURS[i]} : plage ${JSON.stringify(p)} invalide (format HH:MM attendu)`);
        continue;
      }
      if (enMinutes(p[0]) >= enMinutes(p[1])) erreurs.push(`${JOURS[i]} : ${p[0]} doit être avant ${p[1]}`);
      if (enMinutes(p[0]) < finPrecedente) erreurs.push(`${JOURS[i]} : plages dans le désordre ou qui se chevauchent`);
      finPrecedente = enMinutes(p[1]);
    }
  });
  return erreurs;
}

const DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;
const dateValide = (x) => typeof x === 'string' && DATE_ISO.test(x) && new Date(`${x}T00:00:00Z`).toISOString().slice(0, 10) === x;

/** Vérifie les fermetures datées et la réponse sur les jours fériés. Renvoie la liste des erreurs. */
export function validerFermetures(fermetures, ouvertJoursFeries) {
  const erreurs = [];
  if (![true, false, null].includes(ouvertJoursFeries)) erreurs.push('ouvertJoursFeries doit valoir true, false ou null');
  if (!Array.isArray(fermetures)) return [...erreurs, 'fermeturesDates doit être une liste'];
  fermetures.forEach((f, i) => {
    if (!dateValide(f?.du) || !dateValide(f?.au)) erreurs.push(`fermeture ${i + 1} : dates « du » et « au » au format AAAA-MM-JJ attendues`);
    else if (f.du > f.au) erreurs.push(`fermeture ${i + 1} : « du » doit précéder « au »`);
  });
  return erreurs;
}

const iso = (a, m, j) => `${a}-${String(m).padStart(2, '0')}-${String(j).padStart(2, '0')}`;

/** Jours fériés en France métropolitaine (hors Alsace-Moselle), au format AAAA-MM-JJ. */
export function joursFeries(annee) {
  // Dimanche de Pâques (algorithme de Meeus / Jones / Butcher)
  const a = annee % 19;
  const b = Math.floor(annee / 100);
  const c = annee % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mois = Math.floor((h + l - 7 * m + 114) / 31);
  const jour = ((h + l - 7 * m + 114) % 31) + 1;
  const paques = Date.UTC(annee, mois - 1, jour);
  const decale = (n) => {
    const x = new Date(paques + n * 86400000);
    return iso(x.getUTCFullYear(), x.getUTCMonth() + 1, x.getUTCDate());
  };
  return [
    iso(annee, 1, 1),
    decale(1), // lundi de Pâques
    iso(annee, 5, 1),
    iso(annee, 5, 8),
    decale(39), // Ascension
    decale(50), // lundi de Pentecôte
    iso(annee, 7, 14),
    iso(annee, 8, 15),
    iso(annee, 11, 1),
    iso(annee, 11, 11),
    iso(annee, 12, 25),
  ];
}

/** Ajoute n jours à une date AAAA-MM-JJ. */
function plusJours(dateISO, n) {
  const [a, m, j] = dateISO.split('-').map(Number);
  const x = new Date(Date.UTC(a, m - 1, j) + n * 86400000);
  return iso(x.getUTCFullYear(), x.getUTCMonth() + 1, x.getUTCDate());
}

const formatDate = (dateISO) =>
  new Date(`${dateISO}T12:00:00Z`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

/**
 * Statut à un instant donné.
 * @param horaires  tableau validé de 7 jours
 * @param maintenant { date: 'AAAA-MM-JJ', jour: 0 (lundi) … 6, minutes: depuis minuit } — heure de Paris
 * @param options   { ouvertJoursFeries: true|false|null, fermeturesDates: [{du, au, texte}] }
 * @returns { ouvert, texte } ou null si l'on ne peut pas donner une information sûre.
 */
export function calculerStatut(horaires, maintenant, options = {}) {
  const { ouvertJoursFeries = null, fermeturesDates = [] } = options;
  const feries = new Set([...joursFeries(Number(maintenant.date.slice(0, 4))), ...joursFeries(Number(maintenant.date.slice(0, 4)) + 1)]);
  const enFermeture = (d) => fermeturesDates.find((f) => d >= f.du && d <= f.au);
  const fermeLe = (d) => Boolean(enFermeture(d)) || (feries.has(d) && ouvertJoursFeries === false);

  // Jour férié sans réponse du gérant : on ne sait pas, on n'affiche rien.
  if (feries.has(maintenant.date) && ouvertJoursFeries === null) return null;

  const fermeture = enFermeture(maintenant.date);
  const plagesDuJour = fermeLe(maintenant.date) ? [] : [...(horaires[maintenant.jour]?.plages || [])].sort((x, y) => enMinutes(x[0]) - enMinutes(y[0]));
  for (const [debut, fin] of plagesDuJour) {
    if (maintenant.minutes >= enMinutes(debut) && maintenant.minutes < enMinutes(fin)) {
      return { ouvert: true, texte: `Ouvert · ferme à ${lisible(fin)}` };
    }
  }

  const raison = fermeture ? ` (${fermeture.texte || 'fermeture exceptionnelle'})` : feries.has(maintenant.date) ? ' (jour férié)' : '';
  // Prochaine ouverture, en cherchant jusqu'à 60 jours (congés compris).
  for (let decalage = 0; decalage <= 60; decalage++) {
    const date = plusJours(maintenant.date, decalage);
    const j = (maintenant.jour + decalage) % 7;
    const plages = [...(horaires[j]?.plages || [])].sort((x, y) => enMinutes(x[0]) - enMinutes(y[0]));
    if (fermeLe(date)) continue;
    // Jour férié dont on ignore la règle : on ne peut pas annoncer la prochaine ouverture.
    if (feries.has(date) && ouvertJoursFeries === null) {
      if (plages.length) return { ouvert: false, texte: `Fermé${raison}` };
      continue;
    }
    for (const [debut] of plages) {
      if (decalage === 0 && enMinutes(debut) <= maintenant.minutes) continue;
      let quand;
      if (decalage === 0) quand = 'aujourd’hui';
      else if (decalage === 1) quand = 'demain';
      else if (decalage < 7) quand = JOURS[j].toLowerCase();
      else if (decalage === 7) quand = `${JOURS[j].toLowerCase()} prochain`;
      else quand = `le ${formatDate(date)}`;
      return { ouvert: false, texte: `Fermé${raison} · ouvre ${quand} à ${lisible(debut)}` };
    }
  }
  return { ouvert: false, texte: `Fermé${raison}` };
}

/** Instant présent à l'heure de Paris. */
export function maintenantParis(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    jour: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday')),
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

/** '[['08:00','12:00'],['14:00','18:30']]' → '8h00 – 12h00 · 14h00 – 18h30' */
export function formaterPlages(plages) {
  if (!plages || plages.length === 0) return 'Fermé';
  return plages.map(([a, b]) => `${lisible(a)} – ${lisible(b)}`).join(' · ');
}
