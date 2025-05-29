//src/services/api.js

import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000', 
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Solo establecer 'Content-Type: application/json' si no es /auth/login
  if (config.url !== '/auth/login') {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})


export const loginRequest = (formData) => {
  const data = new URLSearchParams();
  data.append("username", formData.email); 
  data.append("password", formData.password);
  data.append("grant_type", "password");

  return API.post("/auth/login", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};


export const registerRequest = (data) => {
  return API.post('/auth/register', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getEstimatedGrades = (student_id, subject_code, semester) => {
  return API.get('/plans/estimate-grade', {
    params: {
      student_id,
      subject_code,
      semester,
    },
  });
};

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

export const getGradeConsolidation = (studentId, semester) => {
  return API.get(`/reports/grades-consolidation/${studentId}/${semester}`)
}

export const getPercentageReport = (semester) => {
  return API.get(`/reports/percentages/${semester}`)
}

export const getCommentsReport = (studentId) => {
  return API.get(`/reports/comments/${studentId}`)
}

export const getAllPlans = () => {
  return API.get('/plans/')
}

export const addCommentToPlan = (planId, comment) => {
  return API.post(`/plans/${planId}/comments`, comment)
}

