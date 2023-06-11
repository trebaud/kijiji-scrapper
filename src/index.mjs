import fs from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import prettyjson from 'prettyjson';

import scrapper from './webscrapper.mjs';
import processRawListingsData from './analytics.mjs';
import { BASE_PATH_URL, NB_MAX_PAGES, PAUSE_DELAY, NUMBER_RESULTS_DISPLAYED } from '../config.mjs';
import { sleep } from './utils.mjs';

const { log, error } = console;

const baseURL = 'https://www.kijiji.ca';
const pageURL = BASE_PATH_URL.includes(baseURL) ? BASE_PATH_URL : `${baseURL}${BASE_PATH_URL}`;

const fetchNextPage = (url, pageNumber) => {
	if (pageNumber < 2) {
		return url;
	}

	const { pathname } = new URL(url);
	const pathList = pathname.split('/');
	pathList.splice(pathList.length - 1, 0, `page-${pageNumber}`);

	const newPath = pathList.join('/');
	let newURL = new URL(url);
	newURL.pathname = newPath;

	return newURL.toString();
};

const fetchData = async () => {
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
			newPageURL = fetchNextPage(pageURL, pageNumber);
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
			await sleep(PAUSE_DELAY);
			pausingSpinner.info();
		}
	}
	fetchingSpinner.stop();
	pausingSpinner.stop();

	return rawData;
};

const logResults = ({ results, allListingsNb, filteredListingsNb }) => {
	const displayedResults = results.slice(0, NUMBER_RESULTS_DISPLAYED);

	log(chalk.blue.bold(`\nFirst ${NUMBER_RESULTS_DISPLAYED} results:\n`));
	log(prettyjson.render(displayedResults));
	log(chalk.magenta.bold('\n\n📊 ############# STATS #############\n'));
	log(
		`\n👉 Processed ${allListingsNb} raw listings with ratings ranging from ${chalk.green(
			results[0].rating,
		)} to ${chalk.red(results.slice(-1)[0].rating)}.`,
	);
	log(`\n👉 Kept ${filteredListingsNb} listings after filtering.`);
	log(`\n👉 Check ${chalk.cyan.underline('results.json')} to view all listings.`);
};

(async () => {
	const rawData = await fetchData();
	const processedData = processRawListingsData(rawData);

	logResults(processedData);

	fs.writeFileSync('results.json', JSON.stringify(processedData.results));
	process.exit();
})();
