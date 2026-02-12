import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const PermissionRoute = ({ permission, children }) => {
  const { usuario, cargando, tienePermiso } = useAuth();

  if (cargando) return <p>Cargando...</p>;

  if (!usuario || !tienePermiso(permission)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default PermissionRoute;
