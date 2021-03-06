const BASE_PATH_URL = '';
const NB_MAX_PAGES = 3; // number of pages to scrappe
const PAUSE_DELAY = 1000;
const NUMBER_RESULTS_DISPLAYED = 5;

const KEYWORDS_WHITELIST = [
  'PLATEAU',
  'Patrie',
  'Petite',
  'Plateau',
  'ROSEMONT',
  'Rosemont',
  'WESTMOUNT',
  'Westmount',
  'balcon',
  'balcony',
  'italie',
  'italy',
  'laurier',
  'metro',
  'mont-royal',
  'métro',
  'patrie',
  'plateau',
  'rosemont',
  'terasse',
  'westmount',
];

const KEYWORDS_BLACKLIST = [
  'H-Beaugrand',
  'Henri-Bourassa',
  'Honoré-Beaugrand',
  'LaSalle',
  'McGill Student',
  'VSL',
  'Ville Saint-Laurent',
  'West Island',
  'ahuntsic',
  'assomption',
  'basement',
  'bourassa',
  'cadillac',
  'cartier',
  'cartierville',
  'cremazie',
  'dorval',
  'echange',
  'exchange',
  'fabre',
  'henri',
  'hochelaga',
  'jarry',
  'langelier',
  'lasalle',
  'laval',
  'longueil',
  'masson',
  'mercier',
  'homa',
  'molson',
  'nord',
  'pierrefonds',
  'sous-sol',
  'st-michel',
  'student',
  'students',
  'suspendue',
  'swap',
  'verdun',
  'viau',
  'villeray',
];

module.exports = {
  BASE_PATH_URL,
  KEYWORDS_BLACKLIST,
  KEYWORDS_WHITELIST,
  NB_MAX_PAGES,
  NUMBER_RESULTS_DISPLAYED,
  PAUSE_DELAY,
};
