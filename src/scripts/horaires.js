// Statut « Ouvert / Fermé » calculé à l'heure de Paris, et mise en évidence du jour courant.
const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

function maintenantParis() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const index = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday'));
  return { jour: index, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

const enMinutes = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
const lisible = (t) => t.replace(/^0/, '').replace(':', 'h');

export function calculerStatut(horaires, { jour, minutes }) {
  const plagesDuJour = horaires[jour]?.plages || [];
  for (const [debut, fin] of plagesDuJour) {
    if (minutes >= enMinutes(debut) && minutes < enMinutes(fin)) {
      return { ouvert: true, texte: `Ouvert · ferme à ${lisible(fin)}` };
    }
  }
  for (let decalage = 0; decalage < 8; decalage++) {
    const j = (jour + decalage) % 7;
    for (const [debut] of horaires[j]?.plages || []) {
      if (decalage === 0 && enMinutes(debut) <= minutes) continue;
      const quand = decalage === 0 ? 'aujourd’hui' : decalage === 1 ? 'demain' : JOURS[j];
      return { ouvert: false, texte: `Fermé · ouvre ${quand} à ${lisible(debut)}` };
    }
  }
  return { ouvert: false, texte: 'Fermé' };
}

export function initialiserHoraires() {
  const maintenant = maintenantParis();
  document.querySelectorAll('[data-statut-horaires]').forEach((el) => {
    try {
      const statut = calculerStatut(JSON.parse(el.dataset.statutHoraires), maintenant);
      el.textContent = statut.texte;
      el.dataset.etat = statut.ouvert ? 'ouvert' : 'ferme';
      el.hidden = false;
    } catch {
      /* horaires mal formés : on n'affiche rien plutôt qu'une information fausse */
    }
  });
  document.querySelectorAll(`[data-tableau-horaires] tr[data-jour="${maintenant.jour}"]`).forEach((tr) => {
    tr.dataset.aujourdhui = 'true';
  });
}
