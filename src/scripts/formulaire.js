// Formulaire de devis : validation champ par champ, photo compressée, envoi sans rechargement,
// objet d'e-mail explicite pour le garage, provenance du client, alternative WhatsApp.
// Sans JavaScript, le formulaire reste fonctionnel (envoi classique).
import { suivre, lireVisite } from './suivi.js';

const MESSAGES = {
  prestation: 'Choisissez une prestation (ou « Autre / je ne sais pas »).',
  vehicule: 'Indiquez la marque et le modèle du véhicule.',
  nom: 'Indiquez votre nom.',
  telephone: 'Indiquez un numéro de téléphone complet (10 chiffres).',
  email: 'Indiquez une adresse e-mail valide.',
  emailRequis: 'Indiquez votre e-mail : vous avez choisi d’être recontacté par e-mail.',
  date: 'Choisissez une date à partir d’aujourd’hui.',
  photo: 'Cette photo est trop lourde. Choisissez une autre photo ou envoyez la demande sans photo.',
};
const LIBELLES = {
  prestation: 'la prestation',
  vehicule: 'le véhicule',
  nom: 'votre nom',
  telephone: 'le téléphone',
  email: 'l’e-mail',
  date: 'la date',
  photo: 'la photo',
};
// Netlify limite la requête entière à 8 Mo : on vise bien en dessous.
const TAILLE_MAX_PHOTO = 5 * 1000 * 1000;
const COTE_MAX_PHOTO = 1600;
const CHAMPS_CACHES = ['photo', 'date', 'email'];

function aujourdhuiISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

const valeur = (form, nom) => (form.elements.namedItem(nom)?.value || '').trim();
const radio = (form, nom) => form.querySelector(`input[name="${nom}"]:checked`)?.value || '';

function verifier(form) {
  const erreurs = {};
  for (const n of ['prestation', 'vehicule', 'nom']) if (!valeur(form, n)) erreurs[n] = MESSAGES[n];
  const chiffres = valeur(form, 'telephone').replace(/\D/g, '');
  if (chiffres.length < 10 || chiffres.length > 15) erreurs.telephone = MESSAGES.telephone;
  const email = valeur(form, 'email');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) erreurs.email = MESSAGES.email;
  else if (!email && radio(form, 'recontact') === 'E-mail') erreurs.email = MESSAGES.emailRequis;
  const date = valeur(form, 'date_souhaitee');
  if (date && date < aujourdhuiISO()) erreurs.date = MESSAGES.date;
  return erreurs;
}

/** Affiche les erreurs sous chaque champ et les relie au champ (aria-invalid, aria-describedby). */
function marquer(form, erreurs) {
  form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  form.querySelectorAll('.champ__erreur').forEach((p) => {
    p.hidden = true;
    p.textContent = '';
  });
  for (const [nom, texte] of Object.entries(erreurs)) {
    const id = nom === 'date' ? 'date' : nom;
    const champ = form.querySelector(`#${id}`);
    const zone = form.querySelector(`#err-${id}`);
    champ?.setAttribute('aria-invalid', 'true');
    if (zone) {
      zone.textContent = texte;
      zone.hidden = false;
    }
  }
  // Une erreur dans les précisions : ouvrir la section pour la rendre visible.
  if (Object.keys(erreurs).some((n) => CHAMPS_CACHES.includes(n))) form.querySelector('[data-precisions]')?.setAttribute('open', '');
}

function afficherMessage(zone, type, html) {
  zone.dataset.type = type;
  zone.hidden = false;
  // Contenu injecté au tick suivant, pour une annonce fiable par les lecteurs d'écran.
  requestAnimationFrame(() => {
    zone.innerHTML = html;
    zone.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });
}

/** Réduit une photo de smartphone (souvent 5 à 15 Mo) à ~1600 px en JPEG : quelques centaines de Ko. */
async function preparerPhoto(fichier) {
  if (!fichier || !fichier.size) return { fichier: null };
  try {
    const image = await createImageBitmap(fichier);
    const echelle = Math.min(1, COTE_MAX_PHOTO / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.width * echelle);
    canvas.height = Math.round(image.height * echelle);
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.8));
    if (blob && blob.size < fichier.size && blob.size <= TAILLE_MAX_PHOTO) return { fichier: new File([blob], 'photo.jpg', { type: 'image/jpeg' }) };
  } catch {
    /* format non décodable par le navigateur (ex. HEIC) : on garde l'original s'il est assez léger */
  }
  return fichier.size <= TAILLE_MAX_PHOTO ? { fichier } : { fichier: null, retiree: true };
}

function resumerPourObjet(form) {
  const morceaux = [valeur(form, 'prestation'), valeur(form, 'vehicule'), valeur(form, 'commune')].filter(Boolean);
  return `Demande de devis – ${morceaux.join(' – ')} – rappel : ${radio(form, 'recontact') || 'Appel'}`.slice(0, 180);
}

async function envoyer(form, donnees) {
  const reponse = await fetch(form.dataset.endpoint || '/', { method: 'POST', body: donnees, headers: { Accept: 'application/json' } });
  if (!reponse.ok) {
    const e = new Error(`HTTP ${reponse.status}`);
    e.status = reponse.status;
    throw e;
  }
}

function messageEchec(form, statut) {
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  if (form.dataset.brouillon === 'true') {
    if (local) return 'Version de travail en local : l’envoi des demandes ne fonctionne qu’une fois le site publié sur Netlify.';
    if (statut === 404) return 'Erreur 404 : la détection des formulaires n’est pas activée sur Netlify (Forms → Enable form detection, puis redéployer).';
  }
  const alternatives = [];
  if (form.dataset.telephone) alternatives.push(`appelez le <a href="${form.dataset.telephoneLien}">${form.dataset.telephone}</a>`);
  if (form.dataset.whatsapp) alternatives.push('utilisez le bouton WhatsApp ci-dessous');
  if (form.dataset.email) alternatives.push(`écrivez à <a href="mailto:${form.dataset.email}">${form.dataset.email}</a>`);
  const code = statut ? ` (erreur ${statut})` : '';
  return `L’envoi n’a pas fonctionné${code}. Réessayez dans un instant${alternatives.length ? `, ou ${alternatives.join(', ou ')}` : ''}.`;
}

function texteWhatsApp(form, nomGarage) {
  const v = (n) => valeur(form, n);
  const date = v('date_souhaitee');
  const dateLisible = date ? new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : '';
  const moment = radio(form, 'creneau');
  return [
    `Bonjour ${nomGarage}, je souhaite un devis.`,
    v('prestation') && `Prestation : ${v('prestation')}`,
    v('vehicule') && `Véhicule : ${v('vehicule')}`,
    v('immatriculation') && `Immatriculation : ${v('immatriculation')}`,
    v('kilometrage') && `Kilométrage : ${v('kilometrage')}`,
    v('message') && `Détails : ${v('message')}`,
    dateLisible && `Date souhaitée : ${dateLisible}${moment && moment !== 'Indifférent' ? ` (${moment.toLowerCase()})` : ''}`,
    v('commune') && `Commune : ${v('commune')}`,
    v('nom') && `Nom : ${v('nom')}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function initialiserFormulaire() {
  const form = document.querySelector('[data-formulaire-devis]');
  if (!form) return;
  const zone = form.querySelector('[data-message-formulaire]');
  const bouton = form.querySelector('[data-bouton-envoi]');
  const libelleBouton = form.querySelector('[data-libelle-envoi]');
  const params = new URLSearchParams(location.search);

  // Pré-remplissage depuis une page de prestation ou de commune.
  const slug = params.get('prestation');
  if (slug) {
    const option = form.querySelector(`option[data-slug="${CSS.escape(slug)}"]`);
    if (option) option.selected = true;
  }
  const commune = params.get('commune');
  if (commune) form.elements.namedItem('commune').value = commune.slice(0, 60);
  const date = form.querySelector('#date');
  if (date) date.min = aujourdhuiISO();

  // L'e-mail devient obligatoire si l'on demande à être recontacté par e-mail.
  const mentionEmail = form.querySelector('[data-email-facultatif]');
  form.addEventListener('change', (e) => {
    if (e.target.name === 'recontact' && mentionEmail) mentionEmail.hidden = e.target.value === 'E-mail';
    if (e.target.name === 'photo') form.querySelector('[data-avertissement-photo]')?.toggleAttribute('hidden', !e.target.files?.length);
  });

  // Une erreur disparaît dès que le champ est corrigé.
  form.addEventListener('input', (e) => {
    const champ = e.target;
    if (champ.getAttribute?.('aria-invalid') === 'true') {
      champ.removeAttribute('aria-invalid');
      const z = form.querySelector(`#err-${champ.id}`);
      if (z) z.hidden = true;
    }
  });

  let commence = false;
  form.addEventListener('focusin', () => {
    if (!commence) {
      commence = true;
      suivre('Formulaire commencé');
    }
  });

  let enCours = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (enCours) return;
    const erreurs = verifier(form);
    marquer(form, erreurs);
    const noms = Object.keys(erreurs);
    if (noms.length) {
      afficherMessage(zone, 'erreur', `Merci de corriger : ${noms.map((n) => LIBELLES[n]).join(', ')}.`);
      const premier = form.querySelector(`#${noms[0] === 'date' ? 'date' : noms[0]}`);
      setTimeout(() => premier?.focus({ preventScroll: true }), 400);
      return;
    }

    enCours = true;
    bouton.disabled = true;
    libelleBouton.textContent = 'Envoi en cours…';
    zone.hidden = true;

    const donnees = new FormData(form);
    donnees.set('subject', resumerPourObjet(form));
    const visite = lireVisite();
    if (visite) {
      donnees.set('provenance', [visite.provenance, visite.campagne].filter(Boolean).join(' – '));
      donnees.set('page_entree', visite.entree);
    }
    const photo = await preparerPhoto(form.elements.namedItem('photo')?.files?.[0]);
    if (photo.fichier) donnees.set('photo', photo.fichier);
    else {
      donnees.delete('photo');
      if (photo.retiree) donnees.set('remarque', 'Photo jointe trop lourde : non transmise.');
    }

    try {
      try {
        await envoyer(form, donnees);
      } catch (erreur) {
        // Une photo peut faire échouer l'envoi (taille, réseau lent) : on réessaie sans elle.
        if (!donnees.get('photo') || erreur.status === 404) throw erreur;
        donnees.delete('photo');
        donnees.set('remarque', 'L’envoi de la photo a échoué : demandez-la au client si besoin.');
        await envoyer(form, donnees);
      }
      try {
        sessionStorage.setItem(
          'lm-demande',
          JSON.stringify({ prestation: valeur(form, 'prestation'), vehicule: valeur(form, 'vehicule'), telephone: valeur(form, 'telephone'), recontact: radio(form, 'recontact') || 'Appel' }),
        );
      } catch {
        /* stockage indisponible : la page de remerciement affichera le texte générique */
      }
      suivre('Demande devis envoyée', { prestation: valeur(form, 'prestation') });
      location.assign('/merci/');
    } catch (erreur) {
      afficherMessage(zone, 'erreur', messageEchec(form, erreur.status));
      bouton.disabled = false;
      libelleBouton.textContent = 'Envoyer ma demande';
      enCours = false;
    }
  });

  form.querySelector('[data-envoi-whatsapp]')?.addEventListener('click', () => {
    const numero = form.dataset.whatsapp;
    if (!numero) return;
    suivre('WhatsApp', { lieu: 'formulaire' });
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texteWhatsApp(form, form.dataset.nomGarage))}`, '_blank', 'noopener');
  });
}
