CREATE TABLE `users` (                                                      /* Création de la table USERS */
  `id` int PRIMARY KEY AUTO_INCREMENT,                                      /* Clé primaire => User ID */
  `creation_date` TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP),           /* Date de création du user */
  `nom` varchar(30) DEFAULT NULL,                                           /* Nom */
  `prenom` varchar(30) DEFAULT NULL,                                        /* Prénom */
  `email` varchar(60) NOT NULL UNIQUE,                                      /* Email UNIQUE (Pour éviter les doublons) */
  `departement` varchar(30) DEFAULT NULL,                                   /* Département */
  `poste` varchar(30) DEFAULT NULL,                                         /* Poste occupé */
  `mot_de_passe` varchar(100) NOT NULL,                                      /* Mot de passe */
  `niveau_acces` int DEFAULT NULL                                           /* Niveau d'accès, rôle, droit */
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1;     /* Utilisation du moteur de table InnoDB qui permet l'utilisation des clés étrangères */


CREATE TABLE `publications` (                                                                                 /* Création de la table PUBLICATIONS */
  `id` int AUTO_INCREMENT,                                                                                    /* Publication ID */
  `user_id` int NOT NULL,                                                                                     /* User ID créateur de la publication */
  `creation_date` TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP),                                             /* Date de création de la publication */
  `titre` text NOT NULL,                                                                                      /* Titre */
  `description` text NOT NULL,                                                                                /* Description */
  `image_url` text DEFAULT NULL,                                                                              /* URL de l'image */
  PRIMARY KEY (`id`,`user_id`),                                                                               /* Clé primaire composite => Publication ID + User ID */
  CONSTRAINT `fk_publication_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE     /* Clé étrangère sur la colonne "user_id" qui se sert de la table "users" et de la colonne "id" comme référence */
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1;                                       /* Utilisation du moteur de table InnoDB qui permet l'utilisation des clés étrangères */


CREATE TABLE `commentaires` (                                                                                                     /* Création de la table COMMENTAIRES */
  `id` int AUTO_INCREMENT,                                                                                                        /* Commentaire ID */
  `user_id` int NOT NULL,                                                                                                         /* User ID créateur du commentaire */
  `publication_id` int NOT NULL,                                                                                                  /* Publication ID lié au commentaire */
  `creation_date` TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP),                                                                 /* Date de création du commentaire */
  `message` text NOT NULL,                                                                                                        /* Message */
  PRIMARY KEY (`id`, `user_id`, `publication_id`),                                                                                /* Clé primaire composite => Commentaire ID + Publication ID + User ID */
  CONSTRAINT `fk_commentaire_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,                        /* Clé étrangère sur la colonne "user_id" qui se sert de la table "users" et de la colonne "id" comme référence */
  CONSTRAINT `fk_commentaire_publication_id` FOREIGN KEY (`publication_id`) REFERENCES `publications` (`id`) ON DELETE CASCADE    /* Clé étrangère sur la colonne "publication_id" qui se sert de la table "publications" et de la colonne "id" comme référence */
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1;                                                           /* Utilisation du moteur de table InnoDB qui permet l'utilisation des clés étrangères */


CREATE TABLE `votes` (                                                                                                      /* Création de la table VOTES */
  `id` int AUTO_INCREMENT,                                                                                                  /* Vote ID */
  `user_id` int NOT NULL,                                                                                                   /* User ID créateur du vote */
  `publication_id` int NOT NULL,                                                                                            /* Publication ID lié au vote */
  `vote` int DEFAULT NULL,                                                                                                      /* Vote */
  PRIMARY KEY (`id`, `user_id`, `publication_id`),                                                                          /* Clé primaire composite => Vote ID + Publication ID + User ID */
  CONSTRAINT `fk_vote_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,                         /* Clé étrangère sur la colonne "user_id" qui se sert de la table "users" et de la colonne "id" comme référence */
  CONSTRAINT `fk_vote_publication_id` FOREIGN KEY (`publication_id`) REFERENCES `publications` (`id`) ON DELETE CASCADE     /* Clé étrangère sur la colonne "publication_id" qui se sert de la table "publications" et de la colonne "id" comme référence */
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1;                                                     /* Utilisation du moteur de table InnoDB qui permet l'utilisation des clés étrangères */