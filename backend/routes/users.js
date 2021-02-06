const bouncer = require ("express-bouncer")(500, 900000);     // importation du paquet express-bouncer pour luter contre attaques par force brute
const express = require('express');     // importation du paquet express
const router = express.Router();        // création du router


const usersCtrl = require('../controllers/users')     // importation du controller users

const auth = require('../middleware/auth');      // importation de notre middleware d'authentification
const verifyPassword = require('../middleware/verify-password');        // importation du middleware
const verifyPasswordUpdate = require('../middleware/verify-password-update');        // importation du middleware


router.post('/signup', verifyPassword, usersCtrl.signup);                               // inscription d'un utilisateur

router.post('/login', bouncer.block, usersCtrl.login);                                  // connexion d'un utilisateur

router.get('/:id', auth, usersCtrl.getOneUser);                                         // récupération d'un utilisateur

router.put('/update', auth, verifyPasswordUpdate, usersCtrl.updateOneUser);             // mise à jour d'un utilisateur

router.delete('/:id', auth, usersCtrl.deleteOneUser);                                   // suppresion d'un utilisateur


module.exports = router;        // on export le router du fichier