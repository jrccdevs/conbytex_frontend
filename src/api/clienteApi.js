import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const clienteApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de SOLICITUD: Añade el token
clienteApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de RESPUESTA: Maneja el error 401 globalmente
clienteApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si el servidor dice que no estamos autorizados, limpiamos todo
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      // No redireccionamos aquí para evitar conflictos con el AuthContext
    }
    return Promise.reject(error);
  }
);

export default clienteApi;