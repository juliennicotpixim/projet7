const http = require('http');      // Importation du package http de node (permet de creer un serveur)
const app = require('./app')        // Importation de app.js

app.set('port, 3000')       // Port utilisé par l'application express
const server = http.createServer(app);      // L'application créée par express est une fonction qui va recevoir la requête et la réponse

server.listen(3000);        // Le serveur attend les requêtes au port 3000