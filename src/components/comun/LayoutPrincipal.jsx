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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Cargando aplicación...</Typography>
      </Box>
    );
  }

  const handleNavigate = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar escritorio */}
      {!isMobile && (
        <Slide direction="right" in={!isMobile} mountOnEnter unmountOnExit>
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: 'border-box'
              }
            }}
          >
            <Sidebar usuario={usuario} onNavigate={handleNavigate} onLogout={cerrarSesion} drawerWidth={drawerWidth} />
          </Drawer>
        </Slide>
      )}

      {/* AppBar móvil */}
      {isMobile && (
        <AppBar position="fixed" sx={{ background: '#203a43' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6">Gestión</Typography>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer móvil */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ [`& .MuiDrawer-paper`]: { width: drawerWidth, background: '#203a43', color: 'white' } }}
      >
        <Sidebar usuario={usuario} onNavigate={handleNavigate} onLogout={cerrarSesion} drawerWidth={drawerWidth} />
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
          overflow: 'auto'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default LayoutPrincipal;
