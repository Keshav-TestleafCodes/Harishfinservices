import axios from 'axios';

// In production (Vercel), set VITE_API_URL to your Render backend URL
// e.g. https://finfolio-api.onrender.com
// In local dev, Vite proxy handles /api → localhost:8080
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// Auth
export const login = (username, password) =>
  api.post('/auth/login', { username, password });

export const getMe = () => api.get('/auth/me');

// Projects (public)
export const getProjects = (category) =>
  api.get('/projects', { params: category ? { category } : {} });

export const getProject = (id) => api.get(`/projects/${id}`);

// Build full download URL pointing at backend
export const getDownloadUrl = (fileId) => {
  const base = import.meta.env.VITE_API_URL || '';
  return `${base}/api/files/download/${fileId}`;
};

// Admin
export const createProject = (data) => api.post('/admin/projects', data);
export const updateProject = (id, data) => api.put(`/admin/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/admin/projects/${id}`);

export const uploadFile = (projectId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/admin/projects/${projectId}/files`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteFile = (fileId) => api.delete(`/admin/files/${fileId}`);
