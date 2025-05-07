import readline from 'readline';
import { getLetterPrediction } from './predictor.js';

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
        for (const [letter, prob] of Object.entries(prediction)) {
            console.log(`  ${letter}: ${prob}`);
        }
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
        } else {
            console.log('Fin de la prédiction.');
            rl.close();
        }
    });
}

// Point d'entrée
rl.question('Choisissez une lettre : ', (letter) => {
    const context = [letter];
    displayPrediction(context);
    askContinue(context);
});
