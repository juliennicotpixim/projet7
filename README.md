# Projet numéro 7 : Créez un réseau social d’entreprise

## Installation de la première version de l'application Groupomania



### Backend

Technos utilisées : **Node.js** / **Express.js** / **MySQL** (service de base de données)

Packages utilisés : **voir backend/packages.json**

__installation__

-   Rendez vous dans le repertoire `backend` via un invite de commande.

-   Exécutez la commande `npm install` afin d'installer les dépendances de l'API.

-   Ouvrez le fichier `(backend/).env` et entrez le host, les identifiants (admin) et le nom de la base de données que vous souhaitez créer.

    Exemple :   SQL_BDD_HOST = localhost
                SQL_BDD_USER = root
                SQL_BDD_PASSWORD = root
                SQL_BDD_NAME = groupomania    

-   Toujours dans ce même fichier `(backend/).env`, entrez une clé secrète qui sera utilisée pour encoder et décoder les tokens d'authenfications, entrez aussi une durée en heure avant l'expiration des tokens d'authentifications.

    Exemple :   JWT_AUTH_SECRET_TOKEN=56E4RH54ER654HEYERLKKJKGKGPME
                JWT_EXPIRATION=24h

-   Exécutez la commande `node bdd_config/bdd_config.js` pour configurer et créer la base de données.

__lancement du serveur__

-   Exécutez la commande `nodemon server` pour lancer le serveur de développement.



### Frontend

Technos utilisées : **Vue.js**

Packages utilisés : **voir frontend/packages.json**

__installation__

-   Rendez vous dans le repertoire `frontend` via un invite de commande.

-   Exécutez la commande `npm install` afin d'installer les dépendances de l'appication.

-   Ouvrez le fichier `(front/).env` et entrez EXACTEMENT la même clé secrète renseignée dans notre fichier `(backend/).env`

    Exemple :   VUE_APP_JWT_AUTH_SECRET_TOKEN=56E4RH54ER654HEYERLKKJKGKGPME

__lancement du serveur__

-   Exécutez la commande `npm run serve` pour lancer le serveur de développement.


### Modération

-   Chaque utilisateur est créé avec le niveau d'accès `0` (utilisateur).

-   La valeur de `niveau_acces` doit être passée a `1` (modérateur).

-   Une reconnexion est nécéssaire pour mettre a jour la session utilisateur avec le nouveau niveau d'acces.



### Veille et vulnérabilités

-   Pour vérifier qu'aucune faille de sécurité lié aux dépendances de notre application n'a été découverte, exécutez la commande `npm audit` à la fois côté `backend` et `frontend`.

-   Si le scan montre une ou plusieurs vulnérabilités, exécutez la commande `npm audit --fix` qui met à jour les dépendances avec de nouveaux patchs de sécurité.



### Annexe

-   Les `annexes` du projet vous permettent d'accéder aux différentes étapes de création du projet.

-   Une `documentation API` a été créée pour faciliter le développement, la compréhension et la maintenance de l'application.