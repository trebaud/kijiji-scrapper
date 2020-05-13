const puppeteer = require("puppeteer");


const getRawPageData = async (page) => {
  const listings = await page.evaluate(() => {
    const listingsDOM = Array.from(document.querySelectorAll('div.info-container'));

    return listingsDOM.map(listingEl => {
      const title = listingEl.querySelector('div.title a');
      const datePosted = listingEl.querySelector('div.location span.date-posted').innerText;
      const description = listingEl.querySelector('div.description').innerText;
      const price = listingEl.querySelector('div.price').innerText;
      const details = listingEl.querySelector('div.details').innerText;
      const distance = listingEl.querySelector('div.distance').innerText;

      const text = description.concat(details).concat(title.innerText)

      return {
        text,
        datePosted,
        price,
        distance,
        meta: {
          url: `https://www.kijiji.ca${title.href}`,
        },
      }

    })
  });

  return listings;
}

const scrapper = async pageURL => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();
  let listingsData;

  try {
    console.log(`Opening page ${pageURL} ...`)
    await page.goto(pageURL);

    listingsData = await getRawPageData(page);
    return listingsData;
  } catch (e) {
    console.error(e);
  } finally {
    browser.close();
  }
};

module.exports = scrapper;
