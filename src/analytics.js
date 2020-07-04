const config = require('../config');
const utils = require('./utils');

const { keywordsWhiteList, keywordsBlackList } = config;

const generateKeywords = (list) => {
  const capitalizedWords = list.map(word => utils.capitalize(word));
  const upperCasedWords = list.map(word => word.toUpperCase());

  return list.concat(capitalizedWords).concat(upperCasedWords);
}

const rate = (listing) => {
  let matches = [];
  for(const word of keywordsWhiteList) {
    if (listing.text.includes(word)) {
      matches.push(word);
    }
  }

  return {
    ...listing,
    rating: (1 / listing.timeSince) * Math.pow(10, matches.length) * 100,
    matches,
  };
}

const formatDatePosted = (listingData) => {
  const { datePosted } = listingData;

  const tooLongAgo = !["minutes", "heures"].some(word => datePosted.includes(word))
  if (tooLongAgo) {
    return {
      ...listingData,
      timeSince: Number.MAX_VALUE,
    }
  }

  const datePostedCleaned = datePosted.split("Il y a moins de")[1].trim().split(" ");
  const timeSince = datePostedCleaned[1] === "heures" ? datePostedCleaned[0] * 60 : parseInt(datePostedCleaned[0]);

  return {
    ...listingData,
    timeSince,
  };
}

const processRawListingsData = (listingsData) => {
  console.log('\n###### Processing Data ...')
  const blackListedWords = generateKeywords(keywordsBlackList);

  const formatedListings = listingsData.map(listing => formatDatePosted(listing))

  const filteredListings = formatedListings
    .filter(listing => !blackListedWords.some(word => listing.text.includes(word)))

  const results = filteredListings
    .map(listing => rate(listing))
    .sort((a, b) => (b.rating - a.rating));

  return {
    results,
    allListingsNb: listingsData.length,
    filteredListingsNb: filteredListings.length
  };
}

module.exports = { processRawListingsData }
