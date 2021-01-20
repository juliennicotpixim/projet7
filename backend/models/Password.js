const passwordValidator = require('password-validator');        // importation du paquet password validator

const passwordSchema = new passwordValidator();     // Schéma de mot de passe

passwordSchema
.is().min(8)                                    // Longueur minimun : 8
.has().uppercase()                              // Doit avoir au moins une majuscule
.has().lowercase()                              // Doit avoir au moins une minuscule
.has().digits()                                 // Doit avoir au moins un chiffre
.has().not().spaces()                           // Ne doit pas avoir d'espaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist de certain mot de passe

module.exports = passwordSchema;