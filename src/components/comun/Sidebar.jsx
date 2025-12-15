import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Typography
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CategoryIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

const Sidebar = ({ usuario, onNavigate, onLogout, drawerWidth }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Departamentos', path: '/departamentos', icon: <ApartmentIcon /> },
    { label: 'Empleados', path: '/empleados', icon: <PeopleIcon /> },
    { label: 'Materiales', path: '/materiales', icon: <CategoryIcon /> },
    { label: 'Productos', path: '/productos', icon: <CategoryIcon /> },
    { label: 'Sizes', path: '/sizes', icon: <CategoryIcon /> }, // ← Nuevo
    { label: 'Colores', path: '/colores', icon: <CategoryIcon /> },
    { label: 'Unidades', path: '/unidades', icon: <CategoryIcon /> },
    { label: 'Almacenes', path: '/almacenes', icon: <CategoryIcon /> } ,
    { label: 'Recetas', path: '/recetas', icon: <CategoryIcon /> } 
    
  ];

  return (
    <Box
      sx={{
        width: drawerWidth,
        bgcolor: '#203a43',
        color: 'white',
        height: '100%',
        p: 2
      }}
    >
      <Typography variant="h6" align="center" sx={{ py: 2, fontWeight: 'bold', color: '#00e5ff' }}>
        Menú Principal
      </Typography>
      <Divider sx={{ bgcolor: '#00e5ff' }} />
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
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
        ))}
      </List>
      <Divider sx={{ bgcolor: '#00e5ff', my: 2 }} />
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PersonIcon sx={{ mr: 1, color: '#00e5ff' }} />
          <Typography variant="body2">
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
