// src/components/comun/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ onMenuClick, usuario }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(90deg, #0f2027, #203a43, #2c5364)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2 }}
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Gestión de Empleados
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {usuario && (
            <>
              <Typography variant="body1" sx={{ mr: 1 }}>
                {usuario.email}
              </Typography>
              <Avatar sx={{ bgcolor: '#00e5ff', color: '#0f2027' }}>
                {usuario.name.charAt(0).toUpperCase()}
              </Avatar>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
