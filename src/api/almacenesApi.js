import clienteApi from './clienteApi';

// ALMACENES
export const getAlmacenes = async () => {
  const res = await clienteApi.get('/almacenes');
  return res.data;
};

export const getAlmacenById = async (id) => {
  const res = await clienteApi.get(`/almacenes/${id}`);
  return res.data;
};

export const createAlmacen = async (data, token) => {
  const res = await clienteApi.post('/almacenes', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateAlmacen = async (id, data, token) => {
  const res = await clienteApi.put(`/almacenes/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteAlmacen = async (id, token) => {
  const res = await clienteApi.delete(`/almacenes/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
