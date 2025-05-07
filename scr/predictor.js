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

