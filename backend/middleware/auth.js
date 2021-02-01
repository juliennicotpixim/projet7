require('dotenv').config();      // importation du paquet dotenv pour les variables d'environnement
const jwt = require('jsonwebtoken');        // importation du paquet jwt

module.exports = (req, res, next) => {
    try {                                                                               // on utilise try/catch car plusieurs éléments peuvent poser problème
        const token = req.headers.authorization.split(' ')[1];                          // on récupère uniquement le token du header de la requête
        const decodedToken = jwt.verify(token, process.env.JWT_AUTH_SECRET_TOKEN);      // on décode le token avec la fonction verify qui prend le token et la clé secrète
        const userId = decodedToken.userId;                                             // on récupère le userId du token décodé
        if (req.body.userId && req.body.userId !== userId) {                            // si on optient bien un userId et que celui-ci est différent du userId
            res.status(401).json({ error: "Requête non autorisée !" });                 // si une erreur est reçu on l'affiche, sinon on affiche le message personnalisé
        } else {
            next();                                                                     // sinon on appelle next car la validation est un succès
        }
    } catch {
        res.status(401).json({ error: "Requête non authentifiée !" });                  // si une erreur est reçu on l'affiche, sinon on affiche le message personnalisé
    }
};