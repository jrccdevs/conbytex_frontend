import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Chip, CircularProgress, Stack 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import Swal from 'sweetalert2';

import { getRoles, deleteRole } from '../../api/rolesApi';
import { useAuth } from '../../context/AuthContext';

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { tienePermiso } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await getRoles();
      
      // 💡 AJUSTE AQUÍ:
      // Si la respuesta es un array, se usa. 
      // Si la respuesta es un objeto que contiene el array, lo extraemos.
      const dataArray = Array.isArray(response) 
        ? response 
        : (response.roles || response.data || []);
        
      setRoles(dataArray);
    } catch (error) {
      console.error("Error al cargar roles:", error);
      Swal.fire('Error', 'No se pudieron cargar los roles', 'error');
      setRoles([]); // Evita que roles sea null
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (name.toLowerCase() === 'admin') {
      return Swal.fire('Acción Protegida', 'El rol de Administrador no puede ser eliminado.', 'warning');
    }

    const result = await Swal.fire({
      title: '¿Eliminar Rol?',
      text: `¿Estás seguro de eliminar el rol "${name}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteRole(id);
        Swal.fire('Eliminado', 'El rol ha sido borrado.', 'success');
        fetchRoles();
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al eliminar el rol.', 'error');
      }
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress sx={{ color: '#6366f1' }} />
    </Box>
  );

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
            Roles del Sistema
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona los niveles de acceso y permisos base para los usuarios.
          </Typography>
        </Box>

        {tienePermiso('roles.create') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/roles/nuevo')}
            sx={{ 
              bgcolor: '#6366f1', 
              borderRadius: '12px', 
              px: 3, py: 1.2,
              boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
            }}
          >
            Nuevo Rol
          </Button>
        )}
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>ROL</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>SLUG</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>PERMISOS ASIGNADOS</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b' }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((rol) => (
              <TableRow key={rol.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>
                    {rol.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={rol.slug} 
                    size="small" 
                    sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 600 }} 
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <SecurityIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {rol.permission_ids?.length || 0} permisos
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  {tienePermiso('roles.edit') && (
                    <IconButton 
                      onClick={() => navigate(`/roles/editar/${rol.id}`)}
                      sx={{ color: '#6366f1', '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)' } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                  {tienePermiso('roles.delete') && (
                    <IconButton 
                      onClick={() => handleDelete(rol.id, rol.name)}
                      sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RolesList;