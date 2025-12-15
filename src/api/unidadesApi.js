import clienteApi from './clienteApi';

export const getUnidades = async () => {
  const response = await clienteApi.get('/unidades');
  return response.data;
};

export const getUnidadById = async (id) => {
  const response = await clienteApi.get(`/unidades/${id}`);
  return response.data;
};

export const createUnidad = async (unidadData, token) => {
  const response = await clienteApi.post('/unidades', unidadData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateUnidad = async (id, unidadData, token) => {
  const response = await clienteApi.put(`/unidades/${id}`, unidadData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteUnidad = async (id, token) => {
  const response = await clienteApi.delete(`/unidades/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
