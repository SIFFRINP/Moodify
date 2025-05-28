import fs from 'fs';
import * as R from 'ramda';

const modelData = JSON.parse(fs.readFileSync(new URL('../data/model.json', import.meta.url), 'utf8'));
const maxOrder = R.pipe(
    R.keys,
    R.map(Number),
    R.reduce(R.max, 0)
)(modelData);

export const predict = R.pipe(
    R.takeLast(maxOrder),
    R.join(''),
    key => modelData[key.length]?.[key] || {}
);

function isValidFirstLetter(letter, model) {
    return R.includes(letter, R.keys(model[1]?.['^'] || {}));
}

export function getLetterPrediction(context) {
    const n = Math.min(context.length, maxOrder);
    const key = context.slice(-n).join('');
    let prediction = modelData[n]?.[key] || {};

    if (context.length === 1 && !isValidFirstLetter(context[0], modelData)) {
        return {
            key,
            n,
            prediction: {},
            warning: `La lettre "${context[0]}" ne correspond pas à un début de mot connu.`
        };
    }
    return { key, n, prediction };
}

export function getSortedPredictions(context) {
    const prediction = predict(context);
    return R.pipe(
        R.toPairs,
        R.sortBy(([_, prob]) => -prob) // tri décroissant
    )(prediction);
}

const wordsList = JSON.parse(fs.readFileSync(new URL('../data/words.json', import.meta.url), 'utf8'));

export function getBestWordCompletions(context, maxSuggestions = 3) {
    const prefix = context.join('');
    const matchingWords = wordsList.filter(w => w.startsWith(prefix));

    const scored = matchingWords.map(word => {
        let prob = 1.0;
        const letters = ['^', ...word.split(''), '$'];
        for (let i = 0; i < letters.length - 1; i++) {
            const ctx = letters.slice(Math.max(0, i - maxOrder + 1), i + 1).join('');
            const next = letters[i + 1];
            const p = modelData[ctx.length]?.[ctx]?.[next] || 0.0001;
            prob *= p;
        }
        return { word, score: prob };
    });

    return R.pipe(
        R.sortBy(w => -w.score),
        R.take(maxSuggestions)
    )(scored);
}
