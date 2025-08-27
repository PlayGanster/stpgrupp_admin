import axios from 'axios';

const API_BASE_URL = 'https://api.stgrupp.tech/api'; // Замените на ваш API URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцепторы для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const newsAPI = {
  getAll: () => api.get('/news'),
  getById: (id) => api.get(`/news/${id}`),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
};

export const reviewsAPI = {
  getAll: () => api.get('/reviews'),
  getById: (id) => api.get(`/reviews/${id}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const questionsAPI = {
  getAll: () => api.get('/questions'),
  getById: (id) => api.get(`/questions/${id}`),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
};

export const reelsAPI = {
  getAll: () => api.get('/reels'),
  getById: (id) => api.get(`/reels/${id}`),
  create: (data) => api.post('/reels', data),
  update: (id, data) => api.put(`/reels/${id}`, data),
  delete: (id) => api.delete(`/reels/${id}`),
};


export default api;

