import express from 'express';

const expressApp = express();
const port = 8000;

expressApp.use(express.static('.')); // sert le contenu du dossier courant

expressApp.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
