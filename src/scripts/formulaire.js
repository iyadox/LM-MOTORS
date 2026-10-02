// Amélioration du formulaire de devis : validation claire, envoi sans rechargement,
// suivi de conversion et alternative WhatsApp. Sans JavaScript, le formulaire reste fonctionnel.
import { suivre } from './suivi.js';

const LIBELLES = {
  prestation: 'la prestation souhaitée',
  marque: 'la marque du véhicule',
  modele: 'le modèle du véhicule',
  nom: 'votre nom',
  telephone: 'un numéro de téléphone valide',
  email: 'une adresse e-mail valide',
  consentement: 'votre accord pour l’utilisation de vos informations',
  photo: 'une photo de 8 Mo maximum',
};
const TAILLE_MAX_PHOTO = 8 * 1024 * 1024;

function aujourdhuiISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function champsInvalides(form) {
  const invalides = [];
  const valeur = (n) => (form.elements.namedItem(n)?.value || '').trim();

  for (const n of ['prestation', 'marque', 'modele', 'nom']) if (!valeur(n)) invalides.push(n);
  const chiffres = valeur('telephone').replace(/\D/g, '');
  if (chiffres.length < 10 || chiffres.length > 15) invalides.push('telephone');
  const email = valeur('email');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) invalides.push('email');
  const photo = form.elements.namedItem('photo');
  if (photo?.files?.[0] && photo.files[0].size > TAILLE_MAX_PHOTO) invalides.push('photo');
  if (!form.elements.namedItem('consentement')?.checked) invalides.push('consentement');
  return invalides;
}

function afficherMessage(zone, type, html) {
  zone.dataset.type = type;
  zone.innerHTML = html;
  zone.hidden = false;
}

function marquer(form, invalides) {
  for (const el of form.querySelectorAll('[aria-invalid]')) el.removeAttribute('aria-invalid');
  for (const n of invalides) form.elements.namedItem(n)?.setAttribute('aria-invalid', 'true');
}

function texteWhatsApp(form, nomGarage) {
  const v = (n) => (form.elements.namedItem(n)?.value || '').trim();
  const lignes = [
    `Bonjour ${nomGarage}, je souhaite un devis.`,
    v('prestation') && `Prestation : ${v('prestation')}`,
    (v('marque') || v('modele')) && `Véhicule : ${[v('marque'), v('modele')].filter(Boolean).join(' ')}`,
    v('immatriculation') && `Immatriculation : ${v('immatriculation')}`,
    v('kilometrage') && `Kilométrage : ${v('kilometrage')}`,
    v('message') && `Détails : ${v('message')}`,
    v('date_souhaitee') && `Date souhaitée : ${v('date_souhaitee')}`,
    v('nom') && `Nom : ${v('nom')}`,
  ];
  return lignes.filter(Boolean).join('\n');
}

export function initialiserFormulaire() {
  const form = document.querySelector('[data-formulaire-devis]');
  if (!form) return;
  const zone = form.querySelector('[data-message-formulaire]');
  const bouton = form.querySelector('[data-bouton-envoi]');
  const libelleBouton = form.querySelector('[data-libelle-envoi]');

  // Prestation pré-sélectionnée depuis une page de service : /devis/?prestation=freinage
  const slug = new URLSearchParams(location.search).get('prestation');
  if (slug) {
    const option = form.querySelector(`option[data-slug="${CSS.escape(slug)}"]`);
    if (option) option.selected = true;
  }
  const date = form.elements.namedItem('date');
  if (date) date.min = aujourdhuiISO();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const invalides = champsInvalides(form);
    marquer(form, invalides);
    if (invalides.length) {
      afficherMessage(zone, 'erreur', `Merci d’indiquer ${invalides.map((n) => LIBELLES[n]).join(', ')}.`);
      form.elements.namedItem(invalides[0])?.focus();
      return;
    }

    bouton.setAttribute('aria-disabled', 'true');
    bouton.disabled = true;
    libelleBouton.textContent = 'Envoi en cours…';
    zone.hidden = true;

    try {
      const reponse = await fetch(form.dataset.endpoint || '/', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
      suivre('Demande devis envoyée', { prestation: form.elements.namedItem('prestation').value });
      location.assign('/merci/');
    } catch {
      const brouillon = form.dataset.brouillon === 'true';
      const tel = form.dataset.telephone;
      afficherMessage(
        zone,
        'erreur',
        brouillon
          ? 'Version de travail : l’envoi des demandes sera actif une fois le site publié (Netlify Forms ou service de formulaires configuré).'
          : `L’envoi n’a pas fonctionné. Réessayez dans un instant${tel ? `, ou appelez directement le garage au <a href="${form.dataset.telephoneLien}">${tel}</a>` : ''}.`,
      );
      bouton.disabled = false;
      bouton.removeAttribute('aria-disabled');
      libelleBouton.textContent = 'Envoyer ma demande';
    }
  });

  form.querySelector('[data-envoi-whatsapp]')?.addEventListener('click', () => {
    const numero = form.dataset.whatsapp;
    if (!numero) return;
    suivre('WhatsApp', { depuis: 'formulaire' });
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(texteWhatsApp(form, form.dataset.nomGarage))}`;
    window.open(url, '_blank', 'noopener');
  });
}
