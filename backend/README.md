# Backend
BDD et sécurité :
    1. La base de données utilisée dans le MVP est une base de données Mongo Atlas.
    2. Le lien de vers la base de données de test et le token d'authentification ont été laissé dans le fichier .env pour les tests.
    3. Pour connecter votre base de données il vous faut aller dans le fichier ".env" et modifier l'adresse de la variable d'environnement "MONGODB_URL".
    4. Dans ce même fichier ".env", vous trouverez la variable d'environnement "AUTH_TOKEN" avec un token à définir (10 caractères minimum) pour créer un token d'authentification secret.

Pour lancer le backend :
    1. Rendez vous dans le répertoire "backend" à l'aide de la console.
    2. Lancez la commande "npm install" pour charger les packages nécéssaires.
    3. Lancez la commande "node server" ou "nodemon server".
    4. Le serveur doit se lancer sur le port 3000.