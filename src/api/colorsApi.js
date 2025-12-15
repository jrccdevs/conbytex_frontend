import clienteApi from './clienteApi';

export const getColors = async () => {
  const response = await clienteApi.get('/colors');
  return response.data;
};

export const getColorById = async (id) => {
  const response = await clienteApi.get(`/colors/${id}`);
  return response.data;
};

export const createColor = async (colorData, token) => {
  const response = await clienteApi.post('/colors', colorData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateColor = async (id, colorData, token) => {
  const response = await clienteApi.put(`/colors/${id}`, colorData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteColor = async (id, token) => {
  const response = await clienteApi.delete(`/colors/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
