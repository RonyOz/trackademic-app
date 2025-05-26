import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000', 
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export const loginRequest = (formData) => {
  const data = new URLSearchParams()
  data.append('username', formData.email)
  data.append('password', formData.password)
  data.append('grant_type', 'password') // obligatorio para FastAPI OAuth2PasswordRequestForm

  return API.post('/auth/login', data)
}

export const registerRequest = (data) => {
  return API.post('/auth/register', data)
}


export const getEvaluationPlan = (semester, subjectCode, studentId) => {
  return API.get(`/plans/${semester}/${subjectCode}/${studentId}`)
}

export const createPlan = (planData) => {
  return API.post('/plans/', planData)
}