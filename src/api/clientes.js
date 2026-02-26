import clienteApi from './clienteApi';

// 🔹 CLIENTES

export const getClientes = async () => {
  const res = await clienteApi.get('/clientes');
  return res.data;
};

export const getClienteById = async (id) => {
  const res = await clienteApi.get(`/clientes/${id}`);
  return res.data;
};

export const createCliente = async (data, token) => {
  const res = await clienteApi.post('/clientes', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateCliente = async (id, data, token) => {
  const res = await clienteApi.put(`/clientes/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteCliente = async (id, token) => {
  const res = await apiClient.delete(`/clientes/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};