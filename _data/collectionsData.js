import fs from 'fs';
import path from 'path';

const keyMap = {
	'pet': '.',
	'recipe': 'l',
	'portfolio': 'r',
	'gipc': 'g',
	'giwc': 'w',
	'unpfii': 'u',
	'emrip': 'e',
	'redpaper': 'd',
	'doctrine-of-discovery': 'o',
	'lyons': 'y',
	'general': 'n'
};

// Map folder names to their actual collection tag names (from .11tydata.js files)
const collectionTagMap = {
	'pet': 'pets',
	'recipe': 'recipes',
	'portfolio': 'portfolios',
	'home': 'homepages',
	// All others use the same name as the folder
};

/**
 * Convert folder name to display title
 */
function normalizeName(name) {
	return name
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

/**
 * Generate an access key for sidebar navigation
 */
function generateAccessKey(collectionName, index) {
	return keyMap[collectionName] || String.fromCharCode(97 + (index % 26));
}

/**
 * Get all collection folders from /content, excluding special folders
 */
function getAllCollections() {
	const contentDir = './content';
	return fs.readdirSync(contentDir, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name)
		.filter(name => !['feed', 'home', 'pages'].includes(name))
		.sort();
}

/**
 * Dynamically generates metadata for all content collections
 */
export default function() {
	const allCollections = getAllCollections();
	const collectionsMeta = {};
	
	allCollections.forEach((collectionName, index) => {
		const key = generateAccessKey(collectionName, index);
		// Use the tag map to get the actual Eleventy collection name
		const collectionTag = collectionTagMap[collectionName] || collectionName;
		
		collectionsMeta[collectionName] = {
			title: normalizeName(collectionName),
			collections: collectionName,
			collectionTag: collectionTag, // Add the actual collection tag name
			text: `Documents and resources related to ${normalizeName(collectionName)}.`,
			key: key,
			// Store the list of related collections (all others except this one)
			relatedCollections: getAllCollections()
				.filter(name => name !== collectionName)
		};
	});
	
	return collectionsMeta;
}
