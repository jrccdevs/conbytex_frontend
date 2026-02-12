import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Grid,
  Checkbox, FormControlLabel, FormGroup, Divider,
  CircularProgress, Stack, Card, IconButton, InputAdornment,
  Collapse, Tooltip, Container
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SecurityIcon from '@mui/icons-material/Security';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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
  
  // Estados nuevos para UI
  const [busqueda, setBusqueda] = useState('');
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    cargarDatos();
  }, [id]);

  /* ======================================================
     LÓGICA ORIGINAL (INTACTA)
  ====================================================== */
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const responsePermisos = await getPermissionsList();
      const listaPermisos = Array.isArray(responsePermisos) 
        ? responsePermisos 
        : (responsePermisos.permissions || responsePermisos.data || []);
      setPermisosDisponibles(listaPermisos);

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

  // Lógica de agrupación original
  const permisosAgrupados = (permisosDisponibles || []).reduce((acc, permiso) => {
    const grupo = (permiso.slug && permiso.slug.includes('.')) 
      ? permiso.slug.split('.')[0] 
      : 'Otros';
    if (!acc[grupo]) acc[grupo] = [];
    acc[grupo].push(permiso);
    return acc;
  }, {});

  // Funciones UI nuevas (Sin tocar el estado principal)
  const toggleModulo = (modulo) => {
    setExpanded(prev => ({ ...prev, [modulo]: !prev[modulo] }));
  };

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
    <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', bgcolor: '#020617' }}>
      <CircularProgress sx={{ color: '#0ea5e9' }} />
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 10 }}>
      {/* 🚀 HEADER FUTURISTA */}
      <Box sx={{ background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)', color: 'white', pt: 4, pb: 12 }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button 
              onClick={() => navigate('/roles')} 
              startIcon={<ArrowBackIosNewIcon />}
              sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}
            >
              Volver
            </Button>
            <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: 1 }}>
              {isEdit ? 'EDITOR DE ACCESOS' : 'NUEVO PERFIL'}
            </Typography>
            <Button
              form="rol-form"
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{ bgcolor: '#0ea5e9', fontWeight: 900, px: 3, borderRadius: '10px' }}
            >
              {saving ? 'GUARDANDO...' : 'GUARDAR'}
            </Button>
          </Stack>

          {/* 🔍 BUSCADOR ESTILO CRISTAL */}
          <Box sx={{ mt: 5 }}>
            <Paper sx={{ 
              display: 'flex', alignItems: 'center', p: 1, borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <SearchIcon sx={{ color: '#0ea5e9', ml: 2, mr: 1 }} />
              <TextField
                fullWidth
                variant="standard"
                placeholder="Filtrar permisos del sistema..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                InputProps={{ disableUnderline: true, sx: { color: 'white', fontSize: '1.1rem' } }}
              />
            </Paper>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -6 }}>
        <form id="rol-form" onSubmit={handleSubmit}>
          {/* NOMBRE DEL ROL */}
          <Card sx={{ p: 4, borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', mb: 5 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="overline" fontWeight={900} color="primary">Información General</Typography>
                <TextField
                  fullWidth
                  label="Nombre del Rol"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  variant="outlined"
                  sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ bgcolor: '#f1f5f9', p: 2, borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <Typography variant="caption" fontWeight={700} color="textSecondary">SLUG AUTOGENERADO:</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#0ea5e9', fontWeight: 800 }}>
                    {nombre.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>

          {/* MATRIZ DE PERMISOS */}
          <Grid container spacing={3}>
            {Object.keys(permisosAgrupados).map((grupo) => {
              const filtrados = permisosAgrupados[grupo].filter(p => 
                p.name?.toLowerCase().includes(busqueda.toLowerCase()) || 
                p.slug?.toLowerCase().includes(busqueda.toLowerCase())
              );
              if (filtrados.length === 0) return null;

              const isExpanded = expanded[grupo] || busqueda.length > 0;
              const seleccionadosEnGrupo = filtrados.filter(p => permisosSeleccionados.includes(p.id)).length;
              const esTodoSeleccionado = seleccionadosEnGrupo === filtrados.length;

              return (
                <Grid item xs={12} md={6} key={grupo}>
                  <Card sx={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f8fafc' }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <IconButton size="small" onClick={() => toggleModulo(grupo)} sx={{ color: isExpanded ? '#0ea5e9' : '#64748b' }}>
                          {isExpanded ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={900}>{grupo.toUpperCase()}</Typography>
                          <Typography variant="caption" color="primary" fontWeight={700}>{seleccionadosEnGrupo} activos</Typography>
                        </Box>
                      </Stack>
                      <Button 
                        size="small" 
                        startIcon={<DoneAllIcon />}
                        onClick={() => handleMarcarTodoModulo(grupo)}
                        sx={{ fontSize: '0.7rem', fontWeight: 900, color: esTodoSeleccionado ? '#10b981' : '#64748b' }}
                      >
                        {esTodoSeleccionado ? 'REMOVER TODO' : 'TODO'}
                      </Button>
                    </Box>

                    <Collapse in={isExpanded}>
                      <Divider />
                      <Box sx={{ p: 2 }}>
                        <FormGroup>
                          {filtrados.map((permiso) => (
                            <Box key={permiso.id} sx={{ 
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                              p: 1, borderRadius: '8px', mb: 0.5,
                              '&:hover': { bgcolor: '#f1f5f9' }
                            }}>
                              <FormControlLabel
                                control={
                                  <Checkbox 
                                    checked={permisosSeleccionados.includes(permiso.id)}
                                    onChange={() => handleTogglePermiso(permiso.id)}
                                    size="small"
                                  />
                                }
                                label={<Typography variant="body2" fontWeight={permisosSeleccionados.includes(permiso.id) ? 700 : 400}>{permiso.name || permiso.slug}</Typography>}
                              />
                              {permisosSeleccionados.includes(permiso.id) && <HubIcon sx={{ fontSize: 14, color: '#0ea5e9' }} />}
                            </Box>
                          ))}
                        </FormGroup>
                      </Box>
                    </Collapse>
                  </Card>
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