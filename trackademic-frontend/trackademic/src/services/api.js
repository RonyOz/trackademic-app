import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000', // Cambia esto si usas otra URL
})

export const loginRequest = (document) => {
  return API.post('/login', { document })
}
