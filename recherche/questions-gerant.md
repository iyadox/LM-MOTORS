# Questionnaire pour le gérant de LM Motors

*À remplir avec le gérant avant la mise en ligne. Toutes ces informations sont introuvables en ligne ou incertaines (voir `dossier-lm-motors.md`, §10). Rien n’est publié sans sa validation. Les réponses se reportent dans `src/data/*.mjs` ; `npm run verifier` indique ce qui manque encore.*

## 1. Identité et mentions légales (Kbis ou extrait RNE à fournir)

- [ ] Qui exploite l’atelier de la rue Robert Raclot : la SAS LM MOTORS constituée en juin 2026 (siège à Vergigny), l’entreprise individuelle M LUCAS BUSIERE (SIREN 989 261 177), ou une autre structure ? → `legal.statut` (« societe » ou « ei »)
- [ ] Dénomination exacte, forme juridique et capital (société), ou nom et prénom (entrepreneur individuel).
- [ ] Adresse du siège, SIRET de l’établissement de Champs-sur-Yonne, immatriculation (RCS ou RNE) telle qu’écrite sur le Kbis, numéro de TVA intracommunautaire (ou « non assujetti »).
- [ ] Directeur de la publication : c’est le représentant légal (président de la SAS, ou l’entrepreneur lui-même). Accepte-t-il que son nom apparaisse ?
- [ ] Médiateur de la consommation avec lequel le garage a signé : nom, adresse, site internet (obligatoire ; liste officielle : economie.gouv.fr/mediation-conso).
- [ ] Depuis quand l’atelier est-il ouvert à Champs-sur-Yonne ? A-t-il repris un ancien garage ou local ?

## 2. Adresse, contact et horaires

- [ ] L’adresse « Rue Robert Raclot, 89290 Champs-sur-Yonne » est-elle exacte ? Quel numéro ? Quel bâtiment / local, quel repère (centre commercial Le Rami ?), quel parking ?
- [ ] Téléphone à afficher (fixe / mobile), numéro WhatsApp, e-mail professionnel.
- [ ] Le garage rappelle-t-il depuis le même numéro que celui affiché ? Sinon, depuis quel numéro ? (le client pourra l’enregistrer pour reconnaître l’appel) → `formulaire.numeroRappel`
- [ ] Horaires exacts (jours, pause de midi, samedi).
- [ ] Ouvert ou fermé les jours fériés ? (réponse unique pour tous les fériés ; sinon le statut « Ouvert / Fermé » n’est pas affiché ces jours-là) → `ouvertJoursFeries`
- [ ] Dates de fermeture prévues (congés, du … au …) → `fermeturesDates`

## 3. Demandes de devis reçues par le site

- [ ] À quelle adresse e-mail les demandes doivent-elles arriver ? Qui les traite, et sous quel délai peut-il répondre ?
- [ ] Par quels moyens répondez-vous aux demandes : appel, SMS, e-mail ? (seuls ces choix seront proposés au client) → `formulaire.modesReponse`
- [ ] Le devis est-il gratuit ? Sinon, quel prix TTC, et est-il déduit si les travaux sont faits ?
- [ ] Le devis reste-t-il gratuit quand il faut d’abord un diagnostic ou un démontage ? Sinon, prix TTC du diagnostic → `devis.diagnostic`
- [ ] Combien de temps garder les demandes reçues ? (proposition : le temps de traiter la demande et la durée de validité du devis)
- [ ] Après la mise en ligne : envoyer une demande test depuis un téléphone et confirmer sa réception (date).

## 4. Prestations : cocher ligne par ligne ce que le garage fait vraiment

*Seules les lignes cochées seront publiées. Une prestation sans aucune ligne cochée n’apparaît pas.*

### Entretien et vidange

- [ ] Le garage propose « Entretien et vidange »
  - [ ] Phrase de présentation (affichée dans Google) exacte pour ce garage : « Vidange, filtres et révision selon le carnet d’entretien de votre véhicule. » Sinon, la corriger :
  - [ ] Vidange de l’huile moteur et remplacement du filtre à huile
  - [ ] Remplacement des filtres à air, d’habitacle et à carburant selon les échéances
  - [ ] Contrôle et mise à niveau des liquides (refroidissement, frein, lave-glace)
  - [ ] Contrôle des points de sécurité : freins, pneus, éclairage, essuie-glaces
  - [ ] Prix ou forfait TTC affichable ? Si forfait : opérations et pièces comprises

### Freinage

- [ ] Le garage propose « Freinage »
  - [ ] Phrase de présentation (affichée dans Google) exacte pour ce garage : « Plaquettes, disques et liquide de frein. » Sinon, la corriger :
  - [ ] Contrôle de l’usure des plaquettes et des disques
  - [ ] Remplacement des plaquettes, des disques, des mâchoires ou des tambours
  - [ ] Purge et remplacement du liquide de frein
  - [ ] Contrôle du frein de stationnement
  - [ ] Prix ou forfait TTC affichable ? Si forfait : opérations et pièces comprises

### Pneus

- [ ] Le garage propose « Pneus »
  - [ ] Phrase de présentation (affichée dans Google) exacte pour ce garage : « Montage, équilibrage, réparation de crevaison et contrôle d’usure. » Sinon, la corriger :
  - [ ] Montage et équilibrage des pneus
  - [ ] Réparation de crevaison, lorsque l’emplacement et l’état du pneu le permettent
  - [ ] Contrôle de l’usure et de la pression
  - [ ] Permutation avant / arrière
  - [ ] Prix ou forfait TTC affichable ? Si forfait : opérations et pièces comprises

### Diagnostic électronique

- [ ] Le garage propose « Diagnostic électronique »
  - [ ] Phrase de présentation (affichée dans Google) exacte pour ce garage : « Lecture des défauts et recherche de panne quand un voyant s’allume. » Sinon, la corriger :
  - [ ] Lecture des codes défauts enregistrés par les calculateurs
  - [ ] Recherche de l’origine de la panne
  - [ ] Contrôle des capteurs concernés
  - [ ] Effacement des défauts après réparation
  - [ ] Prix ou forfait TTC affichable ? Si forfait : opérations et pièces comprises

### Courroie de distribution

- [ ] Le garage propose « Courroie de distribution »
  - [ ] Phrase de présentation (affichée dans Google) exacte pour ce garage : « Remplacement du kit de distribution à l’échéance prévue par le constructeur. » Sinon, la corriger :
  - [ ] Remplacement du kit de distribution : courroie, galets et, selon le modèle, pompe à eau
  - [ ] Contrôle de la chaîne de distribution sur les moteurs qui en sont équipés
  - [ ] Prix ou forfait TTC affichable ? Si forfait : opérations et pièces comprises

### Embrayage

- [ ] Le garage propose « Embrayage »
  - [ ] Phrase de présentation (affichée dans Google) exacte pour ce garage : « Embrayage qui patine, pédale dure ou vitesses qui accrochent. » Sinon, la corriger :
  - [ ] Remplacement du kit d’embrayage : disque, mécanisme et butée
  - [ ] Contrôle du volant moteur, notamment des volants bimasse
  - [ ] Réglage ou purge de la commande d’embrayage
  - [ ] Prix ou forfait TTC affichable ? Si forfait : opérations et pièces comprises

### Climatisation

- [ ] Le garage propose « Climatisation »
  - [ ] Phrase de présentation (affichée dans Google) exacte pour ce garage : « Contrôle, recharge et filtre d’habitacle. » Sinon, la corriger :
  - [ ] Contrôle de l’efficacité et de l’étanchéité du circuit
  - [ ] Recharge en fluide frigorigène
  - [ ] Remplacement du filtre d’habitacle
  - [ ] Traitement des mauvaises odeurs
  - [ ] Le garage détient-il l’attestation de capacité pour manipuler les fluides frigorigènes ? (obligatoire pour la recharge)
  - [ ] Prix ou forfait TTC affichable ? Si forfait : opérations et pièces comprises

### Batterie et démarrage

- [ ] Le garage propose « Batterie et démarrage »
  - [ ] Phrase de présentation (affichée dans Google) exacte pour ce garage : « Test et remplacement de la batterie, contrôle de l’alternateur et du démarreur. » Sinon, la corriger :
  - [ ] Test de la batterie et du circuit de charge
  - [ ] Remplacement de la batterie
  - [ ] Contrôle de l’alternateur et du démarreur
  - [ ] Prix ou forfait TTC affichable ? Si forfait : opérations et pièces comprises

### Suspension et direction

- [ ] Le garage propose « Suspension et direction »
  - [ ] Phrase de présentation (affichée dans Google) exacte pour ce garage : « Amortisseurs, rotules, silentblocs : tenue de route et confort. » Sinon, la corriger :
  - [ ] Contrôle et remplacement des amortisseurs
  - [ ] Remplacement des rotules, biellettes, silentblocs et roulements
  - [ ] Contrôle des jeux de direction
  - [ ] Prix ou forfait TTC affichable ? Si forfait : opérations et pièces comprises

### Échappement et dépollution

- [ ] Le garage propose « Échappement et dépollution »
  - [ ] Phrase de présentation (affichée dans Google) exacte pour ce garage : « Silencieux, catalyseur, filtre à particules, vanne EGR. » Sinon, la corriger :
  - [ ] Remplacement de silencieux et de tuyaux d’échappement
  - [ ] Contrôle du catalyseur et du filtre à particules (FAP)
  - [ ] Nettoyage ou remplacement de la vanne EGR, selon le diagnostic
  - [ ] Prix ou forfait TTC affichable ? Si forfait : opérations et pièces comprises

### Préparation au contrôle technique

- [ ] Le garage propose « Préparation au contrôle technique »
  - [ ] Phrase de présentation (affichée dans Google) exacte pour ce garage : « Vérification avant le passage et réparations pour la contre-visite. » Sinon, la corriger :
  - [ ] Vérification des principaux points contrôlés avant le passage
  - [ ] Réparation des défaillances relevées pour la contre-visite
  - [ ] Prix ou forfait TTC affichable ? Si forfait : opérations et pièces comprises

- [ ] Marques et types de véhicules pris en charge (voitures, utilitaires, hybrides / électriques, motos ?). Équipements particuliers ?
- [ ] Vente de véhicules d’occasion, dépannage / remorquage, véhicule de courtoisie, prise en charge à domicile ?

## 5. Arguments à afficher (seulement s’ils sont vrais)

- [ ] « Devis avant réparation » : Un devis détaillé vous est remis avant toute réparation.
- [ ] « Toutes marques » : Entretien et réparation de véhicules légers, quelle que soit la marque.
- [ ] « Interlocuteur unique » : Vous parlez directement au mécanicien qui intervient sur votre voiture.
- [ ] « Paiement en plusieurs fois » : Des facilités de paiement pour étaler les grosses réparations.
- [ ] Moyens de paiement acceptés (espèces, chèque, carte…).
- [ ] Paiement en plusieurs fois : les « facilités de paiement » affichées sur Vroomly sont-elles une offre du garage ? Si oui : qui finance (le garage lui-même ou un organisme : lequel ?), en combien de fois, avec quels frais, à partir de quel montant ? S’il s’agit d’un crédit, même sans frais, la mention légale de l’organisme est obligatoire → `paiement`
- [ ] Qualifications, labels, réseau d’appartenance ? Nombre de personnes à l’atelier, apprentis ?

## 6. Présence en ligne et avis

- [ ] Fiche Google Business Profile existante ? (sinon : la créer ensemble). Accès, lien « Demander des avis ».
- [ ] Fiche Vroomly : revendiquée ? À compléter ? PagesJaunes situe « Lm Motors » à Vergigny : à corriger ?
- [ ] Pages Facebook / Instagram, boutique Leboncoin ou La Centrale ?
- [ ] Accord pour recopier sur le site les avis Google les plus récents, quelle que soit la note ?
- [ ] Politique des avis (obligatoire si des avis sont affichés) : le garage offre-t-il une contrepartie pour un avis (remise, cadeau) ? Sous quel délai les nouveaux avis sont-ils recopiés sur le site, et combien de temps restent-ils affichés ? → `avisPolitique`

## 7. Zone et visuels

- [ ] Communes d’où viennent les clients ? Pages prévues : Auxerre, Saint-Georges-sur-Baulche, Monéteau, Appoigny, Chevannes, Perrigny, Venoy, Saint-Bris-le-Vineux, Augy, Vincelles, Escolives-Sainte-Camille, Vermenton.
- [ ] Photos réelles : façade visible depuis la rue, atelier, équipe ; logo s’il existe.
- [ ] Nom de domaine souhaité (ex. lm-motors.fr, à vérifier à l’AFNIC).
