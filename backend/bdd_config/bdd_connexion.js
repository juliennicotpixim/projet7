const mysql = require('mysql');       // importation du paquet mysql

const bdd = mysql.createPool({                // création d'une pool de connexion à la base de données             
    connectionLimit: 30,                      // nombre maximum de création de connexion avec la base de données
    host     : process.env.SQL_BDD_HOST,
    user     : process.env.SQL_BDD_USER,
    password : process.env.SQL_BDD_PASSWORD,
    database : process.env.SQL_BDD_NAME
});

bdd.query('SELECT 1 + 1 AS solution', function (error, results, fields) {     // Test de la connexion avec la base de données
  if (error) {
    return console.error('error: ' + error.message);                          // Erreur de connexion
  }
  console.log("Connexion à la base de données MySQL validée !");              // Connexion validée
});

module.exports = bdd;