import { useAuth } from '../context/AuthContext';

/**
 * Componente para mostrar/ocultar contenido basado en permisos o roles
 * Uso: <Can permission="users.delete"> <button>Borrar</button> </Can>
 */
export const Can = ({ permission, role, children }) => {
  const { tienePermiso, tieneRol } = useAuth();

  let puedeVer = false;

  if (permission) {
    puedeVer = tienePermiso(permission);
  } else if (role) {
    puedeVer = tieneRol(role);
  }

  return puedeVer ? children : null;
};