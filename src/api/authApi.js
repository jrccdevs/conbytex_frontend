import clienteApi from './clienteApi';

// 🔐 Login: Envía credenciales y recibe { token }
export const login = async (credentials) => {
  const { data } = await clienteApi.post('/auth/login', credentials);
  return data;
};

// 👤 Obtener Perfil: El interceptor de clienteApi añadirá el token automáticamente
export const getProfile = async () => {
  const { data } = await clienteApi.get('/auth/me-permissions');
  return data;
};

// 🚪 Logout: Limpieza de almacenamiento local
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};