import {
  Drawer, Box, Typography, TextField,
  Button, Switch, IconButton, InputAdornment, 
  Divider, Stack, Avatar
} from '@mui/material';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { createEmpleado, updateEmpleado } from '../../api/empleadosApi';

// Iconos
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone';
import VpnKeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import PersonAddTwoToneIcon from '@mui/icons-material/PersonAddTwoTone';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';

const EmpleadoDrawer = ({ open, setOpen, fetchEmpleados, empleado }) => {
  const [form, setForm] = useState({
    codigo:'',
    nombre_empleado: '',
    email:'',
    telefono:'',
    direccion:'',
    fecha_nacimiento:'',
    cargo: '',
    id_usuario: '',
    activo: true
  });

  useEffect(() => {
    if (empleado) {
      setForm({
        codigo: empleado.codigo || '',
  nombre_empleado: empleado.nombre_empleado || '',
  email: empleado.email || '',
  telefono: empleado.telefono || '',
  direccion: empleado.direccion || '',
  fecha_nacimiento: empleado.fecha_nacimiento
    ? empleado.fecha_nacimiento.split('T')[0]
    : '',
  cargo: empleado.cargo || '',
  id_usuario: empleado.id_usuario || '',
  activo: empleado.activo ?? true
      });
    } else {
      setForm({ codigo: '',
      nombre_empleado: '',
      email: '',
      telefono: '',
      direccion: '',
      fecha_nacimiento: '',
      cargo: '',
      id_usuario: '',
      activo: true});
    }
  }, [empleado, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    let newValue = value;
  
    // 🔹 Solo números en teléfono
    if (name === 'telefono') {
      newValue = value.replace(/\D/g, ''); // elimina todo lo que no sea número
    }
  
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? checked
        : ['nombre_empleado', 'cargo'].includes(name)
          ? newValue.toUpperCase()
          : newValue
    }));
  };

  const handleSubmit = async () => {
    // Definimos los colores de tu paleta Material UI para reutilizar
    const colors = {
      primary: '#0f172a',    // Slate 900
      accent: '#6366f1',     // Indigo 500
      success: '#22c55e',    // Green 500
      error: '#ef4444',      // Red 500
      bg: '#ffffff'
    };
  
    const showCustomAlert = (title, text, icon, color) => {
      Swal.fire({
        title: `<span style="font-family: Roboto, sans-serif; font-weight: 800; color: ${colors.primary}">${title}</span>`,
        html: `<span style="font-family: Roboto, sans-serif; color: #64748b;">${text}</span>`,
        icon: icon,
        iconColor: color,
        background: colors.bg,
        showConfirmButton: icon === 'error', // Solo mostrar botón si hay error
        confirmButtonText: 'ENTENDIDO',
        timer: icon === 'success' ? 2000 : undefined,
        timerProgressBar: icon === 'success',
        // Inyectamos el estilo del botón directamente en el atributo style de SweetAlert
        didOpen: () => {
          const confirmBtn = Swal.getConfirmButton();
          if (confirmBtn) {
            confirmBtn.style.backgroundColor = colors.primary;
            confirmBtn.style.color = 'white';
            confirmBtn.style.borderRadius = '12px';
            confirmBtn.style.padding = '12px 30px';
            confirmBtn.style.fontWeight = 'bold';
            confirmBtn.style.fontFamily = 'Roboto, sans-serif';
            confirmBtn.style.border = 'none';
            confirmBtn.style.boxShadow = '0 10px 15px -3px rgba(15, 23, 42, 0.3)';
            
            confirmBtn.onmouseover = () => {
              confirmBtn.style.backgroundColor = colors.accent;
            };
            confirmBtn.onmouseleave = () => {
              confirmBtn.style.backgroundColor = colors.primary;
            };
          }
          
          const popup = Swal.getPopup();
          popup.style.borderRadius = '24px';
          popup.style.padding = '2rem';
        }
      });
    };
  
    if (!form.codigo  || !form.nombre_empleado) {
      showCustomAlert('Campo Requerido', 'El nombre es obligatorio para el registro.', 'error', colors.error);
      return;
    }
  // 🔹 Validación de email
if (form.email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(form.email)) {
    showCustomAlert(
      'Email inválido',
      'Ingrese un correo electrónico válido.',
      'error',
      colors.error
    );
    return;
  }
}
    try {
      const payload = { ...form, id_usuario: form.id_usuario || null };
  
      if (empleado) {
        await updateEmpleado(empleado.id_empleado, payload, localStorage.getItem('token'));
        showCustomAlert('¡Actualizado!', 'La ficha técnica ha sido sincronizada.', 'success', colors.accent);
      } else {
        await createEmpleado(payload, localStorage.getItem('token'));
        showCustomAlert('¡Registrado!', 'El colaborador ha sido dado de alta.', 'success', colors.success);
      }
  
      fetchEmpleados();
      setOpen(false);
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || 'No se pudo guardar la información.';
    
      showCustomAlert(
        'Validación',
        backendMessage,
        'error',
        colors.error
      );
    }
  };

  // Estilo personalizado para los inputs con línea degradada
  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#f8fafc',
      borderRadius: '12px 12px 0 0',
      '& fieldset': { border: 'none' }, // Quitamos el borde completo
      '&:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)', // Degradado azul-púrpura
        transform: 'scaleX(0)',
        transition: 'transform 0.3s ease-in-out',
      },
      '&.Mui-focused:after': {
        transform: 'scaleX(1)', // La línea aparece al enfocar
      },
      '&.Mui-focused': {
        backgroundColor: '#fff',
      }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#6366f1',
      fontWeight: 'bold'
    }
  };

  return (
    <Drawer
      anchor="right" open={open} onClose={() => setOpen(false)}
      PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, borderRadius: { xs: 0, sm: '24px 0 0 24px' }, border: 'none' } }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <Box sx={{ p: 3, bgcolor: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', width: 45, height: 45 }}>
              <PersonAddTwoToneIcon sx={{ color: '#818cf8' }} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{empleado ? 'Editar Ficha' : 'Nuevo Registro'}</Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>Personal Administrativo</Typography>
            </Box>
          </Stack>
          <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 4 }}>
          <Stack spacing={4}>
            
            <Box>
              <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 900, mb: 2, display: 'block' }}>Datos Principales</Typography>
              <TextField
  fullWidth
  label="Código de Empleado"
  name="codigo"
  value={form.codigo}
  onChange={handleChange}
  margin="normal"
  sx={inputStyle}
/>
              <TextField
                fullWidth label="Nombre del Empleado" name="nombre_empleado"
                value={form.nombre_empleado} onChange={handleChange} margin="normal"
                sx={inputStyle}
                InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineTwoToneIcon fontSize="small" /></InputAdornment>) }}
              />
<TextField
  fullWidth
  label="Correo Electrónico"
  name="email"
  value={form.email}
  onChange={handleChange}
  margin="normal"
  sx={inputStyle}
/>
<TextField
  fullWidth
  label="Teléfono"
  name="telefono"
  value={form.telefono}
  onChange={handleChange}
  margin="normal"
  sx={inputStyle}
  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
/>
<TextField
  fullWidth
  label="Dirección"
  name="direccion"
  value={form.direccion}
  onChange={handleChange}
  margin="normal"
  sx={inputStyle}
/>
<TextField
  fullWidth
  type="date"
  label="Fecha de Nacimiento"
  name="fecha_nacimiento"
  value={form.fecha_nacimiento}
  onChange={handleChange}
  margin="normal"
  InputLabelProps={{ shrink: true }}
  sx={inputStyle}
/>
              <TextField
                fullWidth label="Cargo / Puesto" name="cargo"
                value={form.cargo} onChange={handleChange} margin="normal"
                sx={inputStyle}
                InputProps={{ startAdornment: (<InputAdornment position="start"><BadgeTwoToneIcon fontSize="small" /></InputAdornment>) }}
              />

              <TextField
                fullWidth label="ID Usuario" name="id_usuario"
                value={form.id_usuario} onChange={handleChange} margin="normal"
                sx={inputStyle}
                InputProps={{ startAdornment: (<InputAdornment position="start"><VpnKeyTwoToneIcon fontSize="small" /></InputAdornment>) }}
              />
            </Box>

            {/* Selector de Estado Dinámico */}
            <Box>
              <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 900, mb: 1, display: 'block' }}>Estado de Cuenta</Typography>
              <Box 
                onClick={() => handleChange({ target: { name: 'activo', type: 'checkbox', checked: !form.activo } })}
                sx={{ 
                  cursor: 'pointer', p: 2, borderRadius: '16px', border: '2px solid',
                  borderColor: form.activo ? '#dcfce7' : '#fee2e2',
                  bgcolor: form.activo ? '#f0fdf4' : '#fef2f2',
                  transition: 'all 0.3s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  {form.activo 
                    ? <CheckCircleTwoToneIcon sx={{ color: '#22c55e' }} /> 
                    : <CancelTwoToneIcon sx={{ color: '#ef4444' }} />
                  }
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: form.activo ? '#166534' : '#991b1b' }}>
                      {form.activo ? 'ACCESO HABILITADO' : 'ACCESO RESTRINGIDO'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: form.activo ? '#15803d' : '#b91c1c', opacity: 0.8 }}>
                      Click para cambiar estado
                    </Typography>
                  </Box>
                </Stack>
                <Switch 
                  checked={form.activo} 
                  color={form.activo ? "success" : "error"}
                  sx={{ '& .MuiSwitch-thumb': { boxShadow: '0 2px 4px rgba(0,0,0,0.2)' } }}
                />
              </Box>
            </Box>
          </Stack>
        </Box>

        {/* Footer Button */}
        <Box sx={{ p: 3, borderTop: '1px solid #f1f5f9' }}>
          <Button
            fullWidth variant="contained" size="large" onClick={handleSubmit} startIcon={<SaveTwoToneIcon />}
            sx={{
              py: 2, borderRadius: '16px', textTransform: 'none', fontWeight: 800,
              bgcolor: '#0f172a', transition: 'all 0.3s',
              '&:hover': { bgcolor: '#6366f1', transform: 'translateY(-2px)', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.4)' }
            }}
          >
            {empleado ? 'Actualizar Ficha' : 'Confirmar Registro'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default EmpleadoDrawer;