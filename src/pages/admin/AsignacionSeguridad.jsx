import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Switch,
  Button,
  CircularProgress,
  Card,
  Stack,
  Divider,
  Container,
  TextField,
  IconButton,
  Chip,
  Avatar,
  Fade,
  Tooltip
} from '@mui/material';

import { useParams, useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import HubIcon from '@mui/icons-material/Hub';
import Swal from 'sweetalert2';

import clienteApi from '../../api/clienteApi';
import {
  getRoles,
  getPermissionsList,
  assignRolesToUser
} from '../../api/rolesApi';

const agruparPermisosPorModulo = (permisos) => {
  return permisos.reduce((acc, permiso) => {
    const modulo = permiso.slug.split('.')[0];
    if (!acc[modulo]) acc[modulo] = [];
    acc[modulo].push(permiso);
    return acc;
  }, {});
};

const AsignacionSeguridad = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [permisosMaestros, setPermisosMaestros] = useState({});
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  
  // Mantenemos el estado aunque ya no usemos Collapse para no romper referencias
  const [expanded, setExpanded] = useState({});

  const [permisosBaseRol, setPermisosBaseRol] = useState([]);
  const [permisosDirectos, setPermisosDirectos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const cargarInicial = async () => {
      try {
        const [rolesRes, permisosRes] = await Promise.all([getRoles(), getPermissionsList()]);
        setRoles(rolesRes.roles || []);
        
        // Ordenar módulos alfabéticamente al agrupar
        const agrupados = agruparPermisosPorModulo(permisosRes.permissions || []);
        const ordenados = Object.keys(agrupados).sort().reduce((acc, key) => {
            acc[key] = agrupados[key].sort((a, b) => a.name.localeCompare(b.name));
            return acc;
        }, {});
        
        setPermisosMaestros(ordenados);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    cargarInicial();
  }, []);

  useEffect(() => {
    if (roles.length === 0) return;
    const cargarUsuario = async () => {
      try {
        const res = await clienteApi.get(`/users/${id}`);
        const usuario = res.data;
        if (usuario.role_id) {
          const rol = roles.find(r => r.id === usuario.role_id);
          if (rol) {
            setRolSeleccionado(rol);
            setPermisosBaseRol(rol.permission_ids || []);
          }
        }
        const permisosUsuario = usuario.direct_permission_ids || usuario.permission_ids || [];
        setPermisosDirectos(permisosUsuario);
      } catch (error) { console.error(error); }
    };
    cargarUsuario();
  }, [id, roles]);

  const handleSeleccionarRol = (rol) => {
    setRolSeleccionado(rol);
    setPermisosBaseRol(rol.permission_ids || []);
    setPermisosDirectos(prev => prev.filter(id => !rol.permission_ids.includes(id)));
  };

  const handleTogglePermisoDirecto = (permisoId) => {
    if (permisosBaseRol.includes(permisoId)) return;
    setPermisosDirectos(prev =>
      prev.includes(permisoId) ? prev.filter(id => id !== permisoId) : [...prev, permisoId]
    );
  };

  const handleToggleTodoModulo = (modulo) => {
    const permisosModulo = permisosMaestros[modulo].map(p => p.id);
    const todosSeleccionados = permisosModulo.every(id => permisosBaseRol.includes(id) || permisosDirectos.includes(id));

    if (todosSeleccionados) {
      setPermisosDirectos(prev => prev.filter(id => !permisosModulo.includes(id)));
    } else {
      const nuevosDirectos = permisosModulo.filter(id => !permisosBaseRol.includes(id) && !permisosDirectos.includes(id));
      setPermisosDirectos(prev => [...prev, ...nuevosDirectos]);
    }
  };

  const handleGuardar = async () => {
    if (!rolSeleccionado) return;
    try {
      setSaving(true);
      await assignRolesToUser({ userId: id, role_id: rolSeleccionado.id, permission_ids: permisosDirectos });
      Swal.fire({
        title: 'Configuración Exitosa',
        text: 'Acceso actualizado correctamente',
        icon: 'success',
        confirmButtonColor: '#0ea5e9'
      }).then(() => navigate('/usuarios'));
    } catch (error) { Swal.fire('Error', 'No se pudo guardar', 'error'); } 
    finally { setSaving(false); }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', bgcolor: '#f8fafc' }}>
        <Stack spacing={2} alignItems="center">
            <CircularProgress size={60} thickness={4} sx={{ color: '#0f172a' }} />
            <Typography variant="overline" color="text.secondary">Cargando Bóveda de Seguridad...</Typography>
        </Stack>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#f1f5f9', minHeight: '100vh', pb: 10 }}>
      {/* HEADER TIPO DASHBOARD */}
      <Box sx={{ 
        bgcolor: '#0f172a', 
        color: 'white', pt: 4, pb: 8, 
        borderBottom: '4px solid #0ea5e9'
      }}>
        <Container maxWidth="xl">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton onClick={() => navigate('/usuarios')} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <Box>
                <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon sx={{ color: '#0ea5e9' }} /> GESTIÓN DE ACCESOS
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>ID USUARIO: {id}</Typography>
              </Box>
            </Stack>

            <Paper sx={{ 
              display: 'flex', alignItems: 'center', px: 2, py: 0.5,
              width: { xs: '100%', md: '450px' }, bgcolor: 'rgba(255,255,255,0.05)', 
              borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <SearchIcon sx={{ color: '#0ea5e9', mr: 1 }} />
              <TextField
                fullWidth variant="standard"
                placeholder="Filtrar por nombre de permiso o módulo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                InputProps={{ disableUnderline: true, sx: { color: 'white', fontSize: '0.95rem' } }}
              />
            </Paper>

            <Button
              variant="contained"
              onClick={handleGuardar}
              disabled={!rolSeleccionado || saving}
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{ 
                bgcolor: '#0ea5e9', color: 'white', fontWeight: 800, px: 4, py: 1.5,
                borderRadius: '8px', boxShadow: '0 4px 14px 0 rgba(14, 165, 233, 0.39)',
                '&:hover': { bgcolor: '#0284c7' }
              }}
            >
              GUARDAR CAMBIOS
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -4 }}>
        {/* SELECTOR DE ROL PRINCIPAL */}
        <Card sx={{ p: 3, mb: 4, borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={800} sx={{ mb: 2, textAlign: 'center', textTransform: 'uppercase' }}>
                Selecciona el Perfil Base
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
                {roles.map((rol) => (
                    <Chip
                        key={rol.id}
                        avatar={<Avatar sx={{ bgcolor: rolSeleccionado?.id === rol.id ? '#fff' : '#0ea5e9', color: rolSeleccionado?.id === rol.id ? '#0ea5e9' : '#fff' }}>{rol.name.charAt(0)}</Avatar>}
                        label={rol.name.toUpperCase()}
                        onClick={() => handleSeleccionarRol(rol)}
                        sx={{ 
                            p: 2.5, fontWeight: 800, fontSize: '0.85rem',
                            bgcolor: rolSeleccionado?.id === rol.id ? '#0ea5e9' : '#fff',
                            color: rolSeleccionado?.id === rol.id ? '#fff' : '#475569',
                            border: '1px solid #e2e8f0',
                            transition: 'all 0.3s ease',
                            '&:hover': { bgcolor: rolSeleccionado?.id === rol.id ? '#0284c7' : '#f1f5f9' }
                        }}
                    />
                ))}
            </Stack>
        </Card>

        {/* MATRIZ DE PERMISOS EXPANDIDA POR DEFECTO */}
        {rolSeleccionado && (
          <Grid container spacing={3}>
            {Object.keys(permisosMaestros).map((modulo) => {
              const filtrados = permisosMaestros[modulo].filter(p => 
                p.name.toLowerCase().includes(busqueda.toLowerCase()) || 
                modulo.toLowerCase().includes(busqueda.toLowerCase())
              );
              if (filtrados.length === 0) return null;
              
              const permisosModuloIds = filtrados.map(p => p.id);
              const todosSeleccionados = permisosModuloIds.every(id => permisosBaseRol.includes(id) || permisosDirectos.includes(id));

              return (
                <Grid item xs={12} sm={6} lg={4} xl={3} key={modulo}>
                  <Fade in timeout={600}>
                    <Card sx={{ 
                        height: '100%', display: 'flex', flexDirection: 'column',
                        borderRadius: '16px', border: '1px solid #e2e8f0',
                        overflow: 'hidden', transition: '0.3s',
                        '&:hover': { boxShadow: '0 12px 20px rgba(0,0,0,0.08)' }
                    }}>
                        <Box sx={{ 
                            p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                            bgcolor: todosSeleccionados ? '#f0fdf4' : '#f8fafc',
                            borderBottom: '1px solid #e2e8f0'
                        }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <AdminPanelSettingsIcon sx={{ color: '#64748b' }} />
                                <Typography variant="subtitle2" fontWeight={900} color="#0f172a">
                                    {modulo.toUpperCase()}
                                </Typography>
                            </Stack>
                            
                            <Tooltip title="Marcar todos los de este módulo">
                                <IconButton 
                                    size="small" 
                                    onClick={() => handleToggleTodoModulo(modulo)}
                                    sx={{ color: todosSeleccionados ? '#16a34a' : '#94a3b8' }}
                                >
                                    <DoneAllIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Box sx={{ p: 1.5, flexGrow: 1 }}>
                            {filtrados.map(p => {
                                const esRol = permisosBaseRol.includes(p.id);
                                const esDirecto = permisosDirectos.includes(p.id);
                                const activo = esRol || esDirecto;

                                return (
                                    <Box key={p.id} sx={{ 
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                                        p: 1.2, borderRadius: '10px', mb: 0.5,
                                        bgcolor: activo ? (esRol ? '#f1f5f9' : '#e0f2fe') : 'transparent',
                                        transition: '0.2s'
                                    }}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            {esRol ? (
                                                <Tooltip title="Heredado del Rol (Solo lectura)">
                                                    <LockIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                                </Tooltip>
                                            ) : (
                                                <HubIcon sx={{ fontSize: 16, color: esDirecto ? '#0ea5e9' : '#cbd5e1' }} />
                                            )}
                                            <Typography variant="body2" sx={{ 
                                                color: esRol ? '#64748b' : '#334155', 
                                                fontWeight: activo ? 700 : 400,
                                                fontSize: '0.8rem'
                                            }}>
                                                {p.name}
                                            </Typography>
                                        </Stack>
                                        <Switch
                                            size="small"
                                            checked={activo}
                                            disabled={esRol}
                                            onChange={() => handleTogglePermisoDirecto(p.id)}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#0ea5e9' },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#0ea5e9' }
                                            }}
                                        />
                                    </Box>
                                );
                            })}
                        </Box>
                    </Card>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default AsignacionSeguridad;