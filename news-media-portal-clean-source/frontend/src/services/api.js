import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Article APIs
export const articleAPI = {
  getArticles: (params) => api.get('/articles', { params }),
  getArticleById: (id) => api.get(`/articles/${id}`),
  createArticle: (data) => {
    const isFormData = data instanceof FormData;
    return api.post('/articles', data, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {});
  },
  updateArticle: (id, data) => {
    const isFormData = data instanceof FormData;
    return api.put(`/articles/${id}`, data, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {});
  },
  deleteArticle: (id) => api.delete(`/articles/${id}`),
  likeArticle: (id) => api.post(`/articles/${id}/like`),
};

// Category APIs
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

// Comment APIs
export const commentAPI = {
  getComments: (articleId) => api.get(`/comments/article/${articleId}`),
  createComment: (articleId, data) => api.post(`/comments/article/${articleId}`, data),
  updateComment: (id, data) => api.put(`/comments/${id}`, data),
  deleteComment: (id) => api.delete(`/comments/${id}`),
  likeComment: (id) => api.post(`/comments/${id}/like`),
};

// Admin APIs
export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
};

export default api;
