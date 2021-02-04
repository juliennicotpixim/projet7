const multer = require('multer');       // importation du paquet multer
const path = require('path');       // importation du paquet node "path" qui donne accès au chemin du système de fichier

const MIME_TYPES = {        // petite bibliothèque des mime types possible
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({                    // fonction de multer qui permet d'enregistrer sur le disque
    destination: (req, file, callback)=> {              // la destination est une fonction qui va expliquer à multer dans quel dossier enregistrer le fichier
        callback(null, 'images')                        // null pour pas d'erreur et le nom du dossier
    },
    filename: (req, file, callback) => {                        // explique à multer quel nom de fichier utiliser
        const name = file.originalname.split(' ').join('_');    // on prend le nom d'origine et on remplace les espace par des '_' pour éviter les bug
        const extension = MIME_TYPES[file.mimetype];            // on récupère le mime type du fichier pour créer l'extension correspondante
        callback(null, name + Date.now() + '.' + extension);    // null pour pas d'erreur, nom du fichier, la date précise pour éviter le doublons, le '.' et l'extension
    }
});

module.exports = multer({ storage: storage,                     // méthode multer a laquelle on passe notre objet Storage et méthode single pour préciser un seul fichier image
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Le format du fichier est invalide'))
        }
        callback(null, true)
    }
}).single('image');