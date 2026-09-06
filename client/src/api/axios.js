import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_URL;
const baseURL = rawBaseURL ? rawBaseURL.trim() : 'http://localhost:5003/api';

const API = axios.create({
  baseURL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default API;