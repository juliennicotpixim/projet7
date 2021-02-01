import axios from 'axios'

const commonConfig = {
    baseURL: 'http://localhost:3000/',
}

const notConnectedClient = axios.create({...commonConfig })
const connectedClient = axios.create({...commonConfig })

connectedClient.interceptors.request.use(function(config) {
    const token = localStorage.getItem('jwt')
    config.headers = { Authorization: `Bearer ${token}` }
    return config;
});

export {
    connectedClient,
    notConnectedClient
}