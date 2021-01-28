import axios from 'axios'

const commonConfig = {
    baseURL: 'http://localhost:3000/',
}

const client = axios.create({...commonConfig })
const rawClient = axios.create({...commonConfig })

client.interceptors.request.use(function(config) {
    const token = localStorage.getItem('jwt')
    config.headers = { Authorization: `Bearer ${token}` }
    return config;
});

export {
    client,
    rawClient
}