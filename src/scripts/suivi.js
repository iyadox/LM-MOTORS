// Suivi des contacts (appels, WhatsApp, demandes de devis) — sans cookie ni stockage sur l'appareil,
// via Plausible si configuré.
export function suivre(evenement, proprietes) {
  try {
    if (typeof window.plausible === 'function') window.plausible(evenement, proprietes ? { props: proprietes } : undefined);
  } catch {
    /* le suivi ne doit jamais bloquer le visiteur */
  }
}

/**
 * Origine de la demande, sans rien stocker sur l'appareil : la page du site depuis laquelle le
 * formulaire a été ouvert (référent transmis par le navigateur) et, si le visiteur arrive
 * directement sur le formulaire, le site d'où il vient et les paramètres utm_* de l'adresse.
 */
export function origineDemande() {
  let pagePrecedente = '';
  let provenance = '';
  try {
    if (document.referrer) {
      const ref = new URL(document.referrer);
      if (ref.hostname === location.hostname) pagePrecedente = ref.pathname;
      else provenance = ref.hostname;
    } else {
      provenance = 'accès direct';
    }
    const params = new URLSearchParams(location.search);
    const campagne = [params.get('utm_source'), params.get('utm_medium'), params.get('utm_campaign')].filter(Boolean).join(' / ');
    if (campagne) provenance = [provenance, campagne].filter(Boolean).join(' – ');
  } catch {
    /* référent illisible : sans conséquence */
  }
  return { pagePrecedente, provenance };
}

export function initialiserSuivi() {
  document.addEventListener('click', (e) => {
    const cible = e.target instanceof Element ? e.target.closest('[data-suivi]') : null;
    if (cible) suivre(cible.getAttribute('data-suivi'), { lieu: cible.getAttribute('data-suivi-lieu') || 'page' });
  });
}
