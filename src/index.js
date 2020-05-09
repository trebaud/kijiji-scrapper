const webscrapper = require("./webscrapper");
const fs = require('fs');

//const keywordsWhiteList = ["plateau", "westmount", "rosemont", "metro"]
//const keywordsBlackList = ["echange", "exchange"]
const pageURL = 'https://www.kijiji.ca/b-appartement-condo/ville-de-montreal/1+1+2+ou+2+1+2__3+1+2__3+1+2+et+coin+detente/c37l1700281a27949001?price=500__1100&ad=offering';

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
  let results = [];

  for (let pageNumber = 1; pageNumber < 10; pageNumber++) {
    console.log(`######### Fetching Page ${pageNumber}`)
    try {
      newPageURL = getNextPageUrl(pageURL, pageNumber);
      const pageResults = await webscrapper(newPageURL);
      results = results.concat(pageResults);
    } catch(err) {
      console.error(err);
    }
    console.log('Waiting 1s...\n');
    await sleep(1000);
  }

  return results;
}

const exec = async () => {
  const results = await paginate();
  fs.writeFileSync('results.json', JSON.stringify(results))
}

exec();
