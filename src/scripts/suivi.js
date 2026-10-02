// Suivi des contacts (appels, WhatsApp, demandes de devis) — sans cookie, via Plausible si configuré.
export function suivre(evenement, proprietes) {
  try {
    if (typeof window.plausible === 'function') window.plausible(evenement, proprietes ? { props: proprietes } : undefined);
  } catch {
    /* le suivi ne doit jamais bloquer le visiteur */
  }
}

export function initialiserSuivi() {
  document.addEventListener('click', (e) => {
    const cible = e.target instanceof Element ? e.target.closest('[data-suivi]') : null;
    if (cible) suivre(cible.getAttribute('data-suivi'), { page: location.pathname });
  });
}
