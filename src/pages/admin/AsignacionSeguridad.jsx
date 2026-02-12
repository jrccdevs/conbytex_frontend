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
  InputAdornment,
  IconButton,
  Collapse,
  Chip,
  Avatar,
  FormControlLabel
} from '@mui/material';

import { useParams, useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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
        setPermisosMaestros(agruparPermisosPorModulo(permisosRes.permissions || []));
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

  // LÓGICA DE MARCAR TODO POR MÓDULO
  const handleToggleTodoModulo = (modulo) => {
    const permisosModulo = permisosMaestros[modulo].map(p => p.id);
    const todosSeleccionados = permisosModulo.every(id => permisosBaseRol.includes(id) || permisosDirectos.includes(id));

    if (todosSeleccionados) {
      // Desmarcar solo los que son directos (los de rol están bloqueados)
      setPermisosDirectos(prev => prev.filter(id => !permisosModulo.includes(id)));
    } else {
      // Marcar todos los que falten y no estén en el rol base
      const nuevosDirectos = permisosModulo.filter(id => !permisosBaseRol.includes(id) && !permisosDirectos.includes(id));
      setPermisosDirectos(prev => [...prev, ...nuevosDirectos]);
    }
  };

  const handleGuardar = async () => {
    if (!rolSeleccionado) return;
    try {
      setSaving(true);
      await assignRolesToUser({ userId: id, role_id: rolSeleccionado.id, permission_ids: permisosDirectos });
      Swal.fire('Configuración Exitosa', 'Acceso actualizado', 'success').then(() => navigate('/usuarios'));
    } catch (error) { Swal.fire('Error', 'No se pudo guardar', 'error'); } 
    finally { setSaving(false); }
  };

  if (loading) return <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', bgcolor: '#020617' }}><CircularProgress color="primary" /></Box>;

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 10 }}>
      {/* HEADER FUTURISTA */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)', 
        color: 'white', pt: 6, pb: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' 
      }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <IconButton onClick={() => navigate('/usuarios')} sx={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <ArrowBackIosNewIcon />
            </IconButton>
            <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: -1 }}>
            
            </Typography>
            <Button
              variant="contained"
              onClick={handleGuardar}
              disabled={!rolSeleccionado || saving}
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{ bgcolor: '#38bdf8', color: '#0f172a', fontWeight: 900, borderRadius: '12px', '&:hover': { bgcolor: '#7dd3fc' } }}
            >
              GUARDAR
            </Button>
          </Stack>

          {/* BUSCADOR FUTURISTA */}
          <Box sx={{ mt: 5, position: 'relative' }}>
            <Paper sx={{ 
              display: 'flex', alignItems: 'center', p: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)'
            }}>
              <SearchIcon sx={{ color: '#38bdf8', ml: 2, mr: 1 }} />
              <TextField
                fullWidth
                variant="standard"
                placeholder="Escaneando base de permisos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                InputProps={{ 
                  disableUnderline: true, 
                  sx: { color: 'white', fontSize: '1.2rem', py: 1 } 
                }}
              />
              
            </Paper>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -6 }}>
        {/* ROLES CENTRADOS CON SWITCHES */}
        <Card sx={{ p: 4, borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', mb: 6 }}>
          <Typography variant="h6" textAlign="center" fontWeight={800} sx={{ mb: 3, color: '#1e293b' }}>
            PERFIL DE AUTORIZACIÓN
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {roles.map((rol) => (
              <Grid item key={rol.id}>
                <Paper variant="outlined" sx={{ 
                  p: 1, pr: 2, borderRadius: '15px', 
                  borderColor: rolSeleccionado?.id === rol.id ? '#38bdf8' : '#e2e8f0',
                  bgcolor: rolSeleccionado?.id === rol.id ? '#f0f9ff' : 'white',
                  transition: '0.3s'
                }}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={rolSeleccionado?.id === rol.id} 
                        onChange={() => handleSeleccionarRol(rol)}
                      />
                    }
                    label={<Typography fontWeight={700} fontSize="0.85rem">{rol.name.toUpperCase()}</Typography>}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Card>

        {/* MATRIZ DE PERMISOS */}
        {rolSeleccionado && (
          <Grid container spacing={3}>
            {Object.keys(permisosMaestros).map((modulo) => {
              const filtrados = permisosMaestros[modulo].filter(p => p.name.toLowerCase().includes(busqueda.toLowerCase()));
              if (filtrados.length === 0) return null;
              
              const isExpanded = expanded[modulo] || busqueda.length > 0;
              const permisosModuloIds = filtrados.map(p => p.id);
              const todosSeleccionados = permisosModuloIds.every(id => permisosBaseRol.includes(id) || permisosDirectos.includes(id));

              return (
                <Grid item xs={12} md={6} key={modulo}>
                  <Card sx={{ borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f8fafc' }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <IconButton size="small" onClick={() => setExpanded(prev => ({ ...prev, [modulo]: !isExpanded }))} sx={{ color: '#1e3a8a' }}>
                          {isExpanded ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                        <Typography variant="subtitle1" fontWeight={900} color="#1e3a8a">{modulo.toUpperCase()}</Typography>
                      </Stack>
                      
                      <Button 
                        size="small" 
                        startIcon={<DoneAllIcon />}
                        onClick={() => handleToggleTodoModulo(modulo)}
                        sx={{ color: todosSeleccionados ? '#059669' : '#64748b', textTransform: 'none', fontWeight: 700 }}
                      >
                        {todosSeleccionados ? 'Completo' : 'Marcar Todo'}
                      </Button>
                    </Box>

                    <Collapse in={isExpanded}>
                      <Divider />
                      <Box sx={{ p: 1 }}>
                        {filtrados.map(p => {
                          const esRol = permisosBaseRol.includes(p.id);
                          const esDirecto = permisosDirectos.includes(p.id);
                          return (
                            <Box key={p.id} sx={{ 
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                              p: 1.5, borderRadius: '12px', mb: 0.5,
                              bgcolor: esRol ? '#f8fafc' : 'transparent',
                              '&:hover': { bgcolor: '#f1f5f9' }
                            }}>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                {esRol ? <LockIcon sx={{ fontSize: 16, color: '#cbd5e1' }} /> : <HubIcon sx={{ fontSize: 16, color: '#38bdf8' }} />}
                                <Typography variant="body2" sx={{ color: esRol ? '#94a3b8' : '#1e293b', fontWeight: esDirecto ? 700 : 400 }}>{p.name}</Typography>
                              </Stack>
                              <Switch
                                size="small"
                                checked={esRol || esDirecto}
                                disabled={esRol}
                                onChange={() => handleTogglePermisoDirecto(p.id)}
                              />
                            </Box>
                          );
                        })}
                      </Box>
                    </Collapse>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default AsignacionSeguridad;