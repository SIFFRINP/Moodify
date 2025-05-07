import fs from 'fs';
import * as R from "ramda";

export class MarkovModel {
    constructor(maxOrder) {
        this.maxOrder = maxOrder;
        this.models = {};
    }

    train(sequence) {
        for (let n = 1; n <= this.maxOrder; n++) {
            this.models[n] = {};
            for (let i = 0; i <= sequence.length - n; i++) {
                const contextArray = sequence.slice(i, i + n);
                const context = contextArray.join('');
                const next = sequence[i + n];
                if (!next) continue;

                if (
                    contextArray.includes('$') ||
                    (contextArray.includes('^') && contextArray[0] !== '^') ||
                    next === '^'
                ) {
                    continue;
                }

                if (!this.models[n][context]) {
                    this.models[n][context] = {};
                }

                if (!this.models[n][context][next]) {
                    this.models[n][context][next] = 0;
                }

                this.models[n][context][next]++;
            }

            // Probabilités
            for (const context in this.models[n]) {
                const total = R.sum(R.values(this.models[n][context]));
                for (const next in this.models[n][context]) {
                    this.models[n][context][next] /= total;
                }
            }
        }
    }


    toJSON() {
        return JSON.stringify(this.models, null, 2);
    }

    saveToFile(filepath) {
        fs.writeFileSync(filepath, this.toJSON());
    }
}

// Exemple d’entraînement et sauvegarde
if (process.argv[1].endsWith('markovModel.js')) {
    const tokens = JSON.parse(fs.readFileSync('../data/tokens.json', 'utf8'));
    const model = new MarkovModel(10);
    model.train(tokens);
    model.saveToFile('../data/model.json');
    console.log('Modèle entraîné et sauvegardé dans model.json');
}