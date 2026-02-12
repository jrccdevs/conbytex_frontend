import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton, Drawer, useTheme, useMediaQuery, CircularProgress, Slide } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';

const drawerWidth = 240;

function LayoutPrincipal() {
  const { usuario, cargando, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!cargando) {
      if (!usuario && window.location.pathname !== '/login') navigate('/login');
      else if (usuario && window.location.pathname === '/login') navigate('/dashboard');
    }
  }, [usuario, cargando, navigate]);

  if (cargando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#050505' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2, color: 'white' }}>Cargando sistema...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar escritorio: QUITAMOS EL SLIDE */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid rgba(255,255,255,0.1)',
              bgcolor: '#0f172a', // Color oscuro para mantener la estética
              color: 'white'
            }
          }}
        >
          <Sidebar usuario={usuario} onNavigate={(p) => navigate(p)} onLogout={cerrarSesion} drawerWidth={drawerWidth} />
        </Drawer>
      )}

      {/* AppBar móvil */}
      {isMobile && (
        <AppBar position="fixed" sx={{ background: '#0f172a', zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6">CONTROL INDUSTRIAL</Typography>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer móvil: variant temporary es automática aquí */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }} // Mejora rendimiento en móvil
        sx={{ 
          display: { xs: 'block', sm: 'none' },
          [`& .MuiDrawer-paper`]: { width: drawerWidth, background: '#0f172a', color: 'white' } 
        }}
      >
        <Sidebar usuario={usuario} onNavigate={(path) => { navigate(path); setDrawerOpen(false); }} onLogout={cerrarSesion} drawerWidth={drawerWidth} />
      </Drawer>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: isMobile ? '64px' : 0,
          background: '#f4f6f8',
          overflow: 'auto',
          position: 'relative',
          zIndex: 1 // Asegura que esté por encima de cualquier residuo visual
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
export default LayoutPrincipal;
