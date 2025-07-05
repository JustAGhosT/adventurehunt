import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  createUser: (userData: { name: string; age_group: string; preferences?: any }) =>
    api.post('/users', userData),
  
  getUser: (userId: string) =>
    api.get(`/users/${userId}`),
};

// Hunt API
export const huntApi = {
  createHunt: (huntData: any) =>
    api.post('/hunts', huntData),
  
  getHunt: (huntId: string) =>
    api.get(`/hunts/${huntId}`),
  
  updateHunt: (huntId: string, updates: any) =>
    api.patch(`/hunts/${huntId}`, updates),
  
  deleteHunt: (huntId: string) =>
    api.delete(`/hunts/${huntId}`),
  
  getHuntClues: (huntId: string) =>
    api.get(`/hunts/${huntId}/clues`),
  
  getHuntStatus: (huntId: string) =>
    api.get(`/hunts/${huntId}/status`),
};

// Rating API
export const ratingApi = {
  submitRating: (ratingData: any) =>
    api.post('/ratings', ratingData),
  
  getHuntRatings: (huntId: string) =>
    api.get(`/ratings/hunt/${huntId}`),
};

export default api;