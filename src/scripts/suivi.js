// Suivi des contacts (appels, WhatsApp, demandes de devis) — sans cookie, via Plausible si configuré.
// Mémorise aussi, pour la durée de la visite, la page d'arrivée et la provenance : elles sont
// jointes à la demande de devis pour que le garage sache d'où viennent ses clients.
const CLE_VISITE = 'lm-visite';

export function suivre(evenement, proprietes) {
  try {
    if (typeof window.plausible === 'function') window.plausible(evenement, proprietes ? { props: proprietes } : undefined);
  } catch {
    /* le suivi ne doit jamais bloquer le visiteur */
  }
}

/** { entree: '/garage-auxerre/', provenance: 'google.com' | 'direct', campagne: 'fiche-google' | '' } */
export function lireVisite() {
  try {
    return JSON.parse(sessionStorage.getItem(CLE_VISITE) || 'null');
  } catch {
    return null;
  }
}

function memoriserVisite() {
  try {
    if (sessionStorage.getItem(CLE_VISITE)) return;
    const params = new URLSearchParams(location.search);
    let provenance = 'direct';
    if (document.referrer) {
      const hote = new URL(document.referrer).hostname;
      if (hote !== location.hostname) provenance = hote;
    }
    const campagne = [params.get('utm_source'), params.get('utm_medium'), params.get('utm_campaign')].filter(Boolean).join(' / ');
    sessionStorage.setItem(CLE_VISITE, JSON.stringify({ entree: location.pathname, provenance, campagne }));
  } catch {
    /* stockage indisponible (navigation privée…) : sans conséquence */
  }
}

export function initialiserSuivi() {
  memoriserVisite();
  document.addEventListener('click', (e) => {
    const cible = e.target instanceof Element ? e.target.closest('[data-suivi]') : null;
    if (cible) suivre(cible.getAttribute('data-suivi'), { lieu: cible.getAttribute('data-suivi-lieu') || 'page' });
  });
}
