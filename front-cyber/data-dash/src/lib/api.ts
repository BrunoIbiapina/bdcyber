import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000',
  timeout: 10000,
});

// Interceptors para tratamento de erros
api.interceptors.response.use(
  response => response,
  error => {
    // Pode customizar mensagens de erro aqui
    return Promise.reject(error);
  }
);

export default api;
