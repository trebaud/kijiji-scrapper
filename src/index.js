const fs = require('fs');

const scrapper = require("./webscrapper");
const analytics = require("./analytics");
const config = require('./config');
const utils = require('./utils');

const baseURL = 'https://www.kijiji.ca';
const pageURL = `${baseURL}${config.basePathURL}`;

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

  for (let pageNumber = 1; pageNumber < 4; pageNumber++) {
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

  return analytics.processRawListingsData(rawData);
}

const exec = async () => {
  const results = await paginate();
  fs.writeFileSync('results.json', JSON.stringify(results))
  process.exit();
}

exec();
