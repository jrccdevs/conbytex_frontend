import React from 'react';
import { useState } from 'react';
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Divider, Button, Typography, Avatar, Stack, alpha,Collapse
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone'; // Icono principal
import ArchitectureTwoToneIcon from '@mui/icons-material/ArchitectureTwoTone'; // Icono MP
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone'; // Icono PT

// Iconos
import StorefrontIcon from '@mui/icons-material/Storefront';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import BadgeIcon from '@mui/icons-material/Groups';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import ConstructionIcon from '@mui/icons-material/Construction';
import StraightenIcon from '@mui/icons-material/Straighten';
import ScaleIcon from '@mui/icons-material/Scale';



import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';

import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import PeopleTwoToneIcon from '@mui/icons-material/PeopleTwoTone';
import ShieldTwoToneIcon from '@mui/icons-material/ShieldTwoTone';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';

const Sidebar = ({ drawerWidth = 280 }) => {
  // 💡 AJUSTE CLAVE: Extraemos 'usuario' y lo renombramos a 'user'
  const { usuario: user, cerrarSesion, tienePermiso } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openInventario, setOpenInventario] = useState(false);

  const handleToggleInventario = () => {
    setOpenInventario(!openInventario);
  };
  const colors = {
    sidebarBg: '#0f172a',    // Slate 900
    accent: '#6366f1',       // Indigo 500
    adminAccent: '#00f2fe',  // Cyan Eléctrico
    textMain: '#f8fafc',
    textMuted: '#64748b',
    activeBg: alpha('#6366f1', 0.12),
  };

  const isSelected = (path) => location.pathname === path;
  console.log("Usuario actual:", user?.user); // Accedemos al sub-objeto
  console.log("Permisos del usuario:", user?.user?.permissions);
  console.log("¿Tiene users.view?:", tienePermiso('users.view'));
  return (
    <Box sx={{
      width: drawerWidth,
      bgcolor: colors.sidebarBg,
      color: colors.textMain,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '10px 0 30px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      borderRight: '1px solid rgba(255,255,255,0.05)'
    }}>

      {/* --- BRANDING --- */}
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: '12px',
          background: `linear-gradient(135deg, ${colors.accent}, #4f46e5)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 16px ${alpha(colors.accent, 0.4)}`
        }}>
          <Typography sx={{ fontWeight: 900, color: 'white' }}>CI</Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.5px' }}>
          CONTROL <Box component="span" sx={{ color: colors.accent }}>IND.</Box>
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mx: 3, mb: 2 }} />

      {/* --- LISTA DE NAVEGACIÓN --- */}
      <List sx={{ flexGrow: 1, px: 2, overflowY: 'auto' }}>

        {/* Dashboard */}
        <ListItemButton
          selected={isSelected('/dashboard')}
          onClick={() => navigate('/dashboard')}
          sx={{
            borderRadius: '12px', mb: 1,
            '&.Mui-selected': {
              bgcolor: colors.activeBg,
              borderLeft: `4px solid ${colors.accent}`,
              '& .MuiListItemIcon-root': { color: colors.accent }
            },
            '&:hover': { bgcolor: alpha(colors.accent, 0.05) }
          }}
        >
          <ListItemIcon sx={{ color: colors.textMuted, minWidth: 45 }}>
            <DashboardTwoToneIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }} />
        </ListItemButton>

        {/* SECCIÓN: SEGURIDAD (Se activa con tu slug real 'users.view') */}
        {tienePermiso('users.view') && (
          <>
            <Typography variant="caption" sx={{
              px: 2, py: 2, display: 'block', color: colors.adminAccent,
              fontWeight: 800, fontSize: '0.65rem', letterSpacing: '1.5px', mt: 2
            }}>
              SISTEMA DE SEGURIDAD
            </Typography>

            {/* Gestión de Usuarios */}
            <ListItemButton
              selected={location.pathname.startsWith('/usuarios')}
              onClick={() => navigate('/usuarios')}
              sx={{
                borderRadius: '12px', mb: 1,
                '&.Mui-selected': {
                  bgcolor: alpha(colors.adminAccent, 0.1),
                  borderLeft: `4px solid ${colors.adminAccent}`,
                  '& .MuiListItemIcon-root': { color: colors.adminAccent }
                },
                '&:hover': { bgcolor: alpha(colors.adminAccent, 0.05) }
              }}
            >
              <ListItemIcon sx={{ color: colors.textMuted, minWidth: 45 }}>
                <PeopleTwoToneIcon />
              </ListItemIcon>
              <ListItemText primary="Gestión Usuarios" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }} />
            </ListItemButton>

            {/* Roles y Permisos (Placeholder para siguiente módulo) */}
            {tienePermiso('roles.view') && (
              <ListItemButton
                selected={location.pathname.startsWith('/roles')}
                onClick={() => navigate('/roles')}
                sx={{
                  borderRadius: '12px', mb: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(colors.adminAccent, 0.1),
                    borderLeft: `4px solid ${colors.adminAccent}`,
                    '& .MuiListItemIcon-root': { color: colors.adminAccent }
                  },
                  '&:hover': { bgcolor: alpha(colors.adminAccent, 0.05) }
                }}
              >
                <ListItemIcon sx={{ color: colors.textMuted, minWidth: 45 }}>
                  <ShieldTwoToneIcon />
                </ListItemIcon>
                <ListItemText primary="Roles y Permisos" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }} />
              </ListItemButton>


            )}
           {tienePermiso('inventario.view') && (
  <>
    {/* BOTÓN PADRE: INVENTARIO */}
    <ListItemButton
      onClick={handleToggleInventario}
      sx={{
        borderRadius: '12px',
        mb: 0.5,
        '&:hover': { bgcolor: alpha(colors.adminAccent, 0.05) }
      }}
    >
      <ListItemIcon sx={{ color: colors.textMuted, minWidth: 45 }}>
        <Inventory2TwoToneIcon />
      </ListItemIcon>
      <ListItemText 
        primary="Inventario" 
        primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }} 
      />
      {openInventario ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>

    {/* SUBMENÚ COLAPSABLE */}
    <Collapse in={openInventario} timeout="auto" unmountOnExit>
      <List component="div" disablePadding sx={{ pl: 2 }}> {/* Margen para indentar */}
        
        {/* Sub-item: Materia Prima */}
        <ListItemButton
          selected={location.pathname === '/inventario/materia-prima'}
          onClick={() => navigate('/inventario/materia-prima')}
          sx={{
            borderRadius: '12px',
            mb: 0.5,
            '&.Mui-selected': {
              bgcolor: alpha(colors.adminAccent, 0.1),
              borderLeft: `4px solid ${colors.adminAccent}`,
              '& .MuiListItemIcon-root': { color: colors.adminAccent }
            },
            '&:hover': { bgcolor: alpha(colors.adminAccent, 0.05) }
          }}
        >
          <ListItemIcon sx={{ color: colors.textMuted, minWidth: 40 }}>
            <ArchitectureTwoToneIcon sx={{ fontSize: '1.2rem' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Materia Prima" 
            primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} 
          />
        </ListItemButton>

        {/* Sub-item: Producto Terminado */}
        <ListItemButton
          selected={location.pathname === '/inventario/producto-terminado'}
          onClick={() => navigate('/inventario/producto-terminado')}
          sx={{
            borderRadius: '12px',
            mb: 0.5,
            '&.Mui-selected': {
              bgcolor: alpha(colors.adminAccent, 0.1),
              borderLeft: `4px solid ${colors.adminAccent}`,
              '& .MuiListItemIcon-root': { color: colors.adminAccent }
            },
            '&:hover': { bgcolor: alpha(colors.adminAccent, 0.05) }
          }}
        >
          <ListItemIcon sx={{ color: colors.textMuted, minWidth: 40 }}>
            <CheckCircleTwoToneIcon sx={{ fontSize: '1.2rem' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Producto Terminado" 
            primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} 
          />
        </ListItemButton>

      </List>
    </Collapse>
  </>
)}
              {tienePermiso('movimientos.view') && (
              <ListItemButton
                selected={location.pathname.startsWith('/movimientos')}
                onClick={() => navigate('/movimientos')}
                sx={{
                  borderRadius: '12px', mb: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(colors.adminAccent, 0.1),
                    borderLeft: `4px solid ${colors.adminAccent}`,
                    '& .MuiListItemIcon-root': { color: colors.adminAccent }
                  },
                  '&:hover': { bgcolor: alpha(colors.adminAccent, 0.05) }
                }}
              >
                <ListItemIcon sx={{ color: colors.textMuted, minWidth: 45 }}>
                  <SyncAltIcon  />
                </ListItemIcon>
                <ListItemText primary="Movimientos" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }} />
              </ListItemButton>



            )}
            {/* Roles y Permisos (Placeholder para siguiente módulo) */}
            {tienePermiso('productos.view') && (
              <ListItemButton
                selected={location.pathname.startsWith('/productos')}
                onClick={() => navigate('/productos')}
                sx={{
                  borderRadius: '12px', mb: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(colors.adminAccent, 0.1),
                    borderLeft: `4px solid ${colors.adminAccent}`,
                    '& .MuiListItemIcon-root': { color: colors.adminAccent }
                  },
                  '&:hover': { bgcolor: alpha(colors.adminAccent, 0.05) }
                }}
              >
                <ListItemIcon sx={{ color: colors.textMuted, minWidth: 45 }}>
                  <StorefrontIcon />
                </ListItemIcon>
                <ListItemText primary="Productos" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }} />
              </ListItemButton>


            )}

             {/* EMPLEADOS (Placeholder para siguiente módulo) */}
             {tienePermiso('empleados.view') && (
              <ListItemButton
                selected={location.pathname.startsWith('/empleados')}
                onClick={() => navigate('/empleados')}
                sx={{
                  borderRadius: '12px', mb: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(colors.adminAccent, 0.1),
                    borderLeft: `4px solid ${colors.adminAccent}`,
                    '& .MuiListItemIcon-root': { color: colors.adminAccent }
                  },
                  '&:hover': { bgcolor: alpha(colors.adminAccent, 0.05) }
                }}
              >
                <ListItemIcon sx={{ color: colors.textMuted, minWidth: 45 }}>
                  <BadgeIcon  />
                </ListItemIcon>
                <ListItemText primary="Empleados" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }} />
              </ListItemButton>



            )}
            {tienePermiso('orden.view') && (
              <ListItemButton
                selected={location.pathname.startsWith('/orden')}
                onClick={() => navigate('/orden')}
                sx={{
                  borderRadius: '12px', mb: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(colors.adminAccent, 0.1),
                    borderLeft: `4px solid ${colors.adminAccent}`,
                    '& .MuiListItemIcon-root': { color: colors.adminAccent }
                  },
                  '&:hover': { bgcolor: alpha(colors.adminAccent, 0.05) }
                }}
              >
                <ListItemIcon sx={{ color: colors.textMuted, minWidth: 45 }}>
                  <PrecisionManufacturingIcon />
                </ListItemIcon>
                <ListItemText primary="Ordenes de Produccion" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }} />
              </ListItemButton>
            )}

            {/* RECETAS (Placeholder para siguiente módulo) */}
            {tienePermiso('recetas.view') && (
              <ListItemButton
                selected={location.pathname.startsWith('/recetas')}
                onClick={() => navigate('/recetas')}
                sx={{
                  borderRadius: '12px', mb: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(colors.adminAccent, 0.1),
                    borderLeft: `4px solid ${colors.adminAccent}`,
                    '& .MuiListItemIcon-root': { color: colors.adminAccent }
                  },
                  '&:hover': { bgcolor: alpha(colors.adminAccent, 0.05) }
                }}
              >
                <ListItemIcon sx={{ color: colors.textMuted, minWidth: 45 }}>
                  <MenuBookIcon  />
                </ListItemIcon>
                <ListItemText primary="Recetas de Productos" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }} />
              </ListItemButton>

            )}
            {/* Roles y Permisos (Placeholder para siguiente módulo) */}
            {tienePermiso('color.view') && (
              <ListItemButton
                selected={location.pathname.startsWith('/color')}
                onClick={() => navigate('/color')}
                sx={{
                  borderRadius: '12px', mb: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(colors.adminAccent, 0.1),
                    borderLeft: `4px solid ${colors.adminAccent}`,
                    '& .MuiListItemIcon-root': { color: colors.adminAccent }
                  },
                  '&:hover': { bgcolor: alpha(colors.adminAccent, 0.05) }
                }}
              >
                <ListItemIcon sx={{ color: colors.textMuted, minWidth: 45 }}>
                  <ColorLensIcon />
                </ListItemIcon>
                <ListItemText primary="Colores" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }} />
              </ListItemButton>


            )}
            {tienePermiso('almacen.view') && (
              <ListItemButton
                selected={location.pathname.startsWith('/almacen')}
                onClick={() => navigate('/almacen')}
                sx={{
                  borderRadius: '12px', mb: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(colors.adminAccent, 0.1),
                    borderLeft: `4px solid ${colors.adminAccent}`,
                    '& .MuiListItemIcon-root': { color: colors.adminAccent }
                  },
                  '&:hover': { bgcolor: alpha(colors.adminAccent, 0.05) }
                }}
              >
                <ListItemIcon sx={{ color: colors.textMuted, minWidth: 45 }}>
                  <WarehouseIcon />
                </ListItemIcon>
                <ListItemText primary="Almacenes" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }} />
              </ListItemButton>



            )}
            {tienePermiso('material.view') && (
              <ListItemButton
                selected={location.pathname.startsWith('/material')}
                onClick={() => navigate('/material')}
                sx={{
                  borderRadius: '12px', mb: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(colors.adminAccent, 0.1),
                    borderLeft: `4px solid ${colors.adminAccent}`,
                    '& .MuiListItemIcon-root': { color: colors.adminAccent }
                  },
                  '&:hover': { bgcolor: alpha(colors.adminAccent, 0.05) }
                }}
              >
                <ListItemIcon sx={{ color: colors.textMuted, minWidth: 45 }}>
                  <ConstructionIcon />
                </ListItemIcon>
                <ListItemText primary="Materiales" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }} />
              </ListItemButton>


            )}
            {tienePermiso('size.view') && (
              <ListItemButton
                selected={location.pathname.startsWith('/size')}
                onClick={() => navigate('/size')}
                sx={{
                  borderRadius: '12px', mb: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(colors.adminAccent, 0.1),
                    borderLeft: `4px solid ${colors.adminAccent}`,
                    '& .MuiListItemIcon-root': { color: colors.adminAccent }
                  },
                  '&:hover': { bgcolor: alpha(colors.adminAccent, 0.05) }
                }}
              >
                <ListItemIcon sx={{ color: colors.textMuted, minWidth: 45 }}>
                  <StraightenIcon  />
                </ListItemIcon>
                <ListItemText primary="Tallas" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }} />
              </ListItemButton>


            )}
              {tienePermiso('unidad.view') && (
              <ListItemButton
                selected={location.pathname.startsWith('/unidad')}
                onClick={() => navigate('/unidad')}
                sx={{
                  borderRadius: '12px', mb: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(colors.adminAccent, 0.1),
                    borderLeft: `4px solid ${colors.adminAccent}`,
                    '& .MuiListItemIcon-root': { color: colors.adminAccent }
                  },
                  '&:hover': { bgcolor: alpha(colors.adminAccent, 0.05) }
                }}
              >
                <ListItemIcon sx={{ color: colors.textMuted, minWidth: 45 }}>
                  <ScaleIcon  />
                </ListItemIcon>
                <ListItemText primary="Unidad de Medida" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }} />
              </ListItemButton>


            )}
          </>
        )}

      </List>

      {/* --- FOOTER: PERFIL Y LOGOUT --- */}
      <Box sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar
            sx={{
              width: 42, height: 42,
              bgcolor: alpha(colors.accent, 0.1),
              border: `2px solid ${user?.role_name?.toLowerCase() === 'admin' ? colors.adminAccent : colors.accent}`,
              fontSize: '1rem', fontWeight: 800, color: 'white'
            }}
          >
            {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 800, fontSize: '0.85rem', color: 'white' }}>
              {user?.name || user?.email?.split('@')[0]}
            </Typography>
            <Typography variant="caption" sx={{
              color: user?.role_name?.toLowerCase() === 'admin' ? colors.adminAccent : colors.accent,
              textTransform: 'uppercase', fontWeight: 900, fontSize: '0.6rem', display: 'flex', alignItems: 'center', gap: 0.5
            }}>
              <AdminPanelSettingsTwoToneIcon sx={{ fontSize: 12 }} />
              {user?.role_name || 'Personal'}
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          fullWidth
          startIcon={<LogoutTwoToneIcon />}
          onClick={cerrarSesion}
          sx={{
            bgcolor: alpha('#ef4444', 0.1),
            color: '#f87171',
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            py: 1,
            '&:hover': { bgcolor: alpha('#ef4444', 0.2), boxShadow: 'none' }
          }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;