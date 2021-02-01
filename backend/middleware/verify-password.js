const passwordSchema = require('../models/Password');        // importation du model Password

module.exports = (req, res, next) => {        
    if (!passwordSchema.validate(req.body.password)) {          // si le mot de passe ne valide pas le schema
        res.status(400).json({ error: "Format de mot de passe incorrect, [Longueur minimun : 8 caractères] [Doit avoir au moins une majuscule] [Doit avoir au moins une minuscule] [Doit avoir au moins un chiffre] [Espaces non acceptés]" });
    } else {
        next();
    }
};