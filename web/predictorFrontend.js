let modelData = {};
let maxOrder = 1;
let wordsList = [];

async function loadModel() {
    const response = await fetch('model.json');
    modelData = await response.json();
    maxOrder = Math.max(...Object.keys(modelData).map(Number));

    // Charger aussi la liste des mots pour les complétions (à placer dans le même dossier web)
    const wordsResp = await fetch('words.json');
    wordsList = await wordsResp.json();
}

function getLetterPrediction(context) {
    const letters = context.toLowerCase().split('');
    const n = Math.min(letters.length, maxOrder);
    const key = letters.slice(-n).join('');
    const prediction = modelData[n]?.[key] || {};
    return { key, n, prediction };
}

// Fonction pour calculer la probabilité d'un mot (même logique que dans main.js)
function calcWordScore(word) {
    const letters = ['^', ...word.split(''), '$'];
    let prob = 1;
    for (let i = 0; i < letters.length - 1; i++) {
        const ctx = letters.slice(Math.max(0, i - maxOrder + 1), i + 1).join('');
        const next = letters[i + 1];
        const p = modelData[ctx.length]?.[ctx]?.[next] || 0.0001;
        prob *= p;
    }
    return prob;
}

function getBestWordCompletions(context, maxSuggestions = 3) {
    const prefix = context.toLowerCase();
    const matchingWords = wordsList.filter(w => w.startsWith(prefix));
    const scored = matchingWords.map(word => ({ word, score: calcWordScore(word) }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, maxSuggestions);
}

function renderPrediction({ key, n, prediction }) {
    const resultDiv = document.getElementById('predictionResult');
    if (!key) {
        resultDiv.innerHTML = "<p>Aucune entrée.</p>";
        return;
    }

    // Trier les prédictions par probabilité décroissante
    const sortedPredictions = Object.entries(prediction).sort((a, b) => b[1] - a[1]);

    let html = `<div class="card">
        <h2>Prédiction pour "<span class="context">${key}</span>" (n = ${n})</h2>`;

    if (sortedPredictions.length === 0) {
        html += "<p>Aucune prédiction disponible.</p>";
    } else {
        html += `<ul class="letter-list">`;
        for (const [letter, prob] of sortedPredictions) {
            html += `<li><strong>${letter}</strong> : ${(prob * 100).toFixed(2)}%</li>`;
        }
        html += `</ul>`;
    }

    // Affichage des mots suggérés (top 3)
    const topWords = getBestWordCompletions(key, 3);
    if (topWords.length > 0) {
        html += `<div class="card words-card">
            <h3>Mots suggérés :</h3>
            <ul>`;
        topWords.forEach(({ word, score }) => {
            html += `<li>${word} (score : ${(score * 100).toFixed(3)}%)</li>`;
        });
        html += `</ul>
        </div>`;
    }

    html += `</div>`;

    resultDiv.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadModel();
    const input = document.getElementById('contextInput');
    input.addEventListener('input', () => {
        const context = input.value.trim();
        const prediction = getLetterPrediction(context);
        renderPrediction(prediction);
    });
});
