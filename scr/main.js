import readline from 'readline';
import { getLetterPrediction, getBestWordCompletions } from './predictor.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function displayPrediction(context) {
    const { key, n, prediction } = getLetterPrediction(context);

    console.log(`Prédiction pour "${key}" (n = ${n}) :`);
    if (Object.keys(prediction).length === 0) {
        console.log("  Aucune prédiction disponible.");
    } else {
        Object.entries(prediction)
            .sort((a, b) => b[1] - a[1]) // tri décroissant sur la proba
            .forEach(([letter, prob]) => {
                const percent = (prob * 100).toFixed(3);
                console.log(`  ${letter}: ${percent}%`);
            });
    }
    const wordCompletions = getBestWordCompletions(context);
    if (wordCompletions.length > 0) {
        console.log("\nMots suggérés :");
        wordCompletions.forEach(({ word, score }) => {
            const percent2 = (score * 100).toFixed(3);
            console.log(`  ${word} (score: ${percent2}%)`);
        });
    }
}

function askContinue(context) {
    rl.question('Voulez-vous continuer ? (o/n) ', (answer) => {
        if (answer.toLowerCase() === 'o') {
            rl.question('Choisissez une lettre : ', (letter) => {
                context.push(letter);
                displayPrediction(context);
                askContinue(context);
            });
        } else if (answer.toLowerCase() === 'n') {
            console.log('Fin de la prédiction.');
            rl.close();
        }
        else {
            console.log('Réponse invalide. Veuillez répondre par "o" ou "n".');
            askContinue(context);
        }
    });
}

// Point d'entrée
rl.question('Choisissez une lettre : ', (letter) => {
    const context = [letter];
    displayPrediction(context);
    askContinue(context);
});
