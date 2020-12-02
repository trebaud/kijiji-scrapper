const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const prettyjson = require('prettyjson');

const scrapper = require('./webscrapper');
const analytics = require('./analytics');
const config = require('../config');
const utils = require('./utils');

const { log, error } = console;

const { BASE_PATH_URL, NB_MAX_PAGES, PAUSE_DELAY } = config;

const baseURL = 'https://www.kijiji.ca';
const pageURL = BASE_PATH_URL.includes(baseURL) ? BASE_PATH_URL : `${baseURL}${basePathURL}`;

const getNextPageUrl = (pageURL, pageNumber) => {
  if (pageNumber < 2) {
    return pageURL;
  }

  const { pathname } = new URL(pageURL);
  const pathList = pathname.split('/');
  pathList.splice(pathList.length - 1, 0, `page-${pageNumber}`);

  const newPath = pathList.join('/');
  let newURL = new URL(pageURL);
  newURL.pathname = newPath;

  return newURL.toString();
};

const paginate = async () => {
  let newPageURL;
  let rawData = [];

  const fetchingSpinner = ora({
    color: 'green',
  });

  const pausingSpinner = ora({
    color: 'cyan',
    spinner: 'bouncingBall',
  });

  for (let pageNumber = 1; pageNumber < NB_MAX_PAGES + 1; pageNumber++) {
    try {
      newPageURL = getNextPageUrl(pageURL, pageNumber);
      fetchingSpinner.start(chalk.magenta.bold(`Fetching Page n/${pageNumber}`));
      const pageResults = await scrapper(newPageURL);
      fetchingSpinner.succeed();
      rawData = rawData.concat(pageResults);
    } catch (err) {
      error(err);
    }

    if (pageNumber < NB_MAX_PAGES) {
      // dont wait after last fetch
      pausingSpinner.start(chalk.magenta.cyan('... Waiting'));
      await utils.sleep(PAUSE_DELAY);
      pausingSpinner.info();
    }
  }
  fetchingSpinner.stop();
  pausingSpinner.stop();

  return rawData;
};

const logResults = ({ results, allListingsNb, filteredListingsNb }) => {
  const firstTwentyResults = results.slice(0, 20);

  log(chalk.blue.bold('\nFirst 20 results:\n'));
  log(prettyjson.render(firstTwentyResults));
  log(chalk.magenta.bold('\n\n📊 ############# STATS #############\n'));
  log(
    `\n👉 Processed ${allListingsNb} raw listings with ratings ranging from ${chalk.green(
      results[0].rating,
    )} to ${chalk.red(results.slice(-1)[0].rating)}.`,
  );
  log(`\n👉 Kept ${filteredListingsNb} listings after filtering.`);
  log(`\n👉 Check ${chalk.cyan.underline('results.json')} to view all listing`);
};

(async () => {
  const rawData = await paginate();
  const processedData = analytics.processRawListingsData(rawData);

  logResults(processedData);

  fs.writeFileSync('results.json', JSON.stringify(processedData.results));
  process.exit();
})();
