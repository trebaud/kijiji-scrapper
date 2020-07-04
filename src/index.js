const fs = require('fs');
const chalk = require('chalk');

const scrapper = require("./webscrapper");
const analytics = require("./analytics");
const config = require('../config');
const utils = require('./utils');

const { log, error } = console;

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
    log(chalk.magenta.bold(`\nFetching Page n/${pageNumber}`));

    try {
      newPageURL = getNextPageUrl(pageURL, pageNumber);
      const pageResults = await scrapper(newPageURL);
      rawData = rawData.concat(pageResults);
    } catch(err) {
      error(err);
    }

    log(chalk.cyan('\nWaiting 1s...\n'));
    await utils.sleep(1000);
  }

  return rawData;
}

const logResults = ({ results, allListingsNb, filteredListingsNb }) => {
  const firstTwentyResults = results.slice(0, 20);

  log('\nFirst 20 results:\n', firstTwentyResults);
  log(chalk.magenta.bold('\n\n📊 ############# STATS #############\n'));
  log(`\n👉 Processed ${allListingsNb} raw listings.`);
  log(`\n👉 Kept ${filteredListingsNb} listings after filtering.`);
  log(`\n👉 Rated listings with range of max=${chalk.green(results[0].rating)} to min=${chalk.red(results.slice(-1)[0].rating)}.`);
  log(`\n👉 Check your ${chalk.cyan.underline('results.json')} file to view all listing results`);
}

(async () => {
  const rawData = await paginate();
  const processedData = analytics.processRawListingsData(rawData);

  logResults(processedData)

  fs.writeFileSync('results.json', JSON.stringify(processedData.results))
  process.exit();
})();
