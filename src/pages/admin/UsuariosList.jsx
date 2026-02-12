import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton, Avatar, 
  Tooltip, InputBase, alpha, Stack 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import SecurityTwoToneIcon from '@mui/icons-material/SecurityTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import Swal from 'sweetalert2';
import { getUsuarios, deleteUsuario } from '../../api/usuariosApi';

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios", error);
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUsuario(id);
          Swal.fire('Eliminado', 'El usuario ha sido borrado.', 'success');
          cargarUsuarios();
        } catch (error) {
          Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
        }
      }
    });
  };

  const usuariosFiltrados = usuarios.filter(u => 
    u.name?.toLowerCase().includes(busqueda.toLowerCase()) || 
    u.email?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Box sx={{ p: 4 }}>
      {/* CABECERA */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Control de Usuarios
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona accesos, roles y permisos directos de tu personal.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<PersonAddIcon />}
          onClick={() => navigate('/usuarios/nuevo')}
          sx={{ 
            bgcolor: '#6366f1', 
            borderRadius: '12px', 
            px: 3, py: 1.5, 
            textTransform: 'none',
            boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' 
          }}
        >
          Nuevo Usuario
        </Button>
      </Box>

      {/* BUSCADOR */}
      <Paper sx={{ 
        p: 2, mb: 3, borderRadius: '16px', display: 'flex', alignItems: 'center', 
        bgcolor: alpha('#6366f1', 0.04), border: '1px solid', borderColor: alpha('#6366f1', 0.1) 
      }}>
        <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
        <InputBase 
          placeholder="Buscar por nombre o correo..." 
          fullWidth 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          sx={{ fontSize: '0.9rem' }}
        />
      </Paper>

      {/* TABLA */}
      <TableContainer component={Paper} sx={{ borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Usuario</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Rol Principal</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">Seguridad Especial</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((u) => {
                // Lógica para detectar el nombre del rol (depende de tu backend)
                const nombreRol = u.role_name || (u.roles && u.roles[0]) || 'Sin Rol';
                const tieneExtras = u.direct_permission_ids && u.direct_permission_ids.length > 0;

                return (
                  <TableRow key={u.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: alpha('#6366f1', 0.1), color: '#6366f1', fontWeight: 700 }}>
                          {u.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{u.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={nombreRol.toUpperCase()} 
                        size="small" 
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: '0.7rem',
                          bgcolor: nombreRol !== 'Sin Rol' ? alpha('#6366f1', 0.1) : '#f1f5f9', 
                          color: nombreRol !== 'Sin Rol' ? '#6366f1' : '#64748b' 
                        }} 
                      />
                    </TableCell>

                    <TableCell>
                      <Chip 
                        label={u.status === 1 ? 'Activo' : 'Inactivo'} 
                        color={u.status === 1 ? 'success' : 'default'}
                        variant="soft"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                        <Tooltip title="Configurar Rol y Permisos Extra">
                          <IconButton onClick={() => navigate(`/usuarios/seguridad/${u.id}`)} sx={{ color: '#8b5cf6' }}>
                            <SecurityTwoToneIcon />
                          </IconButton>
                        </Tooltip>
                        
                        {tieneExtras && (
                          <Tooltip title="Este usuario tiene permisos adicionales asignados manualmente">
                            <VerifiedUserIcon sx={{ color: '#10b981', fontSize: 18 }} />
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      <IconButton onClick={() => navigate(`/usuarios/editar/${u.id}`)} color="primary">
                        <EditTwoToneIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(u.id)} sx={{ color: '#ef4444' }}>
                        <DeleteTwoToneIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Typography color="text.secondary">No se encontraron usuarios</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UsuariosList;