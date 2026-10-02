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
    let paramsRef = new URLSearchParams();
    if (document.referrer) {
      const ref = new URL(document.referrer);
      if (ref.hostname === location.hostname) {
        pagePrecedente = ref.pathname;
        paramsRef = ref.searchParams; // ex. accueil ouvert depuis la fiche Google avec ?utm_source=google
      } else provenance = ref.hostname;
    } else {
      provenance = 'accès direct';
    }
    const params = new URLSearchParams(location.search);
    const utm = (k) => params.get(k) || paramsRef.get(k);
    const campagne = [utm('utm_source'), utm('utm_medium'), utm('utm_campaign')].filter(Boolean).join(' / ');
    if (campagne) provenance = [provenance, campagne].filter(Boolean).join(' – ');
  } catch {
    /* référent illisible : sans conséquence */
  }
  return { pagePrecedente, provenance };
}

/** Sans rien stocker : les paramètres utm_* de la page courante suivent les liens vers le formulaire. */
function transmettreCampagne() {
  const params = new URLSearchParams(location.search);
  const utm = [...params].filter(([k]) => k.startsWith('utm_'));
  if (!utm.length) return;
  document.querySelectorAll('a[href^="/devis/"]').forEach((a) => {
    const url = new URL(a.getAttribute('href'), location.origin);
    for (const [k, v] of utm) if (!url.searchParams.has(k)) url.searchParams.set(k, v);
    a.setAttribute('href', url.pathname + url.search + url.hash);
  });
}

export function initialiserSuivi() {
  transmettreCampagne();
  document.addEventListener('click', (e) => {
    const cible = e.target instanceof Element ? e.target.closest('[data-suivi]') : null;
    if (cible) suivre(cible.getAttribute('data-suivi'), { lieu: cible.getAttribute('data-suivi-lieu') || 'page' });
  });
}
