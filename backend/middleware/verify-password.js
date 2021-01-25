const passwordSchema = require('../models/Password');        // importation du model Password

module.exports = (req, res, next) => {        
    console.log(req.body)  
    if (!passwordSchema.validate(req.body.password)) {          // si le mot de passe ne valide pas le schema
        
        res.writeHead(400, '[Longueur minimun : 8] [Doit avoir au moins une majuscule] [Doit avoir au moins une minuscule] [Doit avoir au moins un chiffre] [Espaces non acceptés]', {
            'content-type': 'application/json'
        });
        res.end('Format de mot de passe incorrect');
    } else {
        next();
    }
};