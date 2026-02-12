import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const PrivateRoute = ({ children }) => {
  const { usuario, cargando } = useAuth();

  if (cargando) return <p style={{ color: '#fff', textAlign: 'center', marginTop: '50vh' }}>Cargando...</p>;

  if (!usuario) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
