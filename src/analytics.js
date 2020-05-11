const keywordsWhiteList = ["plateau", "westmount", "rosemont", "metro"]
const keywordsBlackList = ["echange", "exchange", "McGill Student", "swap", "SWAP"]

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

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
  const filteredListings = listings.filter(listing => {
    return !keywordsBlackList.some(word => listing.description.includes(word))
  })

  console.log(filteredListings);
  console.log(`\nProcessed ${listings.length} listings.`)
  console.log(`\nKept ${filteredListings.length} listings after filter.`)

  return filteredListings;
}

module.exports = { processRawListingsData }
