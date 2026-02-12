import clienteApi from './clienteApi';

// ✅ Obtener todas las recetas
export const getRecetas = async () => {
  const res = await clienteApi.get('/recetas');
  return res.data;
};

// ✅ Obtener recetas por producto terminado
export const getRecetasByProducto = async (id_producto) => {
  const res = await clienteApi.get(`/recetas/producto/${id_producto}`);
  return res.data;
};

// ✅ Crear receta (Ya no pasamos 'token' como argumento)
export const createReceta = async (data) => {
  const res = await clienteApi.post('/recetas', data);
  return res.data;
};

// ✅ Actualizar receta (Ya no pasamos 'token' como argumento)
export const updateReceta = async (id, data) => {
  const res = await clienteApi.put(`/recetas/${id}`, data);
  return res.data;
};

// ✅ Eliminar receta (Ya no pasamos 'token' como argumento)
export const deleteReceta = async (id) => {
  const res = await clienteApi.delete(`/recetas/${id}`);
  return res.data;
};