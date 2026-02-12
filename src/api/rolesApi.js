import clienteApi from './clienteApi';

/**
 * 📌 Listar todos los roles
 * Acceso: Requiere permiso 'roles.view'
 */
export const getRoles = async () => {
  const { data } = await clienteApi.get('/roles');
  return data;
};

/**
 * 📌 Listar todos los permisos disponibles en la base de datos
 * Acceso: Requiere permiso 'roles.view'
 */
export const getPermissionsList = async () => {
  const { data } = await clienteApi.get('/roles/permissions');
  return data;
};

/**
 * 📌 Crear un nuevo rol
 * Acceso: Solo Admin + 'roles.create'
 * @param {Object} roleData - { name: 'nombre', permissions: [id1, id2] }
 */
export const createRol = async (roleData) => {
  const { data } = await clienteApi.post('/roles', roleData);
  return data;
};

/**
 * 📌 Actualizar un rol (nombre y/o permisos)
 * Acceso: Solo Admin + 'roles.edit'
 * @param {number|string} id - ID del rol
 * @param {Object} roleData - { name: 'nuevo nombre', permissions: [id1, id2] }
 */
export const updateRol = async (id, roleData) => {
  const { data } = await clienteApi.put(`/roles/${id}`, roleData);
  return data;
};

/**
 * 📌 Eliminar un rol
 * Acceso: Solo Admin + 'roles.delete'
 */
export const deleteRole = async (id) => {
  const { data } = await clienteApi.delete(`/roles/${id}`);
  return data;
};

/**
 * 📌 Asignar roles directamente a un usuario específico
 * Acceso: Solo Admin + 'roles.assign_permissions'
 * @param {Object} assignmentData - { userId: id, roles: [id1, id2] }
 */
export const assignRolesToUser = async (data) => {
  // Cambiamos el endpoint para que coincida con la ruta de seguridad del usuario
  const { data: response } = await clienteApi.put(`/users/${data.userId}/security`, {
    role_id: data.role_id,
    permission_ids: data.permission_ids
  });
  return response;
};