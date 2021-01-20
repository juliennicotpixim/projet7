const mongoose = require('mongoose');       // importation du paquet mangoose
const uniqueValidator = require('mongoose-unique-validator');       // importation du paquet mongoose-unique-validator


const userSchema = mongoose.Schema({        // fonction Schema à qui on va passer notre Object et qui va dicter les différents champs
  email: { type: String, required: true, unique: true },    
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);     // on applique le validateur au schema pour éviter d'avoir des erreurs illisibles de MongoDB


module.exports = mongoose.model('User', userSchema);      // exportation du model terminé, en passant le nom du model et le schema