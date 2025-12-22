import React, { useState } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Typography,
  Collapse
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const Sidebar = ({ usuario, onNavigate, onLogout, drawerWidth }) => {
  // Estado para abrir/cerrar el submenú de Inventarios
  const [openInventario, setOpenInventario] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Departamentos', path: '/departamentos', icon: <ApartmentIcon /> },
    { label: 'Empleados', path: '/empleados', icon: <PeopleIcon /> },
    { label: 'Materiales', path: '/materiales', icon: <CategoryIcon /> },
    { label: 'Productos', path: '/productos', icon: <CategoryIcon /> },
    { label: 'Sizes', path: '/sizes', icon: <CategoryIcon /> },
    { label: 'Colores', path: '/colores', icon: <CategoryIcon /> },
    { label: 'Unidades', path: '/unidades', icon: <CategoryIcon /> },
    { label: 'Almacenes', path: '/almacenes', icon: <CategoryIcon /> },
    { label: 'Recetas', path: '/recetas', icon: <CategoryIcon /> },
    { label: 'Ordenes', path: '/ordenes', icon: <CategoryIcon /> },
    { label: 'Movimientos', path: '/movimientos', icon: <CategoryIcon /> },
    {
      label: 'Inventarios',
      icon: <CategoryIcon />,
      children: [
        { label: 'Materia Prima', path: '/inventario/materia-prima' },
        { label: 'Producto Terminado', path: '/inventario/producto-terminado' }
      ]
    }
  ];

  const handleToggleInventario = () => {
    setOpenInventario(!openInventario);
  };

  return (
    <Box
      sx={{
        width: drawerWidth,
        bgcolor: '#203a43',
        color: 'white',
        height: '100%',
        p: 2,
        overflowY: 'auto' // Añadido por si la lista es muy larga
      }}
    >
      <Typography variant="h6" align="center" sx={{ py: 2, fontWeight: 'bold', color: '#00e5ff' }}>
        Menú Principal
      </Typography>
      <Divider sx={{ bgcolor: '#00e5ff' }} />
      
      <List>
        {navItems.map((item) => (
          <React.Fragment key={item.label}>
            {item.children ? (
              // RENDERIZADO CON SUBMENÚ
              <>
                <ListItemButton
                  onClick={handleToggleInventario}
                  sx={{
                    transition: '0.3s',
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': { bgcolor: '#00e5ff22' }
                  }}
                >
                  <ListItemIcon sx={{ color: '#00e5ff' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                  {openInventario ? <ExpandLess sx={{ color: '#00e5ff' }} /> : <ExpandMore sx={{ color: '#00e5ff' }} />}
                </ListItemButton>
                
                <Collapse in={openInventario} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.label}
                        onClick={() => onNavigate(child.path)}
                        sx={{
                          pl: 4,
                          transition: '0.3s',
                          borderRadius: 1,
                          mb: 0.5,
                          '&:hover': { bgcolor: '#00e5ff11' }
                        }}
                      >
                        <ListItemText 
                          primary={child.label} 
                          primaryTypographyProps={{ fontSize: '0.9rem', color: '#00e5ffcc' }} 
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              // RENDERIZADO NORMAL
              <ListItemButton
                onClick={() => onNavigate(item.path)}
                sx={{
                  transition: '0.3s',
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': { bgcolor: '#00e5ff22' }
                }}
              >
                <ListItemIcon sx={{ color: '#00e5ff' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            )}
          </React.Fragment>
        ))}
      </List>

      <Divider sx={{ bgcolor: '#00e5ff', my: 2 }} />
      
      <Box sx={{ mt: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PersonIcon sx={{ mr: 1, color: '#00e5ff' }} />
          <Typography variant="body2" sx={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {usuario ? `${usuario.email} (${usuario.role})` : 'Cargando...'}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          fullWidth
          onClick={onLogout}
          sx={{
            color: '#00e5ff',
            borderColor: '#00e5ff',
            '&:hover': { backgroundColor: '#00e5ff22', borderColor: '#00e5ff' }
          }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;