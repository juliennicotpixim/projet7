const express = require('express');     // importation du paquet express
const router = express.Router();        // création du router

const publicationsCtrl = require('../controllers/publications');       // importation du controller publications

const auth = require('../middleware/auth');      // importation de notre middleware d'authentification
const multer = require('../middleware/multer-config');       // importation de notre middleware multer


router.post('/', auth, multer, publicationsCtrl.createPublication);                     // Création d'une publication

router.get("/", auth, publicationsCtrl.getAllPublications);                             // Récupération de toutes les publications

router.get("/most-recent", auth, publicationsCtrl.getMostRecentPublications);           // Récupération des publications les plus récentes

router.get("/most-liked", auth, publicationsCtrl.getMostLikedPublications);             // Récupération des publications les plus aimées

router.get("/most-commented", auth, publicationsCtrl.getMostCommentedPublications);     // Récupération des publications les plus commentées

router.get("/user", auth, publicationsCtrl.getOneUserAllPublications);                  // Récupération des publications d'un utilisateur

router.get("/:id", auth, publicationsCtrl.getOnePublication);                           // Récupération d'une publication

router.delete("/:id", auth, publicationsCtrl.deletePublication);                        // Suppresion d'une publication

router.post('/commentaire', auth, publicationsCtrl.commentPublication);                 // Création d'un commentaire

router.delete("/commentaire/:id", auth, publicationsCtrl.deleteComment);                // Suppression d'un commentaire

router.post('/vote', auth, publicationsCtrl.votePublication);                           // Modification d'un vote (like/dislike/null)


module.exports = router;        // on export le router du fichier