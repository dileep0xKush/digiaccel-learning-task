import axios from 'axios';

const apiUrl = (import.meta.env as Record<string, string>).VITE_API_URL || 'http://localhost:3002';

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
