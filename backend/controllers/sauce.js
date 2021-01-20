const Sauce = require('../models/Sauce');       // importation du model Sauce
const fs = require('fs');       // importation du paquet node js (gestion des fichiers système)

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)      // on analyse la chaine de caractère de la requête que l'on transform en objet
    delete sauceObject._id;                             //Suppression de l'id venant du frontend
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,        // on créé une chaine complexe qui prend le protocol, le host du serveur, le dossier images et le nom du fichier
    });
    console.log(sauce);
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?                                                      // si on trouve un nouveau fichier
    {
        ...JSON.parse(req.body.sauce),                                                  // on récupère la chaine de caractère et on la parse en objet
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`    // on créé une chaine complexe qui prend le protocol, le host du serveur, le dossier images et le nom du fichier
    } : { ...req.body };                                                                // sinon on prend simplement de corps de la requête
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })     // on met à jour la sauce avec l'objet
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })                                               // on trouve l'objet dans la base de donnée
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];                       // on extrait le nom du fichier à supprimer
            fs.unlink(`images/${filename}`, () => {                                     // on le supprime grâce à fs.unlink
                Sauce.deleteOne({ _id: req.params.id })                                 // quand on a supprimer l'image, on supprime l'objet dans la base
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })                   // on trouve l'objet dans la base de donnée
        .then(sauce => res.status(200).json(sauce))         // on renvoi l'objet au format json
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()                                            // on trouve les objets dans la base de donnée
        .then(sauce => res.status(200).json(sauce))         // on renvoi les objets au format json
        .catch(error => res.status(400).json({ error }));
};

exports.modifyVoteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })           // on récupère les informations de la sauce
    .then(sauce => {
        
        switch (req.body.like) {                // selon la valeur recue pour 'like' dans la requête
            
            case -1:                                                // si l'utilisateur dislike la sauce
                Sauce.updateOne({ _id: req.params.id }, {           // on met à jour la sauce
                    $inc: {dislikes:1},                             // incrémentation +1 dislike
                    $push: {usersDisliked: req.body.userId},        // on ajoute le userId dans le tableau des utilisateurs qui dislike la sauce
                    _id: req.params.id
                })
                    .then(() => res.status(201).json({ message: 'Dislike ajouté !'}))
                    .catch( error => res.status(400).json({ error }))
                break;
                
            case 0:                                                                 // si l'utilisateur enlève son like ou son dislike
                if (sauce.usersLiked.find(user => user === req.body.userId)) {      // si l'utilisateur est trouvé dans le tableau des like
                    Sauce.updateOne({ _id : req.params.id }, {                      // on met à jour la sauce
                        $inc: {likes:-1},                                           // incrémentation -1 like
                        $pull: {usersLiked: req.body.userId},                       // on retire le userId dans le tableau des utilisateurs qui like la sauce
                        _id: req.params.id
                    })
                        .then(() => res.status(201).json({message: 'Like retiré !'}))
                        .catch( error => res.status(400).json({ error }))
                }
                if (sauce.usersDisliked.find(user => user === req.body.userId)) {   // si l'utilisateur est trouvé dans le tableau des dislike
                    Sauce.updateOne({ _id : req.params.id }, {                      // on met à jour la sauce
                        $inc: {dislikes:-1},                                        // incrémentation -1 dislike
                        $pull: {usersDisliked: req.body.userId},                    // on retire le userId dans le tableau des utilisateurs qui dislike la sauce
                        _id: req.params.id
                    })
                        .then(() => res.status(201).json({message: 'Dislike retiré !'}))
                        .catch( error => res.status(400).json({ error }));
                }
                break;
            
            case 1:                                                                 // si l'utilisateur dislike la sauce
                Sauce.updateOne({ _id: req.params.id }, {                           // on met à jour la sauce
                    $inc: { likes:1},                                               // incrémentation +1 like
                    $push: { usersLiked: req.body.userId},                          // on ajoute le userId dans le tableau des utilisateurs qui like la sauce
                    _id: req.params.id
                })
                    .then(() => res.status(201).json({ message: 'Like ajouté !'}))
                    .catch( error => res.status(400).json({ error }));
                break;

            default:                                                                // si aucun des cas précédent n'est trouvé
                return res.status(500).json({ error });
        }
    })
    .catch(error => res.status(500).json({ error }))
};