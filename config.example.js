const basePathURL = ''; // set your base path with your initial search parameters

const NB_MAX_PAGES = 3; // number of pages to scrappe

const keywordsWhiteList = [
  "PLATEAU",
  "Patrie",
  "Petite",
  "Plateau",
  "ROSEMONT",
  "Rosemont",
  "WESTMOUNT",
  "Westmount",
  "balcon",
  "balcony",
  "italie",
  "italy",
  "laurier",
  "metro",
  "mont-royal",
  "métro",
  "patrie",
  "plateau",
  "rosemont",
  "terasse",
  "westmount",
]

const keywordsBlackList = [
  "H-Beaugrand",
  "Henri-Bourassa",
  "Honoré-Beaugrand",
  "LaSalle",
  "McGill Student",
  "VSL",
  "Ville Saint-Laurent",
  "masson",
  "mercier",
  "homa",
  "molson",
  "nord",
  "pierrefonds",
  "sous-sol",
  "st-michel",
  "student",
  "students",
  "suspendue",
  "swap",
  "verdun",
  "viau",
  "villeray",
]

module.exports = {
  basePathURL,
  keywordsBlackList,
  keywordsWhiteList,
  NB_MAX_PAGES,
};
