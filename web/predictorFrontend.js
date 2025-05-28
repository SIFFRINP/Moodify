let modelData = {};
let maxOrder = 1;

async function loadModel() {
    const response = await fetch('model.json');
    modelData = await response.json();
    maxOrder = Math.max(...Object.keys(modelData).map(Number));
}

function getLetterPrediction(context) {
    const letters = context.toLowerCase().split('');
    const n = Math.min(letters.length, maxOrder);
    const key = letters.slice(-n).join('');
    const prediction = modelData[n]?.[key] || {};
    return { key, n, prediction };
}

function renderPrediction({ key, n, prediction }) {
    const resultDiv = document.getElementById('predictionResult');
    if (!key) {
        resultDiv.innerHTML = "<p>Aucune entrée.</p>";
        return;
    }

    let html = `<p><strong>Contexte :</strong> "${key}" (n = ${n})</p>`;
    if (Object.keys(prediction).length === 0) {
        html += "<p>Aucune prédiction disponible.</p>";
    } else {
        html += "<ul>";
        for (const [letter, prob] of Object.entries(prediction)) {
            html += `<li>${letter} : ${(prob * 100).toFixed(1)}%</li>`;
        }
        html += "</ul>";
    }
    resultDiv.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadModel();
    const input = document.getElementById('contextInput');
    input.addEventListener('input', () => {
        const context = input.value;
        const prediction = getLetterPrediction(context);
        renderPrediction(prediction);
    });
});
