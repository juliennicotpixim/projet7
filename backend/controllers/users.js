require('dotenv').config();      // importation du paquet dotenv pour les variables d'environnement
const validator = require("validator");     // importation du paquet validator
const mysql = require('mysql');       // importation du paquet mysql
const bcrypt = require ('bcrypt');       // importation du paquet bcrypt
const jwt = require('jsonwebtoken');        // importation du paquet jwt

const bdd = require("../bdd_config/bdd_connexion");     // importation de la connexion a la base de données


let decodeNiveauAcces = function(req){                                              // fonction qui décode le token et récupère le UserID et le niveau d'acces
    let token = req.headers.authorization.split(' ')[1];                            // on récupère uniquement le token du header de la requête
    let decodedToken = jwt.verify(token, process.env.JWT_AUTH_SECRET_TOKEN);        // on décode le token avec la fonction verify qui prend le token et la clé secrète
    decodedToken = [decodedToken.userId, decodedToken.niveau_acces];                // on récupère le niveau d'acces du token décodé
    return decodedToken;                                                            // on retourne un tableau avec le UserId et le niveau d'acces
}


exports.signup = (req, res, next) => {

    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const departement = req.body.departement;
    const poste = req.body.poste;
    const password = req.body.password;

    if (validator.isEmail(String(email))) {                    // Si l'email passe la validation
        bcrypt.hash(password, 10, (error, hash) => {           // fonction asynchrone pour hasher le mot de passe

                let sql = "INSERT INTO users (nom, prenom, email, departement, poste, mot_de_passe) VALUES (?, ?, ?, ?, ?, ?)";     // préparation de la requete SQL
                let inserts = [nom, prenom, email, departement, poste, hash];                                                       // utilisation des valeurs à insérer
                sql = mysql.format(sql, inserts);                                                                                   // assemblage final de la requête
    
                const userSignup = bdd.query(sql, (error, user) => {            // envoi de la requête a la base de données
                    if (!error) {                                               // si aucune erreur après la requête
                        res.status(201).json({                                  // on retourne
                            message: "L'utilisateur a été créé avec succès !",  // on renvoi un message de confirmation
                            userId: user.insertId,                              // on renvoi son UserId
                            niveau_acces: 0,                                    // on renvoi le niveau d'accès basique
                            token: jwt.sign(                                    // fonction sign qui prend les données que nous allons encoder à l'intérieur du token
                                { userId: user.insertId, niveau_acces: 0 },     // création d'un objet avec le UserId et le niveau d'acces pour être sur de la correspondance
                                process.env.JWT_AUTH_SECRET_TOKEN,              // clé secrète pour l'encodage
                                { expiresIn: process.env.JWT_EXPIRATION }       // configuration de l'expiration du token
                            )
                        });
                    } else {
                        return res.status(400).json({ error : "Cet utilisateur existe déjà"})      // erreur utilisateur déjà existant
                    }
                });
            });
    } else {
        return res.status(400).json({ error : "Votre email est invalide !"})      // le format de l'email est invalide
    }
};


exports.login = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    if (validator.isEmail(String(email))) {

        let sql= "SELECT id, email, mot_de_passe, niveau_acces FROM users WHERE email = ?";
        let inserts = [email];
        sql = mysql.format(sql, inserts);

        const userLogin = bdd.query(sql, (error, user) => {
            console.log(user)
            if (error) {                                                                // si aucune correspondance avec un utilisateur n'a été trouvée
                return res.status(400).json({ error : "Votre email est invalide !" })   // l'email est donc invalide
            }

            bcrypt.compare(password, user[0].mot_de_passe).then((valid) => {                // si une correspondance avec un utilisateur a été trouvée alors on vérifie le mot de passe
                if (!valid) {                                                           // si les deux mots de passes ne correspondent pas
                    return res.status(401).json({ error : "Mot de passe invalide !"})   // le mot de passe est donc invalide
                }

                res.status(200).json({                                                  // si la connexion est approuvée on retourne
                    message: "Vous êtes désormais connecté !",                          // on renvoi un message de confirmation                                      
                    userId: user[0].id,                                                 // on renvoi son UserId
                    niveau_acces: user[0].niveau_acces,                                 // on renvoi son niveau d'acces
                    token: jwt.sign(                                                    // fonction sign qui prend les données que nous allons encoder à l'intérieur du token
                        { userId: user[0].id, niveau_acces: user[0].niveau_acces },     // création d'un objet avec le UserId et le niveau d'acces pour être sur de la correspondance
                        process.env.JWT_AUTH_SECRET_TOKEN,                              // clé secrète pour l'encodage
                        { expiresIn: process.env.JWT_EXPIRATION }                       // configuration de l'expiration du token
                    )
                });
            });
        });
    }
};

exports.getOneUser = (req, res, next) => { };

exports.updateOneUser = (req, res, next) => { };

exports.deleteOneUser = (req, res, next) => { 
    console.log(decodeNiveauAcces(req))
};