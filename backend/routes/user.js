var bouncer = require ("express-bouncer")(500, 900000);     // importation du paquet express-bouncer pour luter contre attaques par force brute
const express = require('express');     // importation du paquet express
const router = express.Router();        // création du router

const userCtrl = require('../controllers/user')     // importation du controller user

const verifyPassword = require('../middleware/verify-password');        // importation du middleware

router.post('/signup', verifyPassword, userCtrl.signup);
router.post('/login', bouncer.block ,userCtrl.login);

module.exports = router;        // on export le router du fichier