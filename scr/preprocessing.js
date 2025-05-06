import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as R from 'ramda';

// Chargement du texte
const loadText = filepath => fs.readFileSync(filepath, 'utf-8');

// Nettoyage
const cleanText = R.pipe(
    R.toLower,
    R.replace(/[^a-zàâçéèêëîïôûùüÿñæœ'\s]/gi, '')
);

// Tokenisation
const tokenize = level => R.pipe(
    R.trim,
    level === 'char'
        ? R.pipe(R.replace(/\s+/g, ''), R.split(''))
        : R.split(/\s+/)
);

// Traitement complet
const processText = (filepath, level = 'char') =>
    R.pipe(
        loadText,
        cleanText,
        tokenize(level),
        R.take(200),
        console.log
    )(filepath);

// Lancer
processText('../data/texte2.txt', 'char');
