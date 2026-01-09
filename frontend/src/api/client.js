import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Jobs API
export const jobsApi = {
  getAll: () => apiClient.get('/api/jobs'),
  getById: (id) => apiClient.get(`/api/jobs/${id}`),
  create: (data) => apiClient.post('/api/jobs', data),
  delete: (id) => apiClient.delete(`/api/jobs/${id}`),
}

// Candidates API
export const candidatesApi = {
  create: (data) => apiClient.post('/api/candidates', data),
  getByJobId: (jobId, params = {}) =>
    apiClient.get(`/api/candidates/job/${jobId}`, { params }),
  getById: (id) => apiClient.get(`/api/candidates/${id}`),
  update: (id, data) => apiClient.patch(`/api/candidates/${id}`, data),
  delete: (id) => apiClient.delete(`/api/candidates/${id}`),
}

// Analysis API
export const analysisApi = {
  analyzeSingle: (candidateId) =>
    apiClient.post('/api/analysis/analyze', { candidate_id: candidateId }),
  batchAnalyze: (jobId) =>
    apiClient.post(`/api/analysis/batch-analyze/${jobId}`),
}

export default apiClient
