import axios from 'axios';

const API_URL = "https://task-board-backend-deploy.vercel.app/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  },

  register: async (userData) => {
    try {
      console.log('Attempting to register with data:', userData);
      const response = await api.post('/register', userData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      if (error.response?.data?.message) {
        throw error.response.data;
      }
      throw {
        message: error.message === 'Network Error' 
          ? 'Unable to connect to the server. Please check your internet connection.'
          : 'An error occurred during registration'
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

export default api; 