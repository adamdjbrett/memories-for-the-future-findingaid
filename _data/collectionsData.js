import fs from 'fs';
import path from 'path';

const keyMap = {
    'pet': '.', 'recipe': 'l', 'portfolio': 'r', 'gipc': 'g', 'giwc': 'w',
    'unpfii': 'u', 'emrip': 'e', 'redpaper': 'd', 'doctrine-of-discovery': 'o',
    'lyons': 'y', 'general': 'n'
};

const collectionTagMap = {
    'pet': 'pets', 'recipe': 'recipes', 'portfolio': 'portfolios', 'home': 'homepages'
};

function normalizeName(name) {
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function generateAccessKey(collectionName, index) {
    return keyMap[collectionName] || String.fromCharCode(97 + (index % 26));
}

function getAllCollections() {
    const contentDir = './content';
    const folders = fs.readdirSync(contentDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(name => !['feed', 'home', 'pages'].includes(name));

    const csvPath = './_data/research_data.csv';
    let csvCollections = [];
    if (fs.existsSync(csvPath)) {
        const content = fs.readFileSync(csvPath, 'utf-8');
        csvCollections = content.split('\n').slice(1)
            .map(line => line.split(',')[0].trim())
            .filter(name => name && name !== 'collection' && name !== '');
    }

    return [...new Set([...folders, ...csvCollections])].sort();
}

export default function() {
    const collectionsMeta = {}; // Inisialisasi objek
    const allCollections = getAllCollections();
    
    allCollections.forEach((collectionName, index) => {
        const key = generateAccessKey(collectionName, index);
        const collectionTag = collectionTagMap[collectionName] || collectionName;
        
        collectionsMeta[collectionName] = {
            title: normalizeName(collectionName),
            collections: collectionName,
            collectionTag: collectionTag, // Ini harus match dengan tag di research-pages.njk
            text: `Documents and resources related to ${normalizeName(collectionName)}.`,
            key: key,
            relatedCollections: allCollections.filter(name => name !== collectionName)
        };
    });
    
    return collectionsMeta;
}