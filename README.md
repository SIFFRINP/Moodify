# Prédicteur de lettres (Markov)

Projet de prédiction de lettres basé sur un modèle de Markov, avec une interface web et une interface en ligne de commande.

Structure du projet

web/ : dossier de l’interface web (HTML, JS, CSS, modèle JSON)

src/ : code backend / CLI en Node.js

data/ : données du modèle (model.json, words.json etc.)

# Lancer l’interface web (frontend)
1. Serveur local simple

Ouvrez un terminal dans le dossier web puis lancez :
 
    npm init -y

    npm install express

Lancez le serveur avec :

    node server.js


2. Ouvrez dans votre navigateur
http://localhost:8000

Vous y verrez l’interface graphique pour saisir une ou plusieurs lettres et obtenir la prédiction avec le top 3 des mots.

# Lancer la version terminal (CLI)
1. Installer les dépendances
   
Ouvrez un terminal à la racine du projet et lancez :

    npm install
2. Lancez le script principal

       node src/main.js
3. Utilisation
   
Le programme vous demande une lettre

Il affiche les prédictions de lettre et le top 3 des mots correspondants

Vous pouvez continuer à saisir des lettres ou quitter

Notre groupe : Klara Goucovitch, Noémie Pernin, Paul Peret, Paul Siffrin
