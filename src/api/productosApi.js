import clienteApi from './clienteApi';

// PRODUCTOS
export const getProductos = async () => {
  const res = await clienteApi.get('/productos');
  return res.data;
};

export const getProductoById = async (id) => {
  const res = await clienteApi.get(`/productos/${id}`);
  return res.data;
};

export const createProducto = async (data, token) => {
  const res = await clienteApi.post('/productos', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateProducto = async (id, data, token) => {
  const res = await clienteApi.put(`/productos/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteProducto = async (id, token) => {
  const res = await clienteApi.delete(`/productos/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
