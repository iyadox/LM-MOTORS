/**
 * Communes de la zone de clientèle : une page « Garage près de … » chacune.
 *
 * Données vérifiées (dossier §8) : code INSEE, codes postaux, population municipale INSEE
 * et intercommunalité, recoupés avec le jeu officiel Etalab « découpage administratif »
 * et la base des codes postaux de La Poste.
 *
 * `trajet` : temps et itinéraire depuis la commune, à MESURER (Google Maps ou ViaMichelin)
 * avant de le publier, ex. « environ 10 minutes par la D606 ». `null` = non affiché.
 */
const CA_AUXERROIS = 'Communauté d’agglomération de l’Auxerrois';

export const communes = [
  {
    slug: 'garage-auxerre',
    nom: 'Auxerre',
    insee: '89024',
    codesPostaux: ['89000'],
    population: 35097,
    epci: CA_AUXERROIS,
    faits: [
      'Auxerre est la préfecture de l’Yonne.',
      'La gare d’Auxerre est la gare d’Auxerre-Saint-Gervais.',
    ],
    trajet: null,
  },
  {
    slug: 'garage-saint-georges-sur-baulche',
    nom: 'Saint-Georges-sur-Baulche',
    insee: '89346',
    codesPostaux: ['89000'],
    population: 3151,
    epci: CA_AUXERROIS,
    faits: ['Saint-Georges-sur-Baulche partage le code postal 89000 avec Auxerre.'],
    trajet: null,
  },
  {
    slug: 'garage-moneteau',
    nom: 'Monéteau',
    insee: '89263',
    codesPostaux: ['89470'],
    population: 4114,
    epci: CA_AUXERROIS,
    faits: [],
    trajet: null,
  },
  {
    slug: 'garage-appoigny',
    nom: 'Appoigny',
    insee: '89013',
    codesPostaux: ['89380'],
    population: 3114,
    epci: CA_AUXERROIS,
    faits: [],
    trajet: null,
  },
  {
    slug: 'garage-chevannes',
    nom: 'Chevannes',
    insee: '89102',
    codesPostaux: ['89240'],
    population: 2137,
    epci: CA_AUXERROIS,
    faits: [],
    trajet: null,
  },
  {
    slug: 'garage-perrigny',
    nom: 'Perrigny',
    insee: '89295',
    codesPostaux: ['89000'],
    population: 1247,
    epci: CA_AUXERROIS,
    faits: ['Perrigny partage le code postal 89000 avec Auxerre.'],
    trajet: null,
  },
  {
    slug: 'garage-venoy',
    nom: 'Venoy',
    insee: '89438',
    codesPostaux: ['89290'],
    population: 1741,
    epci: CA_AUXERROIS,
    faits: ['Venoy a le même code postal que Champs-sur-Yonne : 89290.'],
    trajet: null,
  },
  {
    slug: 'garage-saint-bris-le-vineux',
    nom: 'Saint-Bris-le-Vineux',
    insee: '89337',
    codesPostaux: ['89530'],
    population: 1024,
    epci: CA_AUXERROIS,
    faits: ['La gare « Champs - Saint-Bris », qui porte le nom des deux communes, se trouve sur la commune de Champs-sur-Yonne.'],
    trajet: null,
  },
  {
    slug: 'garage-augy',
    nom: 'Augy',
    insee: '89023',
    codesPostaux: ['89290'],
    population: 954,
    epci: CA_AUXERROIS,
    faits: ['Augy a le même code postal que Champs-sur-Yonne : 89290.'],
    trajet: null,
  },
  {
    slug: 'garage-vincelles',
    nom: 'Vincelles',
    insee: '89478',
    codesPostaux: ['89290'],
    population: 913,
    epci: CA_AUXERROIS,
    faits: [
      'Vincelles a le même code postal que Champs-sur-Yonne : 89290.',
      'La commune a sa propre gare, la gare de Vincelles.',
    ],
    trajet: null,
  },
  {
    slug: 'garage-escolives-sainte-camille',
    nom: 'Escolives-Sainte-Camille',
    insee: '89155',
    codesPostaux: ['89290'],
    population: 719,
    epci: CA_AUXERROIS,
    faits: ['Escolives-Sainte-Camille a le même code postal que Champs-sur-Yonne : 89290.'],
    trajet: null,
  },
  {
    slug: 'garage-vermenton',
    nom: 'Vermenton',
    insee: '89441',
    codesPostaux: ['89270'],
    population: 1303,
    epci: 'Communauté de communes Chablis Villages et Terroirs',
    faits: [],
    trajet: null,
  },
];

/** La commune du garage elle-même (dossier §8, vérifié). */
export const communeGarage = {
  nom: 'Champs-sur-Yonne',
  insee: '89077',
  codePostal: '89290',
  population: 1513,
  epci: CA_AUXERROIS,
  // Communes partageant le code postal 89290 (vérifié, base La Poste).
  // Le secteur de Vaux (Auxerre) n'est pas listé : les sources officielles divergent.
  memeCodePostal: ['Augy', 'Escolives-Sainte-Camille', 'Irancy', 'Jussy', 'Quenne', 'Venoy', 'Vincelles', 'Vincelottes'],
};
