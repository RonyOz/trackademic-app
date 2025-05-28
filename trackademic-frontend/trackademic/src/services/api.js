import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000', 
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['Content-Type'] = 'application/json'
  return config
})


export const registerRequest = (data) => {
  return API.post('/auth/register', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const loginRequest = (formData) => {
  const data = new URLSearchParams()
  data.append('username', formData.email)
  data.append('password', formData.password)
  data.append('grant_type', 'password') // obligatorio para FastAPI OAuth2PasswordRequestForm

  return API.post('/auth/login', data)
}




export const getEvaluationPlan = (semester, subjectCode, studentId) => {
  return API.get(`/plans/${semester}/${subjectCode}/${studentId}`)
}
export const getPlansByStudent = (studentId) => {
  return API.get(`/plans/student/${studentId}`)
}


export const createPlan = (planData) => {
  return API.post('/plans/', planData)
}

export const updateActivity = (semester, subjectCode, studentId, activityUpdate) => {
  return API.patch(`/plans/${semester}/${subjectCode}/${studentId}/activities`, activityUpdate)
}
