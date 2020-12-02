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

  const tooLongAgo = !['minute', 'minutes', 'heures', 'hier'].some((word) => datePosted.includes(word));
  if (tooLongAgo) {
    return {
      ...listingData,
      timeSince: Number.MAX_VALUE,
    };
  }

  if (datePosted === 'hier') {
    return {
      ...listingData,
      timeSince: 24 * 60,
    };
  }

  const datePostedCleaned = datePosted.split('Il y a moins de')[1].trim().split(' ');
  const timeSince = datePostedCleaned[1] === 'heures' ? datePostedCleaned[0] * 60 : parseInt(datePostedCleaned[0]);

  return {
    ...listingData,
    timeSince,
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
