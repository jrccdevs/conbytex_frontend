import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, Button, Switch, 
  FormControlLabel, Divider, CircularProgress, Stack, 
  IconButton, Avatar, InputAdornment, Container, Fade
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import Swal from 'sweetalert2';

import { createUsuario, getUsuarios, updateUsuario } from '../../api/usuariosApi';

const UsuarioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // 1. Estado Unificado (Lógica Intacta)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    status: 1
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      obtenerDatosUsuario();
    }
  }, [id]);

  const obtenerDatosUsuario = async () => {
    try {
      setLoading(true);
      const response = await getUsuarios(); 
      const listaUsuarios = Array.isArray(response) 
        ? response 
        : (response.usuarios || response.data || []);

      const usuarioAEditar = listaUsuarios.find(u => u.id === parseInt(id));

      if (usuarioAEditar) {
        setFormData({
          name: usuarioAEditar.name || '',
          email: usuarioAEditar.email || '',
          status: usuarioAEditar.status,
          password: '' 
        });
      } else {
        Swal.fire('No encontrado', 'El usuario no existe', 'warning');
        navigate('/usuarios');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudieron cargar los datos del usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      if (isEdit && !dataToSend.password) {
        delete dataToSend.password;
      }
  
      if (isEdit) {
        console.log("Enviando actualización para ID:", id, dataToSend);
        await updateUsuario(id, dataToSend);
        Swal.fire('¡Éxito!', 'Usuario actualizado correctamente', 'success');
      } else {
        await createUsuario(dataToSend);
        Swal.fire('¡Creado!', 'El usuario ha sido registrado', 'success');
      }
      navigate('/usuarios');
    } catch (error) {
      console.error("ERROR DETALLADO:", error.response?.data || error.message);
      Swal.fire(
        'Error al guardar', 
        error.response?.data?.message || 'Revisa la consola para más detalles', 
        'error'
      );
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', bgcolor: '#f8fafc' }}>
      <CircularProgress sx={{ color: '#6366f1' }} />
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#f1f5f9', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        {/* BOTÓN VOLVER */}
        <Button 
          startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 16 }} />} 
          onClick={() => navigate('/usuarios')}
          sx={{ mb: 3, color: '#64748b', fontWeight: 700, '&:hover': { color: '#1e293b' } }}
        >
          Volver al Listado
        </Button>

        <Fade in={true} timeout={600}>
          <Paper sx={{ 
            borderRadius: '24px', 
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)'
          }}>
            {/* ENCABEZADO DE PERFIL */}
            <Box sx={{ 
              background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)', 
              p: 2, color: 'white' 
            }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ 
                  width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)', 
                  border: '0 solid rgba(255,255,255,0.3)',
                  fontSize: '2rem', fontWeight: 800
                }}>
                  {formData.name ? formData.name.charAt(0).toUpperCase() : <PersonIcon fontSize="large" />}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: -0.5 }}>
                    {isEdit ? 'Editar Perfil' : 'Crear Usuario'}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                    {isEdit ? `ID de Referencia: #${id}` : 'Configuración de nuevo acceso al sistema'}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                  {/* SECCIÓN: DATOS PERSONALES */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="primary" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VerifiedUserIcon fontSize="small" /> INFORMACIÓN DE IDENTIDAD
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Nombre Completo" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      InputProps={{
                        startAdornment: (<InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>),
                        sx: { borderRadius: '12px' }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Correo Electrónico" 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      InputProps={{
                        startAdornment: (<InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>),
                        sx: { borderRadius: '12px' }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Contraseña" 
                      type="password" 
                      required={!isEdit}
                      placeholder={isEdit ? "••••••••" : "Introduce tu contraseña"}
                      helperText={isEdit ? "Deja vacío para mantener la actual" : "Recomendado: 8+ caracteres"}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      InputProps={{
                        startAdornment: (<InputAdornment position="start"><LockIcon color="action" /></InputAdornment>),
                        sx: { borderRadius: '12px' }
                      }}
                    />
                  </Grid>

                  {/* SECCIÓN: ESTADO */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: '12px', 
                      bgcolor: formData.status === 1 ? '#f0fdf4' : '#fef2f2',
                      border: '1px solid',
                      borderColor: formData.status === 1 ? '#bbf7d0' : '#fecaca',
                      transition: 'all 0.3s ease'
                    }}>
                      <FormControlLabel
                        sx={{ m: 0, width: '100%', justifyContent: 'space-between' }}
                        labelPlacement="start"
                        control={
                          <Switch 
                            checked={formData.status === 1} 
                            onChange={(e) => setFormData({...formData, status: e.target.checked ? 1 : 0})} 
                            color="success" 
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="subtitle2" fontWeight={800} color={formData.status === 1 ? '#166534' : '#991b1b'}>
                              {formData.status === 1 ? 'CUENTA ACTIVA' : 'CUENTA SUSPENDIDA'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Estado actual del usuario
                            </Typography>
                          </Box>
                        }
                      />
                    </Box>
                  </Grid>

                  {/* ACCIONES */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button 
                        variant="text" 
                        onClick={() => navigate('/usuarios')} 
                        sx={{ color: '#64748b', fontWeight: 700 }}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        startIcon={<SaveIcon />} 
                        sx={{ 
                          bgcolor: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)', 
                          borderRadius: '12px', 
                          px: 6, py: 1.5,
                          fontWeight: 800,
                          boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)',
                          '&:hover': { bgcolor: '#4338ca', boxShadow: 'none' } 
                        }}
                      >
                        {isEdit ? 'Actualizar Perfil' : 'Finalizar Registro'}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default UsuarioForm;