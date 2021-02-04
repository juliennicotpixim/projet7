require('dotenv').config();      // importation du paquet dotenv pour les variables d'environnement
const fs = require('fs');       // importation du paquet node js (gestion des fichiers système)
const mysql = require('mysql');       // importation du paquet mysql
const jwt = require('jsonwebtoken');        // importation du paquet jwt
const querystring = require('querystring');     // importation du paquer querystring

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

    const titre = req.body.titre;               // on récupère le titre de la publication
    const description = req.body.description;   // on récupère la description de la publication

    if (req.file !== undefined) {                                                               // si une image est trouvée
        const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;    // on paramètre son url
        let sql = "INSERT INTO publications (user_id, titre, description, image_url) VALUES (?, ?, ?, ? )";     // préparation de la requete SQL
        let inserts = [userId, titre, description, imageUrl];                                                   // utilisation des valeurs à insérer
        sql = mysql.format(sql, inserts);                                                                       // assemblage final de la requête

        const publicationCreate = bdd.query(sql, (error, publication) => {                                      // envoi de la requête a la base de données
            if (!error) {
                res.status(201).json({ message: "Publication enregistrée" });
            } else {
                res.status(400).json({ message: "Une erreur est survenue, la publication n'a pas été créée" });
            }
        });
    } else {
        const imageUrl = "";  // si aucune image alors on laisse le champ vide
        let sql = "INSERT INTO publications (user_id, titre, description, image_url) VALUES (?, ?, ?, ? )";     // préparation de la requete SQL
        let inserts = [userId, titre, description, imageUrl];                                                   // utilisation des valeurs à insérer
        sql = mysql.format(sql, inserts);                                                                       // assemblage final de la requête

        const publicationCreate = bdd.query(sql, (error, publication) => {                                      // envoi de la requête a la base de données
            if (!error) {
                res.status(201).json({ message: "Publication enregistrée" });
            } else {
                res.status(400).json({ message: "Une erreur est survenue, la publication n'a pas été créée" });
            }
        });
    } 
};

exports.getAllPublications = (req, res, next) => {

    const tokenInfos = decodeToken(req);        // on utilise la fonction decodeToken
    const userId = tokenInfos[0];               // on obtient le UserId du token
    const page = req.query.page;                // on récupère le numéro de la page (la première page est la page 1)
    let offset = 10;                            // offset par défaut sur 10 (limite du nombre de publication et décalage de l'offset)

    offset = offset * (page - 1);               // on multipli l'offset par le numéro de la page -1

    let sql = `SELECT   user.id AS publicationCreateByUserId,
                        user.nom AS publicationCreateByUserNom,
                        user.prenom AS publicationCreateByUserPrenom,
                        publication.id AS publicationId,
                        publication.creation_date AS publicationCreationDate,
                        publication.titre AS publicationTitre,
                        publication.description AS publicationDescription,
                        publication.image_url AS publicationImageUrl,

                        (SELECT COUNT(if(vote = 2, 1, NULL)) FROM votes WHERE publication_id = publication.id) AS publicationLikeCount,
                        (SELECT COUNT(if(vote = 3, 1, NULL)) FROM votes WHERE publication_id = publication.id) AS publicationDislikeCount,
                        (SELECT COUNT(if(publication_id = publication.id, 1, NULL)) FROM commentaires WHERE publication_id = publication.id) AS publicationCommentCount,
                        (SELECT vote FROM votes WHERE user_id = ? AND publicationId = votes.publication_id) AS userVote

                        FROM publications AS publication
                        
                        JOIN users AS user ON publication.user_id = user.id
                        GROUP BY publication.id ORDER BY publicationCreationDate DESC
                        LIMIT 10 OFFSET ?;`;

    let inserts = [userId, offset];
    sql = mysql.format(sql, inserts);

    const getPublications = bdd.query(sql, (error, publications) => {
        if (error) {
            res.status(400).json({ error: "Une erreur est survenue, aucune publication trouvée !" });
        } else {
            sql = `SELECT COUNT(*) FROM publications;`;
            const getPublicationsTotal = bdd.query(sql, (error, publicationsTotalCount) => {
                if (error) {
                    res.status(400).json({ error: "Une erreur est survenue, aucune publication trouvée !" });
                } else {
                    res.status(200).json([publications, publicationsTotalCount]);
                }
            });
        }
    });
};

exports.getMostRecentPublications = (req, res, next) => {

    const tokenInfos = decodeToken(req);        // on utilise la fonction decodeToken
    const userId = tokenInfos[0];               // on obtient le UserId du token
    const page = req.query.page;                // on récupère le numéro de la page (la première page est la page 1)
    let offset = 10;                            // offset par défaut sur 10 (limite du nombre de publication et décalage de l'offset)

    offset = offset * (page - 1);               // on multipli l'offset par le numéro de la page -1

    let sql = `SELECT   user.id AS publicationCreateByUserId,
                        user.nom AS publicationCreateByUserNom,
                        user.prenom AS publicationCreateByUserPrenom,
                        publication.id AS publicationId,
                        publication.creation_date AS publicationCreationDate,
                        publication.titre AS publicationTitre,
                        publication.description AS publicationDescription,
                        publication.image_url AS publicationImageUrl,

                        (SELECT COUNT(if(vote = 2, 1, NULL)) FROM votes WHERE publication_id = publication.id) AS publicationLikeCount,
                        (SELECT COUNT(if(vote = 3, 1, NULL)) FROM votes WHERE publication_id = publication.id) AS publicationDislikeCount,
                        (SELECT COUNT(if(publication_id = publication.id, 1, NULL)) FROM commentaires WHERE publication_id = publication.id) AS publicationCommentCount,
                        (SELECT vote FROM votes WHERE user_id = ? AND publicationId = votes.publication_id) AS userVote

                        FROM publications AS publication

                        JOIN users AS user ON publication.user_id = user.id
                        GROUP BY publication.id ORDER BY publicationCreationDate DESC
                        LIMIT 10 OFFSET ?;`;

    let inserts = [userId, offset];
    sql = mysql.format(sql, inserts);

    const getPublications = bdd.query(sql, (error, publications) => {
        if (error) {
            res.status(400).json({ error: "Une erreur est survenue, aucune publication trouvée !" });
        } else {
            sql = `SELECT COUNT(*) FROM publications;`;
            const getPublicationsTotal = bdd.query(sql, (error, publicationsTotalCount) => {
                if (error) {
                    res.status(400).json({ error: "Une erreur est survenue, aucune publication trouvée !" });
                } else {
                    res.status(200).json([publications, publicationsTotalCount]);
                }
            });
        }
    });
};

exports.getMostLikedPublications = (req, res, next) => {

    const tokenInfos = decodeToken(req);        // on utilise la fonction decodeToken
    const userId = tokenInfos[0];               // on obtient le UserId du token
    const page = req.query.page;                // on récupère le numéro de la page (la première page est la page 1)
    let offset = 10;                            // offset par défaut sur 10 (limite du nombre de publication et décalage de l'offset)

    offset = offset * (page - 1);               // on multipli l'offset par le numéro de la page -1

    let sql = `SELECT   user.id AS publicationCreateByUserId,
                        user.nom AS publicationCreateByUserNom,
                        user.prenom AS publicationCreateByUserPrenom,
                        publication.id AS publicationId,
                        publication.creation_date AS publicationCreationDate,
                        publication.titre AS publicationTitre,
                        publication.description AS publicationDescription,
                        publication.image_url AS publicationImageUrl,

                        (SELECT COUNT(if(vote = 2, 1, NULL)) FROM votes WHERE publication_id = publication.id) AS publicationLikeCount,
                        (SELECT COUNT(if(vote = 3, 1, NULL)) FROM votes WHERE publication_id = publication.id) AS publicationDislikeCount,
                        (SELECT COUNT(if(publication_id = publication.id, 1, NULL)) FROM commentaires WHERE publication_id = publication.id) AS publicationCommentCount,
                        (SELECT vote FROM votes WHERE user_id = ? AND publicationId = votes.publication_id) AS userVote

                        FROM publications AS publication
                        
                        JOIN users AS user ON publication.user_id = user.id
                        GROUP BY publication.id ORDER BY publicationLikeCount DESC
                        LIMIT 10 OFFSET ?;`;

    let inserts = [userId, offset];
    sql = mysql.format(sql, inserts);

    const getPublications = bdd.query(sql, (error, publications) => {
        if (error) {
            res.status(400).json({ error: "Une erreur est survenue, aucune publication trouvée !" });
        } else {
            sql = `SELECT COUNT(*) FROM publications;`;
            const getPublicationsTotal = bdd.query(sql, (error, publicationsTotalCount) => {
                if (error) {
                    res.status(400).json({ error: "Une erreur est survenue, aucune publication trouvée !" });
                } else {
                    res.status(200).json([publications, publicationsTotalCount]);
                }
            });
        }
    });
};

exports.getMostCommentedPublications = (req, res, next) => {

    const tokenInfos = decodeToken(req);        // on utilise la fonction decodeToken
    const userId = tokenInfos[0];               // on obtient le UserId du token
    const page = req.query.page;                // on récupère le numéro de la page (la première page est la page 1)
    let offset = 10;                            // offset par défaut sur 10 (limite du nombre de publication et décalage de l'offset)

    offset = offset * (page - 1);               // on multipli l'offset par le numéro de la page -1

    let sql = `SELECT   user.id AS publicationCreateByUserId,
                        user.nom AS publicationCreateByUserNom,
                        user.prenom AS publicationCreateByUserPrenom,
                        publication.id AS publicationId,
                        publication.creation_date AS publicationCreationDate,
                        publication.titre AS publicationTitre,
                        publication.description AS publicationDescription,
                        publication.image_url AS publicationImageUrl,

                        (SELECT COUNT(if(vote = 2, 1, NULL)) FROM votes WHERE publication_id = publication.id) AS publicationLikeCount,
                        (SELECT COUNT(if(vote = 3, 1, NULL)) FROM votes WHERE publication_id = publication.id) AS publicationDislikeCount,
                        (SELECT COUNT(if(publication_id = publication.id, 1, NULL)) FROM commentaires WHERE publication_id = publication.id) AS publicationCommentCount,
                        (SELECT vote FROM votes WHERE user_id = ? AND publicationId = votes.publication_id) AS userVote

                        FROM publications AS publication
                        
                        JOIN users AS user ON publication.user_id = user.id
                        GROUP BY publication.id ORDER BY publicationCommentCount DESC
                        LIMIT 10 OFFSET ?;`;

    let inserts = [userId, offset];
    sql = mysql.format(sql, inserts);

    const getPublications = bdd.query(sql, (error, publications) => {
        if (error) {
            res.status(400).json({ error: "Une erreur est survenue, aucune publication trouvée !" });
        } else {
            sql = `SELECT COUNT(*) FROM publications;`;
            const getPublicationsTotal = bdd.query(sql, (error, publicationsTotalCount) => {
                if (error) {
                    res.status(400).json({ error: "Une erreur est survenue, aucune publication trouvée !" });
                } else {
                    res.status(200).json([publications, publicationsTotalCount]);
                }
            });
        }
    });
};

exports.getOneUserAllPublications = (req, res, next) => {

    const tokenInfos = decodeToken(req);        // on utilise la fonction decodeToken
    const userId = tokenInfos[0];               // on obtient le UserId du token

    let sql = `SELECT   user.id AS publicationCreateByUserId,
                        user.nom AS publicationCreateByUserNom,
                        user.prenom AS publicationCreateByUserPrenom,
                        publication.id AS publicationId,
                        publication.creation_date AS publicationCreationDate,
                        publication.titre AS publicationTitre,
                        publication.description AS publicationDescription,
                        publication.image_url AS publicationImageUrl,

                        (SELECT COUNT(if(vote = 2, 1, NULL)) FROM votes WHERE publication_id = publication.id) AS publicationLikeCount,
                        (SELECT COUNT(if(vote = 3, 1, NULL)) FROM votes WHERE publication_id = publication.id) AS publicationDislikeCount,
                        (SELECT COUNT(if(publication_id = publication.id, 1, NULL)) FROM commentaires WHERE publication_id = publication.id) AS publicationCommentCount,
                        (SELECT vote FROM votes WHERE user_id = ? AND publicationId = votes.publication_id) AS userVote

                        FROM publications AS publication
                        
                        JOIN users AS user ON publication.user_id = user.id
                        WHERE user.id = ?
                        GROUP BY publication.id ORDER BY publicationCreationDate DESC;`;

    let inserts = [userId, userId];
    sql = mysql.format(sql, inserts);

    const getOneUserAllPublications = bdd.query(sql, (error, publications) => {
        if (error) {
            res.status(400).json({ error: "Une erreur est survenue, aucune publication trouvée !" });
        } else {
            res.status(200).json(publications);
        }
    });
};

exports.getOnePublication = (req, res, next) => {

    const tokenInfos = decodeToken(req);        // on utilise la fonction decodeToken
    const userId = tokenInfos[0];               // on obtient le UserId du token
    const publicationId = req.params.id;        // récupération de l'ID de la publication

    const sqlPublication = `SELECT  user.id AS publicationCreateByUserId,
                                    user.nom AS publicationCreateByUserNom,
                                    user.prenom AS publicationCreateByUserPrenom,
                                    publication.id AS publicationId,
                                    publication.creation_date AS publicationCreationDate,
                                    publication.titre AS publicationTitre,
                                    publication.description AS publicationDescription,
                                    publication.image_url AS publicationImageUrl,

                                    (SELECT COUNT(if(vote = 2, 1, NULL)) FROM votes WHERE publication_id = publication.id) AS publicationLikeCount,
                                    (SELECT COUNT(if(vote = 3, 1, NULL)) FROM votes WHERE publication_id = publication.id) AS publicationDislikeCount,
                                    (SELECT COUNT(if(publication_id = publication.id, 1, NULL)) FROM commentaires WHERE publication_id = publication.id) AS publicationCommentCount,
                                    (SELECT vote FROM votes WHERE user_id = ? AND publicationId = votes.publication_id) AS userVote

                                    FROM publications AS publication

                                    JOIN users AS user ON publication.user_id = user.id
                                    WHERE publication.id = ? GROUP BY publication.id;`;

    const sqlCommentaires = `SELECT user.id AS commentaireCreateByUserId,
                                    user.nom AS commentaireCreateByUserNom,
                                    user.prenom AS commentaireCreateByUserPrenom,

                                    commentaire.id AS commentaireId,
                                    commentaire.creation_date AS commentaireCreationDate, 
                                    commentaire.message AS commentaireMessage

                                    FROM commentaires AS commentaire

                                    JOIN users AS user ON commentaire.user_id = user.id
                                    WHERE publication_id = ?
                                    GROUP BY commentaire.id ORDER BY commentaireCreationDate;`;

    const firstInserts = [userId, publicationId];
    const firstSql = mysql.format(sqlPublication, firstInserts);

    const secondInserts = [publicationId];
    const secondSql = mysql.format(sqlCommentaires, secondInserts);

    const getOnePublication = bdd.query(firstSql, (error, result) => {
        if (!error) {
            const publication = result;
            const getOnePublicationCommentaires = bdd.query(secondSql, (error, result) => {
                if (!error) {
                    const commentaires = result;
                    const finalReponse = {
                        publication: publication,
                        commentaires: commentaires
                    }
                    res.status(200).json(finalReponse)
                }
            });
        } else {
            console.log(error)
            res.status(400).json({ error: "Une erreur est survenue, aucune publication trouvée !" });
        } 
    });
};

exports.deletePublication = (req, res, next) => {

    const tokenInfos = decodeToken(req);                                // on utilise la fonction decodeToken
    const userId = tokenInfos[0];                                       // on obtient le UserId du token
    const niveauAcces = tokenInfos[1];                                  // on obtient le niveau d'acces du token
    const publicationId = req.params.id;                                // on récupère l'id de la publication

    if (niveauAcces === 1) {                                                    // si le niveau d'acces est 1 (Modérateur)
        let firstSql = "SELECT image_url FROM publications WHERE id = ?;"
        let secondSql = "DELETE FROM publications WHERE id = ?;";                      // préparation de la requete SQL
        let inserts = [publicationId];                                          // utilisation des valeurs à insérer
        firstSql = mysql.format(firstSql, inserts);                                       // assemblage final de la requête
        secondSql = mysql.format(secondSql, inserts);                                       // assemblage final de la requête
        let role = "Modérateur";

        const publicationImageUrl = bdd.query(firstSql, (error, image) => {               // envoi de la requête a la base de données
            if (!error) {
                if(image[0].image_url !== "") {
                    const filename = image[0].image_url.split("/images/")[1];           // on extrait le nom du fichier à supprimer
                    fs.unlink(`images/${filename}`, () => {                        // on supprime le fichier grâce à fs.unlink
                    });
                }
                const publicationDelete = bdd.query(secondSql, (error, result) => {               // envoi de la requête a la base de données
                    if (!error) {
                        if (result.affectedRows === 0) {
                            res.status(400).json({ message: "Vous n'êtes pas autorisé à supprimer cette publication !" });
                        } else {
                            res.status(200).json({ message: "La publication a été supprimée !" + " (" + role + ")" });
                        }
                    } else {
                        res.status(400).json({ message: "Une erreur est survenue, la publication n'a pas été supprimée" });
                    }
                });
            } else {
                res.status(400).json({ message: "Une erreur est survenue, la publication n'a pas été trouvée" });
            }
        });
    } else {          
        let firstSql = "SELECT image_url FROM publications WHERE id = ?;"
        let secondSql = "DELETE FROM publications WHERE id = ? AND user_id = ?;";                      // préparation de la requete SQL
        let firstInserts = [publicationId];                                          // utilisation des valeurs à insérer
        let secondInserts = [publicationId, userId]; 
        firstSql = mysql.format(firstSql, firstInserts);                                       // assemblage final de la requête
        secondSql = mysql.format(secondSql, secondInserts);                                       // assemblage final de la requête
        let role = "Utilisateur";

        const publicationImageUrl = bdd.query(firstSql, (error, image) => {               // envoi de la requête a la base de données
            if (!error) {
                if(image[0].image_url !== "") {
                    const filename = image[0].image_url.split("/images/")[1];           // on extrait le nom du fichier à supprimer
                    fs.unlink(`images/${filename}`, () => {                        // on supprime le fichier grâce à fs.unlink
                    });
                }
                const publicationDelete = bdd.query(secondSql, (error, result) => {               // envoi de la requête a la base de données
                    if (!error) {
                        if (result.affectedRows === 0) {
                            res.status(400).json({ message: "Vous n'êtes pas autorisé à supprimer cette publication !" });
                        } else {
                            res.status(200).json({ message: "La publication a été supprimée !" + " (" + role + ")" });
                        }
                    } else {
                        res.status(400).json({ message: "Une erreur est survenue, la publication n'a pas été supprimée" });
                    }
                });
            } else {
                res.status(400).json({ message: "Une erreur est survenue, la publication n'a pas été trouvée" });
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
            res.status(400).json({ message: "Une erreur est survenue, le commentaire n'a pas été créé" });
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
                res.status(200).json({ message: "Le commentaire a été supprimé !" + " (" + role + ")" });
            } else {
                res.status(400).json({ message: "Une erreur est survenue, le commentaire n'a pas été supprimé" });
            }
        });
    } else {                                                                    // sinon
        let sql = "DELETE FROM commentaires WHERE id = ? AND user_id = ?";      // préparation de la requete SQL
        let inserts = [commentaireId, userId];                                  // utilisation des valeurs à insérer
        sql = mysql.format(sql, inserts);                                       // assemblage final de la requête
        let role = "Utilisateur";

        const commentaireDelete = bdd.query(sql, (error, result) => {               // envoi de la requête a la base de données
            if (!error) {
                if (result.affectedRows === 0) {
                    res.status(400).json({ message: "Vous n'êtes pas autorisé à supprimer ce commentaire !" });
                } else {
                res.status(200).json({ message: "Le commentaire a été supprimé !" + " (" + role + ")" });
                }
            } else {
                res.status(400).json({ message: "Une erreur est survenue, le commentaire n'a pas été supprimé" });
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
        case 1 : // Vote null sur la publication (No like/ No dislike)
            try {
                let sql = "UPDATE votes SET vote = 1 WHERE publication_id = ? AND user_id = ?";     // préparation de la requete SQL
                let inserts = [publicationId, userId];                                              // utilisation des valeurs à insérer
                sql = mysql.format(sql, inserts);                                                   // assemblage final de la requête

                const voteNullUpdate = bdd.query(sql, (error, result) => {                          // envoi de la requête a la base de données
                    if (error) {
                        res.status(400).json({ error: "La modification de votre vote a échouée ! (null)" });
                    } else {
                        res.status(200).json({ message: "Votre vote a été modifié avec succès ! (null)" });
                    }
                });
            } catch (error) {
                res.status(400).json({ error: "Une erreur est survenue, la modification de votre vote a échouée ! (null)" });
            }
            break;

        case 2 : // Vote like sur la publication
            try {
                if (alreadyVote) {                                                                      // si l'utilisateur a déjà voté sur cette publication
                    let sql = "UPDATE votes SET vote = 2 WHERE publication_id = ? AND user_id = ?";     // préparation de la requete SQL
                    let inserts = [publicationId, userId];                                              // utilisation des valeurs à insérer
                    sql = mysql.format(sql, inserts);                                                   // assemblage final de la requête

                    const voteLikeUpdate = bdd.query(sql, (error, result) => {                              // envoi de la requête a la base de données
                        if (error) {
                            res.status(400).json({ error: "La modification de votre vote a échouée ! (like)" });
                        } else {
                            res.status(200).json({ message: "Votre vote a été modifié avec succès ! (like)" });
                        }
                    });
                } else {
                    let sql = "INSERT INTO votes (publication_id, user_id, vote) VALUES (?, ?, 2)";     // préparation de la requete SQL
                    let inserts = [publicationId, userId];                                              // utilisation des valeurs à insérer
                    sql = mysql.format(sql, inserts);                                                   // assemblage final de la requête

                    const voteLikeUpdate = bdd.query(sql, (error, result) => {                              // envoi de la requête a la base de données
                        if (error) {
                            res.status(400).json({ error: "La modification de votre vote a échouée ! (like)" });
                        } else {
                            res.status(200).json({ message: "Votre vote a été modifié avec succès ! (like)" });
                        }
                    });
                }
            } catch (error) {
                res.status(400).json({ error: "Une erreur est survenue, la modification de votre vote a échouée ! (like)" });
            }
            break;

        case 3 : // Vote dislike sur la publication
            try {
                if (alreadyVote) {                                                                      // si l'utilisateur a déjà voté sur cette publication
                    let sql = "UPDATE votes SET vote = 3 WHERE publication_id = ? AND user_id = ?";     // préparation de la requete SQL
                    let inserts = [publicationId, userId];                                              // utilisation des valeurs à insérer
                    sql = mysql.format(sql, inserts);                                                   // assemblage final de la requête

                    const voteLikeUpdate = bdd.query(sql, (error, result) => {                              // envoi de la requête a la base de données
                        if (error) {
                            res.status(400).json({ error: "La modification de votre vote a échouée ! (dislike)" });
                        } else {
                            res.status(200).json({ message: "Votre vote a été modifié avec succès ! (dislike)" });
                        }
                    });
                } else {
                    let sql = "INSERT INTO votes (publication_id, user_id, vote) VALUES (?, ?, 3)";     // préparation de la requete SQL
                    let inserts = [publicationId, userId];                                              // utilisation des valeurs à insérer
                    sql = mysql.format(sql, inserts);                                                   // assemblage final de la requête

                    const voteLikeUpdate = bdd.query(sql, (error, result) => {                              // envoi de la requête a la base de données
                        if (error) {
                            res.status(400).json({ error: "La modification de votre vote a échouée ! (dislike)" });
                        } else {
                            res.status(200).json({ message: "Votre vote a été modifié avec succès ! (dislike)" });
                        }
                    });
                }
            } catch (error) {
                res.status(400).json({ error: "Une erreur est survenue, la modification de votre vote a échouée ! (dislike)" });
            }
            break;
    }
};