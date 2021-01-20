DROP TABLE IF EXISTS `users`;                                               /* Suppresion de la table USERS si existente */

CREATE TABLE `users` (                                                      /* Création de la table USERS */
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nom` varchar(30) COLLATE utf8_bin NOT NULL,
  `prenom` varchar(30) COLLATE utf8_bin NOT NULL,
  `email` varchar(60) COLLATE utf8_bin NOT NULL UNIQUE,
  `departement` varchar(30) COLLATE utf8_bin DEFAULT NULL,
  `poste` varchar(30) COLLATE utf8_bin DEFAULT NULL,
  `mot_de_passe` varchar(30) COLLATE utf8_bin NOT NULL,
  `niveau_acces` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1;



DROP TABLE IF EXISTS `publications`;                                        /* Suppresion de la table PUBLICATIONS si existente */

CREATE TABLE `publications` (                                               /* Création de la table PUBLICATIONS */
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `us_id` int NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `titre` text COLLATE utf8_bin NOT NULL,
  `description` text COLLATE utf8_bin NOT NULL,
  `image_url` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;



DROP TABLE IF EXISTS `commentaires`;                                        /* Suppresion de la table COMMENTAIRES si existente */

CREATE TABLE `commentaires` (                                               /* Création de la table COMMENTAIRES */
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `us_id` int NOT NULL,
  `pu_id` int NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `message` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;



DROP TABLE IF EXISTS `votes`;                                        /* Suppresion de la table VOTES si existente */

CREATE TABLE `votes` (                                               /* Création de la table VOTES */
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `us_id` int NOT NULL,
  `pu_id` int NOT NULL,
  `vote` int NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;