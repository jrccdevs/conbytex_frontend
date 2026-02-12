export const BASE_URL = "http://localhost:4000/api";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext.jsx';
import LayoutPrincipal from './components/comun/LayoutPrincipal';
import RutaProtegida from './components/comun/RutaProtegida'; // Asegúrate que el nombre coincida

// Páginas
import PaginaLogin from './pages/Login';
import PaginaDashboard from './pages/Dashboard';
import SizesList from './pages/sizes/SizesList';
import MaterialesList from './pages/materials/MaterialsList';
import ColorsList from './pages/colors/ColorsList';
import UnidadesList from './pages/unidades/UnidadesList';
import ProductosList from './pages/productos/ProductosList';
import AlmacenesList from './pages/almacenes/AlmacenesList';
import EmpleadosList from './pages/empleados/EmpleadosList';
import RecetasList from './pages/recetas/RecetasList';
import OrdenList from './pages/ordenes/OrdenList';
import OrdenDetail from './pages/ordenes/OrdenDetail';
import OrdenForm from './components/ordenes/OrdenForm';
import MovimientosList from './pages/movimientos/MovimientosList';
import MateriaPrimaPage from './pages/inventario/MateriaPrimaPage';
import ProductoTerminadoPage from './pages/inventario/ProductoTerminadoPage';
import UsuariosList from './pages/admin/UsuariosList';
import RolesList from './pages/roles/RolesList';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" theme="dark" />
        <Routes>
          {/* 1. RUTA PÚBLICA */}
          <Route path="/login" element={<PaginaLogin />} />

          {/* 2. RUTAS PROTEGIDAS GENERALES (Logueados) */}
          <Route element={<RutaProtegida />}>
            <Route element={<LayoutPrincipal />}>
              <Route path="/" element={<PaginaDashboard />} />
              <Route path="/dashboard" element={<PaginaDashboard />} />
              <Route path="ordenes" element={<OrdenList />} />
              <Route path="ordenes/:id" element={<OrdenDetail />} />
              <Route path="movimientos" element={<MovimientosList />} />
              <Route path="/inventario/materia-prima" element={<MateriaPrimaPage />} />
              <Route path="/inventario/producto-terminado" element={<ProductoTerminadoPage />} />
            </Route>
          </Route>

          {/* 3. RUTAS BASADAS EN PERMISOS (Granular) */}
          {/* Ejemplo: Solo quien puede ver usuarios entra aquí */}
          <Route element={<RutaProtegida allowedPermission="users.view" />}>
            <Route element={<LayoutPrincipal />}>
              <Route path="usuarios" element={<UsuariosList />} />
              <Route path="roles" element={<RolesList />} />
            </Route>
          </Route>

          {/* 4. RUTAS EXCLUSIVAS PARA ADMIN (Por Rol) */}
          {/* Usamos 'allowedRoles' para coincidir con el componente que creamos anteriormente */}
          <Route element={<RutaProtegida allowedRoles={['admin']} />}>
            <Route element={<LayoutPrincipal />}>
              <Route path="empleados" element={<EmpleadosList />} />
              <Route path="productos" element={<ProductosList />} />
              <Route path="materiales" element={<MaterialesList />} />
              <Route path="recetas" element={<RecetasList />} />
              <Route path="almacenes" element={<AlmacenesList />} />
              <Route path="unidades" element={<UnidadesList />} />
              <Route path="colores" element={<ColorsList />} />
              <Route path="sizes" element={<SizesList />} />
              <Route path="ordenes/nueva" element={<OrdenForm />} />
              <Route path="ordenes/editar/:id" element={<OrdenForm />} />
            </Route>
          </Route>

          {/* 5. PÁGINA 403 (Opcional) */}
          <Route path="/unauthorized" element={<div className="text-white">No tienes permiso para ver esto.</div>} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;


import React, { useState } from 'react';
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Divider, Button, Typography, Collapse, Avatar, Stack
} from '@mui/material';

// Iconos
import VerifiedUserTwoToneIcon from '@mui/icons-material/VerifiedUserTwoTone'; // Asegúrate de importar este icono
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import ApartmentTwoToneIcon from '@mui/icons-material/ApartmentTwoTone';
import PeopleTwoToneIcon from '@mui/icons-material/PeopleTwoTone';
import CategoryTwoToneIcon from '@mui/icons-material/CategoryTwoTone';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import StraightenTwoToneIcon from '@mui/icons-material/StraightenTwoTone';
import PaletteTwoToneIcon from '@mui/icons-material/PaletteTwoTone';
import ScaleTwoToneIcon from '@mui/icons-material/ScaleTwoTone';
import WarehouseTwoToneIcon from '@mui/icons-material/WarehouseTwoTone';
import ReceiptLongTwoToneIcon from '@mui/icons-material/ReceiptLongTwoTone';
import PrecisionManufacturingTwoToneIcon from '@mui/icons-material/PrecisionManufacturingTwoTone';
import SwapHorizontalCircleTwoToneIcon from '@mui/icons-material/SwapHorizontalCircleTwoTone';
import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ShieldTwoToneIcon from '@mui/icons-material/ShieldTwoTone';

const Sidebar = ({ usuario, onNavigate, onLogout, drawerWidth }) => {
  const [openInventario, setOpenInventario] = useState(false);

  const colors = {
    sidebarBg: '#0f172a',
    itemHover: 'rgba(99, 102, 241, 0.08)',
    accent: '#818cf8',
    textMain: '#f1f5f9',
    textMuted: '#94a3b8',
    adminAccent: '#00f2fe'
  };

  // ✅ Lógica corregida para el nuevo sistema de roles/permisos
  const tienePermiso = (modulo, accion = 'view') => {
    if (!usuario) return false;
    
    // Si el role_name es 'admin' (minúsculas para evitar errores), tiene acceso total
    const esAdmin = usuario.role_name?.toLowerCase() === 'admin';
    if (esAdmin) return true;

    // Si no es admin, buscamos en el objeto de permisos que creamos en el AuthContext
    return usuario.permissions?.[modulo]?.[accion] === true;
  };

  const handleToggleInventario = () => {
    setOpenInventario(!openInventario);
  };

  return (
    <Box
      sx={{
        width: drawerWidth,
        bgcolor: colors.sidebarBg,
        color: colors.textMain,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}
    >
      {/* --- LOGO / BRANDING --- */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: colors.accent, width: 32, height: 32, fontWeight: 'bold' }} variant="rounded">P</Avatar>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px', fontSize: '1.1rem' }}>
          ERP System
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 1 }} />

      {/* --- LISTA DE NAVEGACIÓN --- */}
      <List sx={{
        flexGrow: 1,
        px: 1.5,
        overflowY: 'auto',
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }
      }}>

        {/* Dashboard siempre visible para usuarios logueados */}
        <ListItemButton onClick={() => onNavigate('/dashboard')} sx={{ borderRadius: '10px', mb: 0.5, '&:hover': { bgcolor: colors.itemHover } }}>
          <ListItemIcon sx={{ color: colors.accent, minWidth: 40 }}><DashboardTwoToneIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
        </ListItemButton>

        {tienePermiso('usuarios', 'view') && (
  <>
    <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: colors.adminAccent, fontWeight: 800, fontSize: '0.65rem', letterSpacing: '1px', mt: 1 }}>
      ADMINISTRACIÓN
    </Typography>
    
    {/* Botón Gestión Usuarios */}
    <ListItemButton onClick={() => onNavigate('/usuarios')} sx={{ borderRadius: '10px', mb: 0.5, '&:hover': { bgcolor: 'rgba(0, 242, 254, 0.05)' } }}>
      <ListItemIcon sx={{ color: colors.adminAccent, minWidth: 40 }}><ShieldTwoToneIcon /></ListItemIcon>
      <ListItemText primary="Gestión Usuarios" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
    </ListItemButton>

    {/* Botón Gestión Roles (NUEVO) */}
    <ListItemButton onClick={() => onNavigate('/roles')} sx={{ borderRadius: '10px', mb: 0.5, '&:hover': { bgcolor: 'rgba(0, 242, 254, 0.05)' } }}>
      <ListItemIcon sx={{ color: colors.adminAccent, minWidth: 40 }}><VerifiedUserTwoToneIcon /></ListItemIcon>
      <ListItemText primary="Roles y Permisos" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
    </ListItemButton>

    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', my: 1 }} />
  </>
)}

        <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: colors.textMuted, fontWeight: 800, fontSize: '0.65rem', letterSpacing: '1px' }}>
          OPERACIONES
        </Typography>

        {/* Departamentos */}
        {tienePermiso('departamentos', 'view') && (
          <ListItemButton onClick={() => onNavigate('/departamentos')} sx={{ borderRadius: '10px', mb: 0.5, '&:hover': { bgcolor: colors.itemHover } }}>
            <ListItemIcon sx={{ color: colors.accent, minWidth: 40 }}><ApartmentTwoToneIcon /></ListItemIcon>
            <ListItemText primary="Departamentos" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
          </ListItemButton>
        )}

        {/* Empleados */}
        {tienePermiso('empleados', 'view') && (
          <ListItemButton onClick={() => onNavigate('/empleados')} sx={{ borderRadius: '10px', mb: 0.5, '&:hover': { bgcolor: colors.itemHover } }}>
            <ListItemIcon sx={{ color: colors.accent, minWidth: 40 }}><PeopleTwoToneIcon /></ListItemIcon>
            <ListItemText primary="Empleados" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
          </ListItemButton>
        )}

        {/* Materiales */}
        {tienePermiso('materiales', 'view') && (
          <ListItemButton onClick={() => onNavigate('/materiales')} sx={{ borderRadius: '10px', mb: 0.5, '&:hover': { bgcolor: colors.itemHover } }}>
            <ListItemIcon sx={{ color: colors.accent, minWidth: 40 }}><CategoryTwoToneIcon /></ListItemIcon>
            <ListItemText primary="Materiales" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
          </ListItemButton>
        )}

        {/* Productos y relacionados */}
        {tienePermiso('productos', 'view') && (
          <>
            <ListItemButton onClick={() => onNavigate('/productos')} sx={{ borderRadius: '10px', mb: 0.5, '&:hover': { bgcolor: colors.itemHover } }}>
              <ListItemIcon sx={{ color: colors.accent, minWidth: 40 }}><Inventory2TwoToneIcon /></ListItemIcon>
              <ListItemText primary="Productos" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
            </ListItemButton>

            <ListItemButton onClick={() => onNavigate('/sizes')} sx={{ borderRadius: '10px', mb: 0.5, '&:hover': { bgcolor: colors.itemHover } }}>
              <ListItemIcon sx={{ color: colors.accent, minWidth: 40 }}><StraightenTwoToneIcon /></ListItemIcon>
              <ListItemText primary="Sizes" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
            </ListItemButton>

            <ListItemButton onClick={() => onNavigate('/colores')} sx={{ borderRadius: '10px', mb: 0.5, '&:hover': { bgcolor: colors.itemHover } }}>
              <ListItemIcon sx={{ color: colors.accent, minWidth: 40 }}><PaletteTwoToneIcon /></ListItemIcon>
              <ListItemText primary="Colores" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
            </ListItemButton>

            <ListItemButton onClick={() => onNavigate('/unidades')} sx={{ borderRadius: '10px', mb: 0.5, '&:hover': { bgcolor: colors.itemHover } }}>
              <ListItemIcon sx={{ color: colors.accent, minWidth: 40 }}><ScaleTwoToneIcon /></ListItemIcon>
              <ListItemText primary="Unidades" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
            </ListItemButton>
          </>
        )}

        {/* Almacenes */}
        {tienePermiso('inventario', 'view') && (
          <ListItemButton onClick={() => onNavigate('/almacenes')} sx={{ borderRadius: '10px', mb: 0.5, '&:hover': { bgcolor: colors.itemHover } }}>
            <ListItemIcon sx={{ color: colors.accent, minWidth: 40 }}><WarehouseTwoToneIcon /></ListItemIcon>
            <ListItemText primary="Almacenes" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
          </ListItemButton>
        )}

        {/* Órdenes y Recetas */}
        {tienePermiso('ordenes', 'view') && (
          <>
            <ListItemButton onClick={() => onNavigate('/recetas')} sx={{ borderRadius: '10px', mb: 0.5, '&:hover': { bgcolor: colors.itemHover } }}>
              <ListItemIcon sx={{ color: colors.accent, minWidth: 40 }}><ReceiptLongTwoToneIcon /></ListItemIcon>
              <ListItemText primary="Recetas" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
            </ListItemButton>

            <ListItemButton onClick={() => onNavigate('/ordenes')} sx={{ borderRadius: '10px', mb: 0.5, '&:hover': { bgcolor: colors.itemHover } }}>
              <ListItemIcon sx={{ color: colors.accent, minWidth: 40 }}><PrecisionManufacturingTwoToneIcon /></ListItemIcon>
              <ListItemText primary="Ordenes" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
            </ListItemButton>
          </>
        )}

        {/* Movimientos */}
        {tienePermiso('movimientos', 'view') && (
          <ListItemButton onClick={() => onNavigate('/movimientos')} sx={{ borderRadius: '10px', mb: 0.5, '&:hover': { bgcolor: colors.itemHover } }}>
            <ListItemIcon sx={{ color: colors.accent, minWidth: 40 }}><SwapHorizontalCircleTwoToneIcon /></ListItemIcon>
            <ListItemText primary="Movimientos" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
          </ListItemButton>
        )}

        {/* Submenú: Inventario */}
        {tienePermiso('inventario', 'view') && (
          <>
            <ListItemButton onClick={handleToggleInventario} sx={{ borderRadius: '10px', mb: 0.5, '&:hover': { bgcolor: colors.itemHover } }}>
              <ListItemIcon sx={{ color: colors.accent, minWidth: 40 }}><Inventory2TwoToneIcon /></ListItemIcon>
              <ListItemText primary="Inventarios" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
              {openInventario ? <ExpandLess sx={{ opacity: 0.5 }} /> : <ExpandMore sx={{ opacity: 0.5 }} />}
            </ListItemButton>
            <Collapse in={openInventario} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ mb: 1 }}>
                <ListItemButton onClick={() => onNavigate('/inventario/materia-prima')} sx={{ pl: 6, borderRadius: '10px', mb: 0.2, '&:hover': { bgcolor: colors.itemHover } }}>
                  <ListItemText primary="Materia Prima" primaryTypographyProps={{ fontSize: '0.8rem', color: colors.textMuted }} />
                </ListItemButton>
                <ListItemButton onClick={() => onNavigate('/inventario/producto-terminado')} sx={{ pl: 6, borderRadius: '10px', mb: 0.2, '&:hover': { bgcolor: colors.itemHover } }}>
                  <ListItemText primary="Producto Terminado" primaryTypographyProps={{ fontSize: '0.8rem', color: colors.textMuted }} />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}
      </List>

      {/* --- USER PROFILE / LOGOUT --- */}
      <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)' }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar sx={{ width: 36, height: 36, fontSize: '1rem', bgcolor: 'rgba(255,255,255,0.1)' }}>
            {usuario?.email?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
              {usuario?.email}
            </Typography>
            <Typography variant="caption" sx={{ 
              color: usuario?.role_name?.toLowerCase() === 'admin' ? colors.adminAccent : colors.accent, 
              textTransform: 'uppercase', 
              fontWeight: 800, 
              fontSize: '0.65rem' 
            }}>
              {usuario?.role_name || 'Sin Rol'}
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          startIcon={<LogoutTwoToneIcon />}
          fullWidth
          onClick={onLogout}
          sx={{
            bgcolor: 'rgba(239, 68, 68, 0.1)',
            color: '#f87171',
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            boxShadow: 'none',
            '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.2)', boxShadow: 'none' }
          }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;