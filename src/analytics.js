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
  "West Island",
  "ahuntsic",
  "assomption",
  "basement",
  "bourassa",
  "cadillac",
  "cartier",
  "cartierville",
  "cremazie",
  "dorval",
  "echange",
  "exchange",
  "fabre",
  "henri",
  "hochelaga",
  "jarry",
  "langelier",
  "lasalle",
  "laval",
  "longueil",
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

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

const generateKeywords = (list) => {
  const capitalizedWords = list.map(word => capitalize(word));
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
  console.log({ formatedListings })

  const filteredListings = formatedListings
    .filter(listing => !blackListedWords.some(word => listing.text.includes(word)))
    .map(listing => rate(listing))
    .sort((a, b) => (b.rating - a.rating))
    .slice(0, 20);

  console.log(filteredListings);
  console.log(`\nProcessed ${listingsData.length} raw listings.`)
  console.log(`\nKept ${filteredListings.length} listings.`)

  return filteredListings;
}

module.exports = { processRawListingsData }
