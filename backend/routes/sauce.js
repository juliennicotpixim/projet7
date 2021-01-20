const express = require('express');     // importation du paquet express
const router = express.Router();        // création du router

const sauceCtrl = require('../controllers/sauce');       // importation du controller sauce
const auth = require('../middleware/auth');      // importation de notre middleware d'authentification
const multer = require('../middleware/multer-config');       // importation de notre middleware multer

router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/:id/like', auth, sauceCtrl.modifyVoteSauce);

module.exports = router;        // on export le router du fichier