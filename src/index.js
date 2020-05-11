const webscrapper = require("./webscrapper");
const analytics = require("./analytics");
const fs = require('fs');

const baseURL = 'https://www.kijiji.ca';
const pageURL = `${baseURL}/b-appartement-condo/ville-de-montreal/1+1+2+ou+2+1+2__3+1+2__3+1+2+et+coin+detente/c37l1700281a27949001?price=500__1100&ad=offering`;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

  for (let pageNumber = 1; pageNumber < 2; pageNumber++) {
    console.log(`######### Fetching Page n/${pageNumber}`)
    try {
      newPageURL = getNextPageUrl(pageURL, pageNumber);
      const pageResults = await webscrapper(newPageURL);
      rawData = rawData.concat(pageResults);
    } catch(err) {
      console.error(err);
    }
    console.log('\nWaiting 1s...\n');
    await sleep(1000);
  }

  return analytics.processRawListingsData(rawData);
}

const exec = async () => {
  const results = await paginate();
  fs.writeFileSync('results.json', JSON.stringify(results))
  process.exit();
}

exec();
