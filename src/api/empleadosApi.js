import clienteApi from './clienteApi';

// EMPLEADOS
export const getEmpleados = async () => {
  const res = await clienteApi.get('/empleados');
  return res.data;
};

export const getEmpleadoById = async (id) => {
  const res = await clienteApi.get(`/empleados/${id}`);
  return res.data;
};

export const createEmpleado = async (data, token) => {
  const res = await clienteApi.post('/empleados', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateEmpleado = async (id, data, token) => {
  const res = await clienteApi.put(`/empleados/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteEmpleado = async (id, token) => {
  const res = await clienteApi.delete(`/empleados/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
