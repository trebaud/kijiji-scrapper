const config = require('../config');
const utils = require('./utils');

const { KEYWORDS_WHITELIST, KEYWORDS_BLACKLIST } = config;

const generateKeywords = (list) => {
  const capitalizedWords = list.map((word) => utils.capitalize(word));
  const upperCasedWords = list.map((word) => word.toUpperCase());

  return list.concat(capitalizedWords).concat(upperCasedWords);
};

const rate = (listing) => {
  let matches = [];
  for (const word of KEYWORDS_WHITELIST) {
    if (listing.text.includes(word)) {
      matches.push(word);
    }
  }

  return {
    ...listing,
    rating: (1 / listing.timeSince) * Math.pow(2, matches.length) * 100,
    matches,
  };
};

const formatDatePosted = (listingData) => {
  // TODO Handle english terms
  const { datePosted } = listingData;
  const frTerms = ['minute', 'minutes', 'heures', 'hier'];
  const enTerms = ['hours', 'Yesterday']; // should not be needed as website displays in french by default

  const tooLongAgo = ![...frTerms, ...enTerms].some((word) => datePosted.includes(word));
  if (tooLongAgo) {
    return {
      ...listingData,
      timeSince: Number.MAX_VALUE,
    };
  }

  if (datePosted === 'hier' || datePosted === 'Yesterday') {
    return {
      ...listingData,
      timeSince: 24 * 60,
    };
  }

  const timeSinceMinutesOrHours = datePosted.match(/\d+/)[0];
  return {
    ...listingData,
    timeSince: datePosted.includes('minutes') ? timeSinceMinutesOrHours : timeSinceMinutesOrHours * 60,
  };
};

const processRawListingsData = (listingsData) => {
  const blackListedWords = generateKeywords(KEYWORDS_BLACKLIST);

  const formatedListings = listingsData.map((listing) => formatDatePosted(listing));

  const filteredListings = formatedListings
    .filter((listing) => listing.timeSince !== Number.MAX_VALUE)
    .filter((listing) => !blackListedWords.some((word) => listing.text.includes(word)));

  const results = filteredListings.map((listing) => rate(listing)).sort((a, b) => b.rating - a.rating);

  return {
    results,
    allListingsNb: listingsData.length,
    filteredListingsNb: filteredListings.length,
  };
};

module.exports = { processRawListingsData };
