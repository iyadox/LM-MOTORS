/**
 * Prestations du garage.
 *
 * Les textes décrivent en quoi consiste chaque intervention (connaissances générales,
 * vraies quel que soit le garage) : ils ne contiennent aucune promesse, aucun prix
 * et aucun délai au nom de LM Motors.
 *
 * `valide: false` = prestation pas encore confirmée par le gérant.
 *   - mode brouillon : affichée avec la mention « À confirmer » ;
 *   - mode production : masquée.
 * Passer à `valide: true` uniquement pour les prestations que le garage réalise vraiment.
 *
 * `prix` : texte libre fourni par le gérant (ex. « À partir de 89 € TTC »). `null` = non affiché.
 */
export const services = [
  {
    slug: 'entretien-vidange',
    titre: 'Entretien et vidange',
    icone: 'droplet',
    resume: 'Vidange, filtres et révision selon le carnet d’entretien de votre véhicule.',
    intro:
      'L’entretien périodique suit le programme prévu par le constructeur dans le carnet d’entretien : vidange de l’huile moteur, remplacement des filtres et contrôle des points de sécurité.',
    contenu: [
      'Vidange de l’huile moteur et remplacement du filtre à huile',
      'Remplacement des filtres à air, d’habitacle et à carburant selon les échéances',
      'Contrôle et mise à niveau des liquides (refroidissement, frein, lave-glace)',
      'Contrôle des points de sécurité : freins, pneus, éclairage, essuie-glaces',
    ],
    signes: [
      'Le témoin ou l’indicateur d’entretien s’allume au tableau de bord',
      'Vous approchez du kilométrage ou de la date prévus par le carnet d’entretien',
      'Le niveau d’huile baisse entre deux vidanges',
    ],
    bonASavoir:
      'Le règlement européen n° 461/2010 permet de faire réaliser l’entretien courant d’un véhicule encore sous garantie par le garage de son choix, même hors du réseau de la marque, sans perdre la garantie constructeur, à condition de respecter le programme d’entretien du constructeur et d’utiliser des pièces de qualité équivalente.',
    prix: null,
    valide: false,
  },
  {
    slug: 'freinage',
    titre: 'Freinage',
    icone: 'disc',
    resume: 'Plaquettes, disques, liquide de frein : votre sécurité avant tout.',
    intro:
      'Le système de freinage s’use à chaque arrêt. Plaquettes, disques et liquide de frein doivent être contrôlés régulièrement et remplacés dès qu’ils atteignent leur limite d’usure.',
    contenu: [
      'Contrôle de l’usure des plaquettes et des disques',
      'Remplacement des plaquettes, des disques, des mâchoires ou des tambours',
      'Purge et remplacement du liquide de frein',
      'Contrôle du frein de stationnement',
    ],
    signes: [
      'Grincement ou sifflement au freinage',
      'Vibrations dans la pédale ou dans le volant quand vous freinez',
      'Pédale molle, ou qui s’enfonce plus que d’habitude',
      'Le voyant de freinage reste allumé',
      'La voiture tire d’un côté au freinage',
    ],
    bonASavoir:
      'Le liquide de frein absorbe l’humidité avec le temps, ce qui diminue son efficacité. Il se remplace à intervalles réguliers, selon les préconisations du constructeur.',
    prix: null,
    valide: false,
  },
  {
    slug: 'pneus',
    titre: 'Pneus',
    icone: 'circle-dot',
    resume: 'Montage, équilibrage, réparation de crevaison et contrôle d’usure.',
    intro:
      'Les pneus sont le seul contact entre votre voiture et la route. Leur usure, leur pression et leur état conditionnent le freinage et la tenue de route.',
    contenu: [
      'Montage et équilibrage des pneus',
      'Réparation de crevaison, lorsque l’emplacement et l’état du pneu le permettent',
      'Contrôle de l’usure et de la pression',
      'Permutation avant / arrière',
    ],
    signes: [
      'Les témoins d’usure au fond des rainures sont atteints',
      'Vibrations dans le volant à certaines vitesses',
      'Usure irrégulière d’un côté du pneu',
      'Perte de pression qui revient régulièrement',
    ],
    bonASavoir:
      'En France, la profondeur minimale légale des sculptures est de 1,6 mm. Les témoins d’usure moulés dans les rainures du pneu indiquent cette limite.',
    prix: null,
    valide: false,
  },
  {
    slug: 'diagnostic-electronique',
    titre: 'Diagnostic électronique',
    icone: 'scan-line',
    resume: 'Lecture des défauts et recherche de panne quand un voyant s’allume.',
    intro:
      'Les véhicules récents enregistrent leurs défauts dans des calculateurs. Un diagnostic électronique permet de lire ces codes et d’orienter la recherche de la panne.',
    contenu: [
      'Lecture des codes défauts enregistrés par les calculateurs',
      'Recherche de l’origine de la panne',
      'Contrôle des capteurs concernés',
      'Effacement des défauts après réparation',
    ],
    signes: [
      'Voyant moteur allumé',
      'Perte de puissance ou passage en mode dégradé',
      'Voyant ABS, airbag ou antipollution allumé',
      'Démarrage difficile ou ralenti instable',
    ],
    bonASavoir:
      'Au tableau de bord, un voyant rouge signale un danger : arrêtez-vous dès que possible. Un voyant orange signale un défaut à faire contrôler rapidement.',
    prix: null,
    valide: false,
  },
  {
    slug: 'distribution',
    titre: 'Courroie de distribution',
    icone: 'cog',
    resume: 'Remplacement du kit de distribution à l’échéance prévue par le constructeur.',
    intro:
      'La courroie de distribution synchronise les pièces mobiles du moteur. Elle se remplace à l’échéance fixée par le constructeur, avant qu’elle ne casse.',
    contenu: [
      'Remplacement du kit de distribution : courroie, galets et, selon le modèle, pompe à eau',
      'Contrôle de la chaîne de distribution sur les moteurs qui en sont équipés',
    ],
    signes: [
      'L’échéance du carnet d’entretien est atteinte, en kilomètres ou en années',
      'Bruit de cliquetis ou sifflement côté moteur',
      'Fuite de liquide de refroidissement près de la pompe à eau',
    ],
    bonASavoir:
      'La rupture d’une courroie de distribution peut gravement endommager le moteur. L’échéance de remplacement est donnée en kilomètres et en années : c’est la première atteinte qui compte.',
    prix: null,
    valide: false,
  },
  {
    slug: 'embrayage',
    titre: 'Embrayage',
    icone: 'settings',
    resume: 'Embrayage qui patine, pédale dure ou vitesses qui accrochent.',
    intro:
      'L’embrayage transmet la puissance du moteur à la boîte de vitesses. Il s’use progressivement, plus ou moins vite selon la conduite et le type de trajets.',
    contenu: [
      'Remplacement du kit d’embrayage : disque, mécanisme et butée',
      'Contrôle du volant moteur, notamment des volants bimasse',
      'Réglage ou purge de la commande d’embrayage',
    ],
    signes: [
      'Le moteur monte dans les tours sans que la voiture accélère : l’embrayage patine',
      'Pédale dure, molle ou qui reste en bas',
      'Vitesses difficiles à passer',
      'Bruits ou vibrations au démarrage',
    ],
    bonASavoir:
      'Un embrayage qui patine s’use de plus en plus vite. Le faire contrôler dès les premiers signes évite souvent d’autres dégâts.',
    prix: null,
    valide: false,
  },
  {
    slug: 'climatisation',
    titre: 'Climatisation',
    icone: 'snowflake',
    resume: 'Contrôle, recharge et filtre d’habitacle pour un air frais et sain.',
    intro:
      'Un circuit de climatisation perd naturellement un peu de fluide frigorigène avec les années. Moins de fluide, c’est moins de froid et plus de buée.',
    contenu: [
      'Contrôle de l’efficacité et de l’étanchéité du circuit',
      'Recharge en fluide frigorigène',
      'Remplacement du filtre d’habitacle',
      'Traitement des mauvaises odeurs',
    ],
    signes: [
      'L’air ne refroidit plus suffisamment',
      'Mauvaise odeur quand vous allumez la ventilation',
      'La buée met longtemps à disparaître',
    ],
    bonASavoir:
      'Faire fonctionner la climatisation régulièrement, même en hiver, aide à garder le circuit en bon état et permet de désembuer plus rapidement.',
    prix: null,
    valide: false,
  },
  {
    slug: 'batterie-demarrage',
    titre: 'Batterie et démarrage',
    icone: 'battery-charging',
    resume: 'Test et remplacement de batterie, alternateur, démarreur.',
    intro:
      'Une voiture qui démarre mal vient souvent d’une batterie fatiguée, mais l’alternateur ou le démarreur peuvent aussi être en cause.',
    contenu: [
      'Test de la batterie et du circuit de charge',
      'Remplacement de la batterie',
      'Contrôle de l’alternateur et du démarreur',
    ],
    signes: [
      'Démarrage lent, surtout par temps froid',
      'Voyant de batterie allumé',
      'Éclairage ou équipements électriques faibles',
    ],
    bonASavoir:
      'Le froid réduit la capacité d’une batterie : une batterie fatiguée lâche souvent aux premières gelées.',
    prix: null,
    valide: false,
  },
  {
    slug: 'suspension-direction',
    titre: 'Suspension et direction',
    icone: 'car-front',
    resume: 'Amortisseurs, rotules, silentblocs : tenue de route et confort.',
    intro:
      'Amortisseurs, rotules et silentblocs maintiennent les roues au contact de la route. Usés, ils allongent les distances de freinage et dégradent la tenue de route.',
    contenu: [
      'Contrôle et remplacement des amortisseurs',
      'Remplacement des rotules, biellettes, silentblocs et roulements',
      'Contrôle des jeux de direction',
    ],
    signes: [
      'La voiture rebondit ou tangue dans les virages',
      'Bruits sourds sur les bosses ou les ralentisseurs',
      'Usure irrégulière des pneus',
      'Volant qui vibre ou qui n’est pas droit en ligne droite',
    ],
    bonASavoir:
      'Des amortisseurs usés font aussi s’user les pneus plus vite et de façon irrégulière.',
    prix: null,
    valide: false,
  },
  {
    slug: 'echappement-depollution',
    titre: 'Échappement et dépollution',
    icone: 'wind',
    resume: 'Silencieux, catalyseur, filtre à particules, vanne EGR.',
    intro:
      'La ligne d’échappement évacue et dépollue les gaz du moteur. Un défaut se traduit souvent par du bruit, de la fumée ou un voyant antipollution.',
    contenu: [
      'Remplacement de silencieux et de tuyaux d’échappement',
      'Contrôle du catalyseur et du filtre à particules (FAP)',
      'Nettoyage ou remplacement de la vanne EGR, selon le diagnostic',
    ],
    signes: [
      'Bruit d’échappement anormal',
      'Fumée noire, bleue ou blanche persistante',
      'Voyant antipollution ou voyant FAP allumé',
      'Perte de puissance',
    ],
    bonASavoir:
      'Le contrôle technique vérifie les émissions polluantes : un défaut de dépollution peut entraîner une contre-visite.',
    prix: null,
    valide: false,
  },
  {
    slug: 'preparation-controle-technique',
    titre: 'Préparation au contrôle technique',
    icone: 'clipboard-check',
    resume: 'Vérification avant le passage et réparations pour la contre-visite.',
    intro:
      'Le contrôle technique est réalisé par un centre agréé. Le garage peut vérifier le véhicule avant le passage et réparer les défauts relevés lors du contrôle.',
    contenu: [
      'Vérification des principaux points contrôlés avant le passage',
      'Réparation des défaillances relevées pour la contre-visite',
    ],
    signes: [
      'Votre contrôle technique arrive à échéance',
      'Le procès-verbal mentionne des défaillances majeures ou critiques',
    ],
    bonASavoir:
      'Pour une voiture particulière, le premier contrôle technique a lieu dans les 6 mois qui précèdent le 4e anniversaire de la première immatriculation, puis tous les 2 ans. En cas de défaillance majeure, la contre-visite doit être réalisée dans un délai de 2 mois.',
    prix: null,
    valide: false,
  },
];
