import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data)
};

// Products
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getCategories: () => api.get('/products/categories')
};

// Stock
export const stockAPI = {
  stockIn: (data) => api.post('/stock/in', data),
  stockOut: (data) => api.post('/stock/out', data),
  adjust: (data) => api.post('/stock/adjust', data)
};

// Transactions
export const transactionsAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  getOne: (id) => api.get(`/transactions/${id}`)
};

// Analytics
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getStockMovement: (params) => api.get('/analytics/stock-movement', { params }),
  getTopProducts: (params) => api.get('/analytics/top-products', { params }),
  getCategoryBreakdown: () => api.get('/analytics/category-breakdown')
};

// Users (admin)
export const usersAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
};

// Logs (admin)
export const logsAPI = {
  getAll: (params) => api.get('/logs', { params })
};
