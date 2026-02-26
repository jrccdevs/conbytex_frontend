import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Grid,
  Checkbox, FormControlLabel, FormGroup, Divider,
  CircularProgress, Stack, Card, IconButton,
  Tooltip, Container, Fade
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SecurityIcon from '@mui/icons-material/Security';
import SearchIcon from '@mui/icons-material/Search';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import HubIcon from '@mui/icons-material/Hub';
import Swal from 'sweetalert2';

import { getRoles, createRol, updateRol, getPermissionsList } from '../../api/rolesApi';

const RolForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  // Estados originales (No tocados)
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nombre, setNombre] = useState('');
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
  
  // Estados de UI
  const [busqueda, setBusqueda] = useState('');
  const [expanded, setExpanded] = useState({}); // Se mantiene por compatibilidad de lógica

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const responsePermisos = await getPermissionsList();
      const listaPermisos = Array.isArray(responsePermisos) 
        ? responsePermisos 
        : (responsePermisos.permissions || responsePermisos.data || []);
      
      // Ordenamos alfabéticamente los permisos antes de guardarlos
      const ordenados = [...listaPermisos].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      setPermisosDisponibles(ordenados);

      if (isEdit) {
        const responseRoles = await getRoles();
        const listaRoles = Array.isArray(responseRoles) 
          ? responseRoles 
          : (responseRoles.roles || responseRoles.data || []);

        const rolAEditar = listaRoles.find(r => r.id === parseInt(id));
        
        if (rolAEditar) {
          setNombre(rolAEditar.name || '');
          const dataPermisos = rolAEditar.permission_ids || rolAEditar.permissions || [];
          
          if (Array.isArray(dataPermisos)) {
            const idsLimpios = dataPermisos.map(p => 
              typeof p === 'object' ? p.id : parseInt(p)
            );
            setPermisosSeleccionados(idsLimpios);
          }
        } else {
          Swal.fire('No encontrado', 'El rol solicitado no existe', 'warning');
          navigate('/roles');
        }
      }
    } catch (error) {
      console.error("Error al cargar:", error);
      Swal.fire('Error', 'No se pudo obtener la información del servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermiso = (permisoId) => {
    const idNum = parseInt(permisoId);
    setPermisosSeleccionados(prev => 
      prev.includes(idNum) 
        ? prev.filter(currentId => currentId !== idNum) 
        : [...prev, idNum]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return Swal.fire('Atención', 'El nombre es obligatorio', 'warning');

    try {
      setSaving(true);
      const slug = nombre.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
      const payload = {
        name: nombre,
        slug: slug,
        permission_ids: permisosSeleccionados 
      };

      if (isEdit) {
        await updateRol(id, payload);
        Swal.fire('¡Éxito!', 'Rol actualizado correctamente', 'success');
      } else {
        await createRol(payload);
        Swal.fire('¡Creado!', 'Rol registrado con éxito', 'success');
      }
      navigate('/roles');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Lógica de agrupación (Módulos ordenados de A-Z)
  const gruposOrdenados = Object.keys(
    (permisosDisponibles || []).reduce((acc, permiso) => {
      const grupo = (permiso.slug && permiso.slug.includes('.')) 
        ? permiso.slug.split('.')[0] 
        : 'Otros';
      if (!acc[grupo]) acc[grupo] = [];
      acc[grupo].push(permiso);
      return acc;
    }, {})
  ).sort();

  const permisosAgrupados = (permisosDisponibles || []).reduce((acc, permiso) => {
    const grupo = (permiso.slug && permiso.slug.includes('.')) 
      ? permiso.slug.split('.')[0] 
      : 'Otros';
    if (!acc[grupo]) acc[grupo] = [];
    acc[grupo].push(permiso);
    return acc;
  }, {});

  const handleMarcarTodoModulo = (grupo) => {
    const idsGrupo = permisosAgrupados[grupo].map(p => p.id);
    const todosSeleccionados = idsGrupo.every(id => permisosSeleccionados.includes(id));

    if (todosSeleccionados) {
      setPermisosSeleccionados(prev => prev.filter(id => !idsGrupo.includes(id)));
    } else {
      setPermisosSeleccionados(prev => [...new Set([...prev, ...idsGrupo])]);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', bgcolor: '#f1f5f9' }}>
      <CircularProgress thickness={5} size={50} sx={{ color: '#0f172a' }} />
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#f1f5f9', minHeight: '100vh', pb: 10 }}>
      {/* HEADER DINÁMICO */}
      <Box sx={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', pt: 5, pb: 10 }}>
        <Container maxWidth="xl">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton onClick={() => navigate('/roles')} sx={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <Box>
                <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: -1 }}>
                  {isEdit ? 'EDITAR ROL' : 'NUEVO ROL'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#38bdf8', fontWeight: 700 }}>
                  Configuración de privilegios de sistema
                </Typography>
              </Box>
            </Stack>

            <Paper sx={{ 
              display: 'flex', alignItems: 'center', px: 2, py: 0.5,
              width: { xs: '100%', md: '400px' }, bgcolor: 'rgba(255,255,255,0.1)', 
              borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <SearchIcon sx={{ color: '#38bdf8', mr: 1 }} />
              <TextField
                fullWidth variant="standard"
                placeholder="Buscar permiso..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                InputProps={{ disableUnderline: true, sx: { color: 'white' } }}
              />
            </Paper>

            <Button
              form="rol-form"
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{ 
                bgcolor: '#38bdf8', color: '#0f172a', fontWeight: 900, px: 4, py: 1.5,
                borderRadius: '10px', '&:hover': { bgcolor: '#7dd3fc' }
              }}
            >
              {saving ? 'GUARDANDO...' : 'GUARDAR ROL'}
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -5 }}>
        <form id="rol-form" onSubmit={handleSubmit}>
          {/* INFORMACIÓN PRINCIPAL */}
          <Card sx={{ p: 4, borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', mb: 4, border: '1px solid #e2e8f0' }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="subtitle2" fontWeight={800} color="textSecondary" gutterBottom>
                  IDENTIFICACIÓN DEL PERFIL
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Ej: Administrador de Ventas"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '15px', bgcolor: '#f8fafc' } }}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <Box sx={{ p: 2, bgcolor: '#f1f5f9', borderRadius: '15px', border: '1px dashed #cbd5e1' }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <SecurityIcon sx={{ color: '#64748b', fontSize: 20 }} />
                    <Typography variant="caption" fontWeight={800} color="textSecondary">
                      IDENTIFICADOR (SLUG):
                    </Typography>
                  </Stack>
                  <Typography variant="h6" sx={{ fontFamily: 'monospace', color: '#0ea5e9', fontWeight: 900, mt: 0.5 }}>
                    {nombre.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-') || '...'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>

          {/* MATRIZ DE PERMISOS SIEMPRE ABIERTA */}
          <Grid container spacing={3}>
            {gruposOrdenados.map((grupo) => {
              const filtrados = permisosAgrupados[grupo].filter(p => 
                p.name?.toLowerCase().includes(busqueda.toLowerCase()) || 
                p.slug?.toLowerCase().includes(busqueda.toLowerCase())
              );
              if (filtrados.length === 0) return null;

              const seleccionadosEnGrupo = filtrados.filter(p => permisosSeleccionados.includes(p.id)).length;
              const esTodoSeleccionado = seleccionadosEnGrupo === filtrados.length;

              return (
                <Grid item xs={12} sm={6} lg={4} xl={3} key={grupo}>
                  <Fade in timeout={500}>
                    <Card sx={{ 
                      height: '100%', display: 'flex', flexDirection: 'column',
                      borderRadius: '16px', border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}>
                      <Box sx={{ 
                        p: 2, bgcolor: seleccionadosEnGrupo > 0 ? '#f0f9ff' : '#f8fafc', 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        borderBottom: '1px solid #e2e8f0'
                      }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={900} color="#0f172a">
                            {grupo.toUpperCase()}
                          </Typography>
                          <Typography variant="caption" color="primary" fontWeight={800}>
                            {seleccionadosEnGrupo} seleccionados
                          </Typography>
                        </Box>
                        <Tooltip title="Seleccionar todo el módulo">
                          <IconButton 
                            size="small" 
                            onClick={() => handleMarcarTodoModulo(grupo)}
                            sx={{ color: esTodoSeleccionado ? '#10b981' : '#cbd5e1' }}
                          >
                            <DoneAllIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Box sx={{ p: 1.5, flexGrow: 1 }}>
                        <FormGroup>
                          {filtrados.map((permiso) => {
                            const estaActivo = permisosSeleccionados.includes(permiso.id);
                            return (
                              <Box key={permiso.id} sx={{ 
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                                p: 1, borderRadius: '10px', mb: 0.5,
                                bgcolor: estaActivo ? '#f1f5f9' : 'transparent',
                                transition: '0.2s',
                                '&:hover': { bgcolor: '#f1f5f9' }
                              }}>
                                <FormControlLabel
                                  sx={{ width: '100%', mr: 0 }}
                                  control={
                                    <Checkbox 
                                      checked={estaActivo}
                                      onChange={() => handleTogglePermiso(permiso.id)}
                                      size="small"
                                      sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#0ea5e9' } }}
                                    />
                                  }
                                  label={
                                    <Typography variant="body2" sx={{ 
                                      fontWeight: estaActivo ? 700 : 400,
                                      color: estaActivo ? '#0f172a' : '#64748b',
                                      fontSize: '0.85rem'
                                    }}>
                                      {permiso.name || permiso.slug}
                                    </Typography>
                                  }
                                />
                                {estaActivo && <HubIcon sx={{ fontSize: 14, color: '#0ea5e9' }} />}
                              </Box>
                            );
                          })}
                        </FormGroup>
                      </Box>
                    </Card>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>
        </form>
      </Container>
    </Box>
  );
};

export default RolForm;