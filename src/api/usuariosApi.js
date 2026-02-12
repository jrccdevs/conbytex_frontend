import clienteApi from './clienteApi';

/**
 * 📌 Obtener todos los usuarios
 * Endpoint: GET /users (ajusta si tu backend usa /usuarios)
 */
export const getUsuarios = async () => {
  const { data } = await clienteApi.get('/users');
  return data;
};

/**
 * 📌 Obtener un usuario por ID (Para edición)
 */
export const getUsuarioById = async (id) => {
  const { data } = await clienteApi.get(`/users/${id}`);
  return data;
};

/**
 * 📌 Crear nuevo usuario
 */
export const createUsuario = async (userData) => {
  const { data } = await clienteApi.post('/users', userData);
  return data;
};

/**
 * 📌 Actualizar usuario existente
 */
export const updateUsuario = async (id, userData) => {
  const { data } = await clienteApi.put(`/users/${id}`, userData);
  return data;
};

/**
 * 📌 Eliminar usuario
 */
export const deleteUsuario = async (id) => {
  const { data } = await clienteApi.delete(`/users/${id}`);
  return data;
};