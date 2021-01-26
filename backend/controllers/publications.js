const fs = require('fs');       // importation du paquet node js (gestion des fichiers système)
const mysql = require('mysql');       // importation du paquet mysql
const jwt = require('jsonwebtoken');        // importation du paquet jwt

const bdd = require("../bdd_config/bdd_connexion");     // importation de la connexion a la base de données


let decodeToken = function(req){                                                    // fonction qui décode le token et récupère le UserID et le niveau d'acces
    let token = req.headers.authorization.split(' ')[1];                            // on récupère uniquement le token du header de la requête
    let decodedToken = jwt.verify(token, process.env.JWT_AUTH_SECRET_TOKEN);        // on décode le token avec la fonction verify qui prend le token et la clé secrète
    decodedToken = [decodedToken.userId, decodedToken.niveau_acces];                // on récupère le niveau d'acces du token décodé
    return decodedToken;                                                            // on retourne un tableau avec le UserId et le niveau d'acces
}


exports.createPublication = (req, res, next) => {

    const tokenInfos = decodeToken(req);        // on utilise la fonction decodeToken
    const userId = tokenInfos[0];               // on obtient le UserId du token

    const titre = req.body.titre;
    const description = req.body.description;

    if (req.file !== undefined) {                                                           // si une image est trouvée
        let imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;  // on paramètre son url
    }

    let imageUrl = "";  // si aucune image alors on laisse le champ vide

    let sql = "INSERT INTO publications (user_id, titre, description, image_url) VALUES (?, ?, ?, ? )";    // préparation de la requete SQL
    let inserts = [userId, titre, description, imageUrl];                                           // utilisation des valeurs à insérer
    sql = mysql.format(sql, inserts);                                                               // assemblage final de la requête

    const publicationCreate = bdd.query(sql, (error, publication) => {                               // envoi de la requête a la base de données
        if (!error) {
            res.status(201).json({ message: "Publication enregistrée" });
        } else {
            res.status(500).json({ message: "Une erreur est survenue, la publication n'a pas été créée" });
        }
    });
};

exports.getAllPublications = (req, res, next) => { };

exports.getMostRecentPublications = (req, res, next) => { };

exports.getMostLikedPublications = (req, res, next) => { };

exports.getMostCommentedPublications = (req, res, next) => { };

exports.getOneUserAllPublications = (req, res, next) => { };

exports.getOnePublication = (req, res, next) => { };

exports.deletePublication = (req, res, next) => {

    const tokenInfos = decodeToken(req);                                // on utilise la fonction decodeToken
    const userId = tokenInfos[0];                                       // on obtient le UserId du token
    const niveauAcces = tokenInfos[1];                                  // on obtient le niveau d'acces du token
    
    const filename = req.body.imageUrl.split("/images/")[1];           // on extrait le nom du fichier à supprimer
    const publicationId = req.params.id;                                // on récupère l'id de la publication

    if (niveauAcces === 1) {                                                    // si le niveau d'acces est 1 (Modérateur)
        let sql = "DELETE FROM publications WHERE id = ?";                      // préparation de la requete SQL
        let inserts = [publicationId];                                          // utilisation des valeurs à insérer
        sql = mysql.format(sql, inserts);                                       // assemblage final de la requête
        let role = "Modérateur";

        const publicationDelete = bdd.query(sql, (error, result) => {               // envoi de la requête a la base de données
            if (!error) {
                if(req.body.imageUrl) {
                    fs.unlink(`images/${filename}`, (error) => {                        // on supprime le fichier grâce à fs.unlink
                        consol.log("Erreur lors de la suppresion du fichier...")
                    });
                }
                res.status(200).json({ message: "La publication a été supprimée !" });
            } else {
                res.status(500).json({ message: "Une erreur est survenue, la publication n'a pas été supprimée" });
            }
        });
    } else {                                                                    // sinon
        let sql = "DELETE FROM publications WHERE id = ? AND user_id = ?";      // préparation de la requete SQL
        let inserts = [publicationId, userId];                                  // utilisation des valeurs à insérer
        sql = mysql.format(sql, inserts);                                       // assemblage final de la requête
        let role = "Utilisateur";

        const publicationDelete = bdd.query(sql, (error, result) => {               // envoi de la requête a la base de données
            if (!error) {
                if(req.body.imageUrl) {
                    fs.unlink(`images/${filename}`, (error) => {                        // on supprime le fichier grâce à fs.unlink
                        consol.log("Erreur lors de la suppresion du fichier...")
                    });
                }
                res.status(200).json({ message: "La publication a été supprimée !" });
            } else {
                res.status(500).json({ message: "Une erreur est survenue, la publication n'a pas été supprimée" });
            }
        });
    }
};

exports.commentPublication = (req, res, next) => {

    const tokenInfos = decodeToken(req);                                // on utilise la fonction decodeToken
    const userId = tokenInfos[0];                                       // on obtient le UserId du token
    
    const publicationId = req.body.publicationId;                       // on récupère l'id de la publication
    const message = req.body.message;                                    // on extrait le message du commentaire

    let sql = "INSERT INTO commentaires (user_id, publication_id, message) VALUES (?, ?, ?)";   // préparation de la requete SQL
    let inserts = [userId, publicationId, message];                                             // utilisation des valeurs à insérer
    sql = mysql.format(sql, inserts);                                                           // assemblage final de la requête

    const commentaireCreate = bdd.query(sql, (error, result) => {                               // envoi de la requête a la base de données
        if (!error) {
            res.status(201).json({ message: "Le commentaire a bien été créé" });
        } else {
            res.status(500).json({ message: "Une erreur est survenue, le commentaire n'a pas été créé" });
        }
    });
};

exports.deleteComment = (req, res, next) => {
    
    const tokenInfos = decodeToken(req);                                // on utilise la fonction decodeToken
    const userId = tokenInfos[0];                                       // on obtient le UserId du token
    const niveauAcces = tokenInfos[1];                                  // on obtient le niveau d'acces du token

    const commentaireId = req.params.id;                                // on récupère l'id du commentaire

    if (niveauAcces === 1) {                                                    // si le niveau d'acces est 1 (Modérateur)
        let sql = "DELETE FROM commentaires WHERE id = ?";                      // préparation de la requete SQL
        let inserts = [commentaireId];                                          // utilisation des valeurs à insérer
        sql = mysql.format(sql, inserts);                                       // assemblage final de la requête
        let role = "Modérateur";

        const commentaireDelete = bdd.query(sql, (error, result) => {               // envoi de la requête a la base de données
            if (!error) {
                res.status(200).json({ message: "Le commentaire a été supprimé !" + " (" + role + " )" });
            } else {
                res.status(500).json({ message: "Une erreur est survenue, le commentaire n'a pas été supprimé" });
            }
        });
    } else {                                                                    // sinon
        let sql = "DELETE FROM commentaires WHERE id = ? AND user_id = ?";      // préparation de la requete SQL
        let inserts = [commentaireId, userId];                                  // utilisation des valeurs à insérer
        sql = mysql.format(sql, inserts);                                       // assemblage final de la requête
        let role = "Utilisateur";

        const commentaireDelete = bdd.query(sql, (error, result) => {               // envoi de la requête a la base de données
            if (!error) {
                res.status(200).json({ message: "Le commentaire a été supprimé !" + " (" + role + ")" });
            } else {
                res.status(500).json({ message: "Une erreur est survenue, le commentaire n'a pas été supprimé" });
            }
        });
    }
};

exports.votePublication = (req, res, next) => {

    const tokenInfos = decodeToken(req);                                // on utilise la fonction decodeToken
    const userId = tokenInfos[0];                                       // on obtient le UserId du token

    const publicationId = req.body.publicationId;                       // on récupère l'id de la publication
    const vote = req.body.vote;                                         // on récupère le vote
    const alreadyVote = req.body.alreadyVote;                           // on récupère l'info si l'utilisateur a déjà voté la publication

    switch (vote) {
        case 0 : // Vote null sur la publication (No like/ No dislike)
            try {
                let sql = "UPDATE votes SET vote = 0 WHERE publication_id = ? AND user_id = ?";     // préparation de la requete SQL
                let inserts = [publicationId, userId];                                              // utilisation des valeurs à insérer
                sql = mysql.format(sql, inserts);                                                   // assemblage final de la requête

                const voteNullUpdate = bdd.query(sql, (error, result) => {                          // envoi de la requête a la base de données
                    if (error) {
                        res.status(401).json({ error: "La modification de votre vote a échouée ! (null)" });
                    } else {
                        res.status(200).json({ message: "Votre vote a été modifié avec succès ! (null)" });
                    }
                });
            } catch (error) {
                res.status(500).json({ error: "Une erreur est survenue, la modification de votre vote a échouée ! (null)" });
            }
            break;

        case 1 : // Vote like sur la publication
            try {
                if (alreadyVote) {                                                                      // si l'utilisateur a déjà voté sur cette publication
                    let sql = "UPDATE votes SET vote = 1 WHERE publication_id = ? AND user_id = ?";     // préparation de la requete SQL
                    let inserts = [publicationId, userId];                                              // utilisation des valeurs à insérer
                    sql = mysql.format(sql, inserts);                                                   // assemblage final de la requête

                    const voteLikeUpdate = bdd.query(sql, (error, result) => {                              // envoi de la requête a la base de données
                        if (error) {
                            res.status(401).json({ error: "La modification de votre vote a échouée ! (like)" });
                        } else {
                            res.status(200).json({ message: "Votre vote a été modifié avec succès ! (like)" });
                        }
                    });
                } else {
                    let sql = "INSERT INTO votes (publication_id, user_id, vote) VALUES (?, ?, 1)";     // préparation de la requete SQL
                    let inserts = [publicationId, userId];                                              // utilisation des valeurs à insérer
                    sql = mysql.format(sql, inserts);                                                   // assemblage final de la requête

                    const voteLikeUpdate = bdd.query(sql, (error, result) => {                              // envoi de la requête a la base de données
                        if (error) {
                            res.status(401).json({ error: "La modification de votre vote a échouée ! (like)" });
                        } else {
                            res.status(200).json({ message: "Votre vote a été modifié avec succès ! (like)" });
                        }
                    });
                }
            } catch (error) {
                res.status(500).json({ error: "Une erreur est survenue, la modification de votre vote a échouée ! (like)" });
            }
            break;

        case 2 : // Vote dislike sur la publication
            try {
                if (alreadyVote) {                                                                      // si l'utilisateur a déjà voté sur cette publication
                    let sql = "UPDATE votes SET vote = 2 WHERE publication_id = ? AND user_id = ?";     // préparation de la requete SQL
                    let inserts = [publicationId, userId];                                              // utilisation des valeurs à insérer
                    sql = mysql.format(sql, inserts);                                                   // assemblage final de la requête

                    const voteLikeUpdate = bdd.query(sql, (error, result) => {                              // envoi de la requête a la base de données
                        if (error) {
                            res.status(401).json({ error: "La modification de votre vote a échouée ! (dislike)" });
                        } else {
                            res.status(200).json({ message: "Votre vote a été modifié avec succès ! (dislike)" });
                        }
                    });
                } else {
                    let sql = "INSERT INTO votes (publication_id, user_id, vote) VALUES (?, ?, 2)";     // préparation de la requete SQL
                    let inserts = [publicationId, userId];                                              // utilisation des valeurs à insérer
                    sql = mysql.format(sql, inserts);                                                   // assemblage final de la requête

                    const voteLikeUpdate = bdd.query(sql, (error, result) => {                              // envoi de la requête a la base de données
                        if (error) {
                            res.status(401).json({ error: "La modification de votre vote a échouée ! (dislike)" });
                        } else {
                            res.status(200).json({ message: "Votre vote a été modifié avec succès ! (dislike)" });
                        }
                    });
                }
            } catch (error) {
                res.status(500).json({ error: "Une erreur est survenue, la modification de votre vote a échouée ! (dislike)" });
            }
            break;
    }
};