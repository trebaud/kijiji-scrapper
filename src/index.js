const fs = require('fs');

const scrapper = require("./webscrapper");
const analytics = require("./analytics");
const config = require('../config');
const utils = require('./utils');

const { basePathURL, NB_MAX_PAGES } = config;

const baseURL = 'https://www.kijiji.ca';
const pageURL = basePathURL.includes(baseURL) ? basePathURL : `${baseURL}${basePathURL}`;

const getNextPageUrl = (pageURL, pageNumber) => {
  if(pageNumber < 2) {
    return pageURL;
  }

  const { pathname } = new URL(pageURL);
  const pathList = pathname.split('/');
  pathList.splice(pathList.length-1, 0, `page-${pageNumber}`);

  const newPath = pathList.join('/');
  let newURL = new URL(pageURL);
  newURL.pathname = newPath;

  return newURL.toString();
}

const paginate = async () => {
  let newPageURL;
  let rawData = [];

  for (let pageNumber = 1; pageNumber < NB_MAX_PAGES + 1; pageNumber++) {
    console.log(`######### Fetching Page n/${pageNumber}`)
    try {
      newPageURL = getNextPageUrl(pageURL, pageNumber);
      const pageResults = await scrapper(newPageURL);
      rawData = rawData.concat(pageResults);
    } catch(err) {
      console.error(err);
    }
    console.log('\nWaiting 1s...\n');
    await utils.sleep(1000);
  }

  return rawData;
}

const logResults = ({ results, allListingsNb, filteredListingsNb }) => {
  const firstTwentyResults = results.slice(0, 20);

  console.log('\nFirst 20 results:\n', firstTwentyResults);
  console.log('\n############# STATS #############\n')
  console.log(`\nProcessed ${allListingsNb} raw listings.`)
  console.log(`\nKept ${filteredListingsNb} listings after filtering.`)
  console.log(`\nRated listings with range of max=${results[0].rating} to min=${results.slice(-1)[0].rating}.`)
  console.log('\nCheck your results.json file to view all listing results')
}

(async () => {
  const rawData = await paginate();
  const processedData = analytics.processRawListingsData(rawData);

  logResults(processedData)

  fs.writeFileSync('results.json', JSON.stringify(processedData.results))
  process.exit();
})();
