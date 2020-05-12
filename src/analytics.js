const keywordsWhiteList = [
  "italie",
  "italy",
  "metro",
  "métro",
  "plateau",
  "Plateau",
  "Petite",
  "patrie",
  "Patrie",
  "petite",
  "westmount",
  "rosemont",
  "Rosemont",
  "ROSEMONT",
  "Westmount",
  "WESTMOUNT",
  "PLATEAU",
]

const keywordsBlackList = [
  "H-Beaugrand",
  "Henri-Bourassa",
  "Honoré-Beaugrand",
  "LaSalle",
  "McGill Student",
  "Ville Saint-Laurent",
  "ahuntsic",
  "assomption",
  "cadillac",
  "langelier",
  "basement",
  "bourassa",
  "cadillac",
  "cartier",
  "cartierville",
  "cremazie",
  "crémazie",
  "dorval",
  "echange",
  "exchange",
  "henri",
  "lasalle",
  "lasalle",
  "laval",
  "longueil",
  "masson",
  "molson",
  "nord",
  "pierrefonds",
  "sous-sol",
  "st-michel",
  "student",
  "students",
  "swap",
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
  let rating = (1 / listing.timeSince);

  if (keywordsWhiteList.some(word => listing.description.includes(word))) {
    rating = rating * 10;
  }

  return rating;
}

const processRawListingData = (listingData) => {
  const { rawTextData, meta } = listingData;

  const price = rawTextData[0];
  const timeSince = rawTextData[2].split(" ").slice(-2);
  const description = rawTextData[1].concat(rawTextData[3]);
  const rooms = rawTextData[4];

  return {
    meta,
    price,
    timeSince,
    description,
    rooms,
  };
}

const processRawListingsData = (listingsData) => {
  console.log('\n###### Processing Data ...')
  const listings = listingsData.map(listing => processRawListingData(listing));
  const blackListedWords = generateKeywords(keywordsBlackList);

  const filteredListings = listings
    .filter(listing => !blackListedWords.some(word => listing.description.includes(word)))
    .filter(l => ["heures", "minutes"].includes(l.timeSince[1]))
    .map(listing => {
      if(listing.timeSince[1] === "heures") {
        return {
          ...listing,
          timeSince: listing.timeSince[0] * 60,
        }
      }

      return {
        ...listing,
        timeSince: parseInt(listing.timeSince[0], 10)
      }
    })
    .map(listing => {
      const rating = rate(listing);
      return {
        ...listing,
        rating,
      }
    })
    .sort((a, b) => (b.rating - a.rating));

  console.log(filteredListings);
  console.log(`\nProcessed ${listings.length} listings.`)
  console.log(`\nKept ${filteredListings.length} listings after filter.`)

  return filteredListings;
}

module.exports = { processRawListingsData }
