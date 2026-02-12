import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ permisoRequerido }) => {
  // 🔄 Cambiamos user -> usuario y loading -> cargando
  const { usuario, cargando, tienePermiso } = useAuth();

  // 1. Mientras verifica el token
  if (cargando) {
    return (
      <Box sx={{ bgcolor: '#050505', height: '100vh', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  // 2. Si no hay usuario logueado (ahora sí detectará a 'usuario')
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si se requiere un permiso específico
  if (permisoRequerido && !tienePermiso(permisoRequerido)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Si todo está bien, renderiza la ruta
  return <Outlet />;
};

export default ProtectedRoute;