import { KEYWORDS_WHITELIST, KEYWORDS_BLACKLIST } from '../config.mjs';

const rateListing = (listing) => {
	let matches = [];
	for (const word of KEYWORDS_WHITELIST) {
		if (listing.text.toLowerCase().includes(word.toLowerCase())) {
			matches.push(word);
		}
	}

	return {
		...listing,
		rating: (1 / listing.timeSince) * Math.pow(2, matches.length) * 100,
		matches,
	};
};

const formatDatePosted = (listingData) => {
	// TODO Handle english terms
	const { datePosted } = listingData;
	const frTerms = ['minute', 'minutes', 'heures', 'hier'];
	const enTerms = ['hours', 'Yesterday']; // should not be needed as website displays in french by default

	const tooLongAgo = ![...frTerms, ...enTerms].some((word) => datePosted.includes(word));
	if (tooLongAgo) {
		return {
			...listingData,
			timeSince: Number.MAX_VALUE,
		};
	}

	if (datePosted === 'hier' || datePosted === 'Yesterday') {
		return {
			...listingData,
			timeSince: 24 * 60,
		};
	}

	const timeSinceMinutesOrHours = datePosted.match(/\d+/)[0];
	return {
		...listingData,
		timeSince: datePosted.includes('minutes') ? timeSinceMinutesOrHours : timeSinceMinutesOrHours * 60,
	};
};

const processRawListingsData = (listingsData) => {
	const formatedListings = listingsData.map((listing) => formatDatePosted(listing));
	const filteredListings = formatedListings
		.filter((listing) => listing.timeSince !== Number.MAX_VALUE)
		.filter((listing) => !KEYWORDS_BLACKLIST.some((word) => listing.text.toLowerCase().includes(word.toLowerCase())));

	const results = filteredListings.map((listing) => rateListing(listing)).sort((a, b) => b.rating - a.rating);

	return {
		results,
		allListingsNb: listingsData.length,
		filteredListingsNb: filteredListings.length,
	};
};

export default processRawListingsData;
