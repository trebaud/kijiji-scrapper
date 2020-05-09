const puppeteer = require("puppeteer");

const webscraping = async pageURL => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();
  let results;

  try {
    console.log(`Opening page ${pageURL} ...`)
    await page.goto(pageURL);
    await page.screenshot({path: 'kijiji.png'});


    const listings = await page.evaluate(() => {
      const listingsDOM = document.querySelectorAll("[data-listing-id]");
      console.log({ listingsDOM })
      let listingsData = [];
      listingsDOM.forEach(listingEl => {
        const { dataset, innerText } = listingEl;
        listingsData.push({
          id: dataset.listingId,
          url: dataset.vipUrl,
          description: innerText,
        })
      });
      return listingsData;
    });

    results = listings;

  } catch (e) {
    console.error(e);
  }

  browser.close();
  return results;
};

module.exports = webscraping;
