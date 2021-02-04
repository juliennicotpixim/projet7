import axios from 'axios'

const commonConfig = {                          // configuration de l'URL générale des requêtes
    baseURL: 'http://localhost:3000/',
}

const notConnectedClient = axios.create({...commonConfig }) // création d'une méthode notConnectedClient avec utilisation de la configuration si dessus
const connectedClient = axios.create({...commonConfig })    // création d'une méthode connectedClient avec utilisation de la configuration si dessus

connectedClient.interceptors.request.use(function(config) {         // utilisation des interceptors axios pour introduire le header d'authentification
    const token = JSON.parse(localStorage.groupomaniaUser).token
    config.headers = { Authorization: `Bearer ${token}` }
    return config;
});

export {
    connectedClient,
    notConnectedClient
}