const puppeteer = require("puppeteer");


const evaluateDocument = async (page) => {
  const listings = await page.evaluate(() => {
    let listingsData = [];

    const baseURL = 'https://www.kijiji.ca';
    const listingsDOM = document.querySelectorAll('.info-container');
    listingsDOM.forEach(listingEl => {
      const { innerText, children } = listingEl;

      const titleData = children[1].offsetParent.dataset;

      listingsData.push({
        rawTextData: innerText.split('\n'),
        meta: {
          url: `${baseURL}${titleData.vipUrl}`,
          id: titleData.listingId,
        }
      })
    });
    return listingsData;
  });

  return listings;
}

const webscraping = async pageURL => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();
  let listingsData;

  try {
    console.log(`Opening page ${pageURL} ...`)
    await page.goto(pageURL);

    listingsData = await evaluateDocument(page);
    return listingsData;

  } catch (e) {
    console.error(e);
  }

  browser.close();
  return results;
};

module.exports = webscraping;
