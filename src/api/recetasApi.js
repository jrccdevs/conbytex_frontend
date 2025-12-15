import clienteApi from './clienteApi';

// Obtener todas las recetas (solo productos terminados)
export const getRecetas = async () => {
  const res = await clienteApi.get('/recetas');
  return res.data;
};

// Obtener recetas por producto terminado (para ver las materias primas)
export const getRecetasByProducto = async (id_producto) => {
  const res = await clienteApi.get(`/recetas/producto/${id_producto}`);
  return res.data;
};

// Crear receta (una materia prima)
export const createReceta = async (data, token) => {
  const res = await clienteApi.post('/recetas', data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

// Actualizar receta (¡NUEVA FUNCIÓN!)
export const updateReceta = async (id, data, token) => {
  const res = await clienteApi.put(`/recetas/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

// Eliminar receta
export const deleteReceta = async (id, token) => {
  const res = await clienteApi.delete(`/recetas/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};