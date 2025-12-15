import React, { createContext, useState, useEffect, useContext } from 'react';
import clienteApi from '../api/clienteApi'; // Tu cliente Axios configurado
import { useNavigate } from 'react-router-dom';

// Crear contexto de autenticación
const AuthContext = createContext(null);

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null); // Usuario logueado
  const [cargando, setCargando] = useState(true); // Estado de carga inicial
  const navigate = useNavigate();

  // Efecto para verificar autenticación al iniciar la app
  useEffect(() => {
    const verificarAutenticacion = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Llamar al backend para obtener datos reales del usuario
          const response = await clienteApi.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userData = response.data.usuario;
          setUsuario(userData);
          localStorage.setItem('usuarioData', JSON.stringify(userData));
        } catch (error) {
          console.error('Error al verificar token con API:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('usuarioData');
          setUsuario(null);
        }
      }
      setCargando(false);
    };
    verificarAutenticacion();
  }, []);

  // Función para iniciar sesión
  const iniciarSesion = async (email, password) => {
    try {
      const response = await clienteApi.post('/auth/login', { email, password });
      const { token } = response.data;

      // Llamar al backend para obtener usuario completo
      const meResponse = await clienteApi.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = meResponse.data.usuario;

      // Guardar token y datos del usuario
      localStorage.setItem('token', token);
      localStorage.setItem('usuarioData', JSON.stringify(userData));
      setUsuario(userData);

      navigate('/dashboard'); // Redirigir al dashboard
      return true;
    } catch (error) {
      console.error(
        'Error al iniciar sesión:',
        error.response ? error.response.data : error.message
      );
      setUsuario(null);
      throw error; // Permite que el componente de login maneje el error
    }
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioData');
    setUsuario(null);
    navigate('/login'); // Redirigir al login
  };

  // Función para verificar roles dinámicamente
  const tieneRol = (rolesPermitidos) => {
    if (!usuario) return false;
    if (Array.isArray(rolesPermitidos)) {
      return rolesPermitidos.includes(usuario.role); // 'role' viene de la DB
    }
    return usuario.role === rolesPermitidos;
  };

  const valorContexto = {
    usuario,
    cargando,
    iniciarSesion,
    cerrarSesion,
    tieneRol,
  };

  return (
    <AuthContext.Provider value={valorContexto}>
      {cargando ? <div>Cargando sesión...</div> : children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
