import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as R from 'ramda';

// Chargement du texte
const loadText = filepath => fs.readFileSync(filepath, 'utf-8');

// Nettoyage
const cleanText = R.pipe(
    R.toLower,
    R.replace(/[\r\n]+/g, ' '), // remplacer retours ligne par un espace
    R.replace(/-/g, ' '), // nouveau : remplacer les tirets par des espaces
    R.replace(/[^a-zàâçéèêëîïôûùüÿñæœ'\s]/gi, ''), // garder lettres, apostrophes et espaces
);


// Tokenisation
const tokenize = level => R.pipe(
    R.trim,
    level === 'char'
        ? R.pipe(
            R.split(/\s+/),
            R.chain(word => ['^', ...word.split(''), '$'])
        )
        : R.split(/\s+/)
);



// Traitement complet
const processText = (filepath, level = 'char') =>
    R.pipe(
        loadText,
        cleanText,
        tokenize(level)
    )(filepath);


// Lancer le traitement
const tokens = processText('../data/texte2.txt', 'char');

// Sauvegarde dans un fichier
fs.writeFileSync('../data/tokens.json', JSON.stringify(tokens, null, 2));

// Affichage test
console.log(tokens.slice(0, 200));
const extractWords = R.pipe(
    cleanText,
    R.split(/\s+/),
    R.uniq
);

const words = extractWords(loadText('../data/texte2.txt'));
fs.writeFileSync('../data/words.json', JSON.stringify(words, null, 2));
console.log('✅ words.json généré avec', words.length, 'mots uniques.');
