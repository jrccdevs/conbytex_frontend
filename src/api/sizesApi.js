import clienteApi from './clienteApi';

// LISTAR
export const getSizes = async () => {
  const response = await clienteApi.get('/sizes');
  return response.data;
};

// OBTENER POR ID
export const getSizeById = async (id) => {
  const response = await clienteApi.get(`/sizes/${id}`);
  return response.data;
};

// CREAR
export const createSize = async (sizeData, token) => {
  const response = await clienteApi.post('/sizes', sizeData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ACTUALIZAR
export const updateSize = async (id, sizeData, token) => {
  const response = await clienteApi.put(`/sizes/${id}`, sizeData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ELIMINAR
export const deleteSize = async (id, token) => {
  const response = await clienteApi.delete(`/sizes/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
