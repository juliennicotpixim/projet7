const passwordSchema = require('../models/Password');        // importation du model Password

module.exports = (req, res, next) => {
    if (!req.body.password && !req.body.newpassword){     // si newpassword et password sont vide
        next();
    } else {         // sinon si newpassword comporte des caractères
        if (!passwordSchema.validate(req.body.newpassword)) {           // si le mot de passe ne valide pas le schema
            res.status(400).json({ error: "Format du nouveau mot de passe incorrect, [Longueur minimun : 8 caractères] [Doit avoir au moins une majuscule] [Doit avoir au moins une minuscule] [Doit avoir au moins un chiffre] [Espaces non acceptés]" });
        } else {
            next();
        }
    }
};