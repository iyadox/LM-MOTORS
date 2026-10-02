// Statut « Ouvert / Fermé » calculé à l'heure de Paris (jours fériés et congés compris),
// mis à jour chaque minute, et mise en évidence du jour courant.
import { calculerStatut, maintenantParis } from '../lib/horaires.mjs';

function actualiser() {
  const maintenant = maintenantParis();
  document.querySelectorAll('[data-statut-horaires]').forEach((el) => {
    try {
      const { horaires, options } = JSON.parse(el.dataset.statutHoraires);
      const statut = calculerStatut(horaires, maintenant, options);
      if (!statut) {
        el.hidden = true; // information incertaine (jour férié sans réponse du gérant) : on n'affiche rien
        return;
      }
      el.textContent = statut.texte;
      el.dataset.etat = statut.ouvert ? 'ouvert' : 'ferme';
      el.hidden = false;
    } catch {
      el.hidden = true; // horaires mal formés : rien plutôt qu'une information fausse
    }
  });
  // Sur un site statique, un avis de congés passé disparaît sans attendre le prochain build.
  document.querySelectorAll('[data-fermeture-au]').forEach((p) => {
    p.hidden = maintenant.date > p.dataset.fermetureAu;
  });
  document.querySelectorAll('[data-tableau-horaires] tr[data-jour]').forEach((tr) => {
    tr.dataset.aujourdhui = String(Number(tr.dataset.jour) === maintenant.jour);
  });
}

export function initialiserHoraires() {
  actualiser();
  setInterval(actualiser, 60 * 1000);
}
