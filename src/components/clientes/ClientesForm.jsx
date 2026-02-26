import {
    Drawer, Box, Typography, TextField,
    Button, Switch, IconButton, InputAdornment,
    Stack, Avatar, MenuItem
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import Swal from 'sweetalert2';
  import { createCliente, updateCliente } from '../../api/clientes';
  
  // Iconos
  import CloseIcon from '@mui/icons-material/Close';
  import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
  import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone';
  import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
  import PersonAddTwoToneIcon from '@mui/icons-material/PersonAddTwoTone';
  import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
  import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
  import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
  import PhoneTwoToneIcon from '@mui/icons-material/PhoneTwoTone';
  import LocationOnTwoToneIcon from '@mui/icons-material/LocationOnTwoTone';
  
  const ClientesDrawer = ({ open, setOpen, fetchClientes, cliente }) => {
  
    const [form, setForm] = useState({
      codigo_cliente: '',
      nombre: '',
      email: '',
      telefono: '',
      tipo_documento: 'DNI',
      numero_documento: '',
      direccion: '',
      estado: true
    });
  
    useEffect(() => {
      if (cliente) {
        setForm({
          codigo_cliente: cliente.codigo_cliente || '',
          nombre: cliente.nombre || '',
          email: cliente.email || '',
          telefono: cliente.telefono || '',
          tipo_documento: cliente.tipo_documento || 'DNI',
          numero_documento: cliente.numero_documento || '',
          direccion: cliente.direccion || '',
          estado: cliente.estado ?? true
        });
      } else {
        setForm({
          codigo_cliente: '',
          nombre: '',
          email: '',
          telefono: '',
          tipo_documento: 'DNI',
          numero_documento: '',
          direccion: '',
          estado: true
        });
      }
    }, [cliente, open]);
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      let newValue = value;
  
      if (name === 'telefono' || name === 'numero_documento') {
        newValue = value.replace(/\D/g, '');
      }
  
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox'
          ? checked
          : name === 'nombre'
            ? newValue.toUpperCase()
            : newValue
      }));
    };
  
    const handleSubmit = async () => {
  
      if (!form.codigo_cliente || !form.nombre || !form.numero_documento) {
        Swal.fire('Campo Requerido', 'Código, nombre y documento son obligatorios.', 'error');
        return;
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (form.email && !emailRegex.test(form.email)) {
        Swal.fire('Email inválido', 'Ingrese un correo válido.', 'error');
        return;
      }
  
      try {
        const payload = { ...form };
  
        if (cliente) {
          await updateCliente(cliente.id_cliente, payload, localStorage.getItem('token'));
          Swal.fire('Actualizado', 'Cliente actualizado correctamente.', 'success');
        } else {
          await createCliente(payload, localStorage.getItem('token'));
          Swal.fire('Registrado', 'Cliente registrado correctamente.', 'success');
        }
  
        fetchClientes();
        setOpen(false);
  
      } catch (error) {
        const backendMessage =
          error.response?.data?.message || 'No se pudo guardar la información.';
  
        Swal.fire('Validación', backendMessage, 'error');
      }
    };
  
    const inputStyle = {
      '& .MuiOutlinedInput-root': {
        backgroundColor: '#f8fafc',
        borderRadius: '12px'
      }
    };
  
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
      >
        <Box sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 800 }}>
            {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
          </Typography>
  
          <TextField
            fullWidth label="Código Cliente"
            name="codigo_cliente"
            value={form.codigo_cliente}
            onChange={handleChange}
            margin="normal"
            sx={inputStyle}
          />
  
          <TextField
            fullWidth label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            margin="normal"
            sx={inputStyle}
            InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineTwoToneIcon fontSize="small" /></InputAdornment>) }}
          />
  
          <TextField
            fullWidth label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            sx={inputStyle}
            InputProps={{ startAdornment: (<InputAdornment position="start"><EmailTwoToneIcon fontSize="small" /></InputAdornment>) }}
          />
  
          <TextField
            fullWidth label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            margin="normal"
            sx={inputStyle}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneTwoToneIcon fontSize="small" /></InputAdornment>) }}
          />
  
          <TextField
            select
            fullWidth
            label="Tipo Documento"
            name="tipo_documento"
            value={form.tipo_documento}
            onChange={handleChange}
            margin="normal"
            sx={inputStyle}
          >
            <MenuItem value="DNI">DNI</MenuItem>
            <MenuItem value="CI">CI</MenuItem>
            <MenuItem value="NIT">NIT</MenuItem>
            <MenuItem value="RUC">RUC</MenuItem>
            <MenuItem value="PASAPORTE">PASAPORTE</MenuItem>
            <MenuItem value="BISA">BISA</MenuItem>
          </TextField>
  
          <TextField
            fullWidth label="Número Documento"
            name="numero_documento"
            value={form.numero_documento}
            onChange={handleChange}
            margin="normal"
            sx={inputStyle}
          />
  
          <TextField
            fullWidth label="Dirección"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            margin="normal"
            sx={inputStyle}
            InputProps={{ startAdornment: (<InputAdornment position="start"><LocationOnTwoToneIcon fontSize="small" /></InputAdornment>) }}
          />
  {/* Selector de Estado Dinámico */}
  <Box>
              <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 900, mb: 1, display: 'block' }}>Estado de Cuenta</Typography>
              <Box 
                onClick={() => handleChange({ target: { name: 'estado', type: 'checkbox', checked: !form.estado } })}
                sx={{ 
                  cursor: 'pointer', p: 2, borderRadius: '16px', border: '2px solid',
                  borderColor: form.estado ? '#dcfce7' : '#fee2e2',
                  bgcolor: form.estado ? '#f0fdf4' : '#fef2f2',
                  transition: 'all 0.3s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  {form.estado 
                    ? <CheckCircleTwoToneIcon sx={{ color: '#22c55e' }} /> 
                    : <CancelTwoToneIcon sx={{ color: '#ef4444' }} />
                  }
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: form.estado ? '#166534' : '#991b1b' }}>
                      {form.estado ? 'ACCESO HABILITADO' : 'ACCESO RESTRINGIDO'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: form.estado ? '#15803d' : '#b91c1c', opacity: 0.8 }}>
                      Click para cambiar estado
                    </Typography>
                  </Box>
                </Stack>
                <Switch 
                  checked={form.estado} 
                  color={form.estado ? "success" : "error"}
                  sx={{ '& .MuiSwitch-thumb': { boxShadow: '0 2px 4px rgba(0,0,0,0.2)' } }}
                />
              </Box>
            </Box>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 4, bgcolor: '#0f172a' }}
            onClick={handleSubmit}
            startIcon={<SaveTwoToneIcon />}
          >
            {cliente ? 'Actualizar' : 'Registrar'}
          </Button>
        </Box>
      </Drawer>
    );
  };
  
  export default ClientesDrawer;