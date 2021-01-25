require('dotenv').config();      // importation du paquet dotenv pour les variables d'environnement
const validator = require("validator");     // importation du paquet validator
const bcrypt = require ('bcrypt');       // importation du paquet bcrypt
const jwt = require('jsonwebtoken');        // importation du paquet jwt

const bdd = require("../bdd_config/bdd_connexion.js");     // importation de la connexion a la base de données

exports.signup = (req, res, next) => {

    console.log(req.body) 

    const nom = req.body.name;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const departement = req.body.departement;
    const poste = req.body.poste;
    const password = req.body.password;

    if (validator.isEmail(String(email))) {     // Si l'email passe la validation
        bcrypt.hash(password, 10)      // fonction asynchrone pour hasher le mot de passe
        .then(hash => {  
            let sql = "INSERT INTO users (nom, prenom, email, departement, poste, mot_de_passe) VALUES (?, ?, ?, ?, ?, ?)";     // préparation de la requete SQL
            let inserts = [nom, prenom, email, departement, poste, hash];                                                   // utilisation des bonnes valeurs
            sql = mysql.format(sql, inserts);                                                                                   // assemblage final de la requête
            
            const userSignup = bdd.query(sql)
            .then(error, user => {
                if (error) {    // si la requête a échouée
                    return res.status(400).json({ error })      // on renvoi une erreur
                } else {
                    res.status(201).json({      // mais si la requête a bien été effectuée
                        userId: user.id,       // on renvoi son UserId
                        niveau_acces: user.niveau_acces,       // on renvoi son niveau d'acces
                        token: jwt.sign(        // fonction sign qui prend des arguments les données que nous allons encoder à l'intérieur du token
                            { userId : user.id,
                            niveau_acces: user.niveau_acces },     // création d'un objet avec le UserId et le niveau d'acces pour être sur de la correspondance
                            process.env.JWT_AUTH_SECRET_TOKEN,     // clé secrète pour l'encodage
                            { expiresIn: process.env.JWT_EXPIRATION }       // configuration de l'expiration du token
                        )          
                    });
                }
            })
            .catch(error => res.status(400).json({ error : "Cet utilisateur existe déjà !" }));
        })
        .catch(error => res.status(400).json({ error }));
    } else {
        return res.status(400).json({ error : "Votre email est invalide !"})      // on renvoi une erreur
    }
};

exports.login = (req, res, next) => { };

exports.getOneUser = (req, res, next) => { };

exports.updateOneUser = (req, res, next) => { };

exports.deleteOneUser = (req, res, next) => { };