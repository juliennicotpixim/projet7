require('dotenv').config();      // importation du paquet dotenv pour les variables d'environnement
const express = require('express');     // importation du paquet express
const bodyParser = require('body-parser');      // importation du paquet body-parser
const path = require('path');       // importation du paquet node "path" qui donne accès au chemin du système de fichier
const helmet = require('helmet');     // importation du paquet helmet
const sanitizeMiddleware = require('sanitize-middleware');      // importation du paquet sanitize middleware

const usersRoutes = require('./routes/users')     // importation du router users
const publicationsRoutes = require('./routes/publications')     // importation du router publications

const app = express();      // Création de l'application express

app.use(helmet());      // Mise en place d'un header sécurisé pour luter contre les failles XSS

app.use((req, res, next) => {       // middleware général appliqué à toute les requêtes (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');      // autorisation d'acceder à notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');        //  autorisation d'utiliser certains headers
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');        // autorisation d'utiliser certaines méthodes
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));        // URL-encoded data with the "querystring" library 
app.use(bodyParser.json());     // transforme le corps de la requête en objet javascript utilisable

app.use(sanitizeMiddleware());      // nettoyage des données reçus pour éviter les injections SQL

app.use('/images', express.static(path.join(__dirname, 'images')));   // middleware spécifique qui permet de servir le dossier image lors d'une requête spécifique avec l'image

app.use('/users', usersRoutes);       // pour cette route la, on utilise le router usersRoutes
app.use('/publications', publicationsRoutes);       // pour cette route la, on utilise le router publicationsRoutes

module.exports = app;       // Exportation de l'application pour y accéder à partir des autres fichiers