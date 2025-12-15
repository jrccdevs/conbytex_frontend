import clienteApi from './clienteApi';

export const getMaterials = async () => {
  const response = await clienteApi.get('/materials');
  return response.data;
};

export const getMaterialById = async (id) => {
  const response = await clienteApi.get(`/materials/${id}`);
  return response.data;
};

export const createMaterial = async (materialData, token) => {
  const response = await clienteApi.post('/materials', materialData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateMaterial = async (id, materialData, token) => {
  const response = await clienteApi.put(`/materials/${id}`, materialData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteMaterial = async (id, token) => {
  const response = await clienteApi.delete(`/materials/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
