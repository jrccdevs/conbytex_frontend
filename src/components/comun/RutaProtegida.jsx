import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const RutaProtegida = ({ allowedRoles, allowedPermission }) => {
  const { usuario, cargando, tieneRol, tienePermiso } = useAuth();

  // 1. Mientras verifica la sesión, mostramos el spinner de Material UI
  if (cargando) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        bgcolor: '#050505' 
      }}>
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  // 2. Si no hay usuario autenticado, redirigir al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si la ruta requiere un ROL específico y el usuario no lo tiene
  if (allowedRoles && !tieneRol(allowedRoles)) {
    console.warn(`Acceso denegado: Se requiere rol ${allowedRoles}`);
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Si la ruta requiere un PERMISO específico y el usuario no lo tiene
  if (allowedPermission && !tienePermiso(allowedPermission)) {
    console.warn(`Acceso denegado: Falta permiso [${allowedPermission}]`);
    return <Navigate to="/unauthorized" replace />;
  }

  // 5. Si pasa todas las validaciones, renderiza la ruta hija (Outlet)
  return <Outlet />;
};

export default RutaProtegida;