import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginReq, getProfile } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarUsuario = async () => {
      const token = localStorage.getItem('token');
      const usuarioLocal = localStorage.getItem('usuario');

      if (token && usuarioLocal) {
        try {
          setUsuario(JSON.parse(usuarioLocal));
        } catch (e) {
          localStorage.removeItem('usuario');
        }
      }

      if (!token) {
        setCargando(false);
        return;
      }

      try {
        const data = await getProfile();
        // data suele ser { user: {...} } según tu log de consola
        setUsuario(data);
        localStorage.setItem('usuario', JSON.stringify(data));
      } catch (error) {
        console.error("Sesión inválida:", error);
        cerrarSesion();
      } finally {
        setCargando(false);
      }
    };
    cargarUsuario();
  }, []);

  const iniciarSesion = async (email, password) => {
    try {
      const data = await loginReq({ email, password });
      localStorage.setItem('token', data.token);
      
      const userData = await getProfile();
      localStorage.setItem('usuario', JSON.stringify(userData));
      setUsuario(userData);
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    navigate('/login');
  };

  // 🛠️ FUNCIÓN AJUSTADA PARA TU ESTRUCTURA DE DATOS
  const tienePermiso = (slugPermiso) => {
    if (!usuario) return false;

    // Normalizamos: buscamos los datos dentro de usuario.user si existe, si no, usamos usuario
    const u = usuario.user ? usuario.user : usuario;

    // 1. Verificación por Rol Admin
    if (u.roles?.some(r => r.name?.toLowerCase() === 'admin')) return true;
    if (u.role_name?.toLowerCase() === 'admin') return true;

    // 2. Verificación por Slugs en el array de permisos
    // Tu consola mostró que los permisos están en u.permissions
    return u.permissions?.some(p => 
      (typeof p === 'string' ? p === slugPermiso : p.slug === slugPermiso)
    );
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      iniciarSesion, 
      cerrarSesion, 
      tienePermiso, 
      cargando 
    }}>
      {!cargando && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);