import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Stack, IconButton,
  Drawer, Button, Divider 
} from '@mui/material';

import VerifiedUserTwoToneIcon from '@mui/icons-material/VerifiedUserTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddModeratorTwoToneIcon from '@mui/icons-material/AddModeratorTwoTone';
import RefreshIcon from '@mui/icons-material/Refresh';
import Swal from 'sweetalert2';

import { getRoles, createRol, updateRol } from '../../api/rolesApi';
import RolesForm from './RolesForm';

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Configuración de Notificaciones
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#121212',
    color: '#fff'
  });

  const cargarRoles = async () => {
    try {
      setCargando(true);
      const data = await getRoles();
      // Ajustamos según si tu API devuelve el array directo o un objeto { roles: [] }
      setRoles(Array.isArray(data) ? data : (data.roles || []));
    } catch (error) {
      console.error("Error al cargar roles:", error);
      Toast.fire({ icon: 'error', title: 'Error al conectar con la base de datos' });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarRoles();
  }, []);

  const handleOpenDrawer = (rol = null) => {
    setSelectedRole(rol);
    setDrawerOpen(true);
  };

  const handleSaveRole = async (formData) => {
    try {
      if (selectedRole) {
        // ACTUALIZAR ROL
        await updateRol(selectedRole._id || selectedRole.id, formData);
        Toast.fire({ icon: 'success', title: 'Plantilla de Rol actualizada' });
      } else {
        // CREAR ROL
        await createRol(formData);
        Toast.fire({ icon: 'success', title: 'Nueva Plantilla creada con éxito' });
      }
      setDrawerOpen(false);
      cargarRoles(); // Refrescar lista
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Error al procesar la operación';
      Toast.fire({ icon: 'error', title: errorMsg });
    }
  };

  if (cargando) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: 2 }}>
      <CircularProgress sx={{ color: '#10b981' }} />
      <Typography sx={{ color: '#10b981', fontWeight: 800, fontSize: '0.7rem' }}>SINCRONIZANDO_ROLES...</Typography>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      
      {/* HEADER DE LA SECCIÓN */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 6, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1, bgcolor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981' }}>
            <VerifiedUserTwoToneIcon sx={{ color: '#10b981', fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Gestión de Roles
            </Typography>
            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 800 }}>
              SECURITY_LEVEL // PERMISSION_MAPS
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={2}>
          <IconButton onClick={cargarRoles} sx={{ color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0px' }}>
            <RefreshIcon fontSize="small" />
          </IconButton>
          <Button 
            variant="contained" 
            startIcon={<AddModeratorTwoToneIcon />} 
            onClick={() => handleOpenDrawer()} 
            sx={styles.btnCrear}
          >
            NUEVA PLANTILLA
          </Button>
        </Stack>
      </Stack>

      {/* TABLA DE ROLES */}
      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(16, 185, 129, 0.05)' }}>
            <TableRow>
              <TableCell sx={styles.tableHeader}>ID_IDENTIFIER</TableCell>
              <TableCell sx={styles.tableHeader}>NOMBRE_DEL_ROL</TableCell>
              <TableCell sx={styles.tableHeader}>MÓDULOS_HABILITADOS</TableCell>
              <TableCell align="right" sx={styles.tableHeader}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: 'rgba(255,255,255,0.2)', py: 10 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>[ NO_ROLES_FOUND_IN_DATABASE ]</Typography>
                </TableCell>
              </TableRow>
            ) : (
              roles.map((rol) => (
                <TableRow key={rol._id || rol.id} sx={styles.tableRow}>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                    {(rol._id || rol.id).substring(0, 8).toUpperCase()}...
                  </TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, textTransform: 'uppercase' }}>
                    {rol.name}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={styles.chipPermisos}>
                      {Object.keys(rol.permissions || {}).filter(k => rol.permissions[k].view).length} MÓDULOS ACTIVOS
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={() => handleOpenDrawer(rol)} 
                      sx={{ color: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.05)', mr: 1, '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.2)' } }}
                    >
                      <EditTwoToneIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DRAWER LATERAL PARA EL FORMULARIO */}
      <Drawer 
        anchor="right" 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        PaperProps={{ 
          sx: { 
            width: { xs: '100%', sm: 500 }, 
            bgcolor: '#080808', 
            borderLeft: '2px solid #10b981',
            p: 3 
          } 
        }}
      >
        <RolesForm 
          rolEditando={selectedRole}
          onClose={() => setDrawerOpen(false)}
          onSave={handleSaveRole}
        />
      </Drawer>
    </Box>
  );
};

// ESTILOS PERSONALIZADOS (System Style)
const styles = {
  tableContainer: {
    bgcolor: 'rgba(255,255,255,0.01)',
    backgroundImage: 'none',
    borderRadius: '0px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  tableHeader: {
    color: 'rgba(16, 185, 129, 0.8)',
    fontWeight: 900,
    fontSize: '0.7rem',
    letterSpacing: '1px',
    borderBottom: '1px solid #10b981',
  },
  tableRow: {
    '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.02)' },
    transition: '0.2s',
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  },
  btnCrear: {
    bgcolor: '#10b981',
    color: '#000',
    fontWeight: 900,
    borderRadius: '0px',
    px: 4,
    '&:hover': { bgcolor: '#059669', boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)' }
  },
  chipPermisos: {
    bgcolor: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    px: 1.5,
    py: 0.5,
    border: '1px solid rgba(16, 185, 129, 0.2)',
    fontWeight: 800,
    fontSize: '0.65rem'
  }
};

export default RolesList;