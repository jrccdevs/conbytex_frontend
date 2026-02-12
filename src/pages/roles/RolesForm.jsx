import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Stack, IconButton, 
  Divider, Alert, Switch, FormControlLabel, FormGroup 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';

const RolesForm = ({ rolEditando, onClose, onSave }) => {
  // Módulos estandarizados del ERP
  const modulosERP = [
    { id: 'usuarios', label: 'Gestión Usuarios' },
    { id: 'departamentos', label: 'Departamentos' },
    { id: 'empleados', label: 'Empleados' },
    { id: 'materiales', label: 'Materiales' },
    { id: 'productos', label: 'Productos / Colores / Sizes' },
    { id: 'inventario', label: 'Almacenes / Inventario' },
    { id: 'ordenes', label: 'Recetas / Órdenes' },
    { id: 'movimientos', label: 'Movimientos Stock' }
  ];

  const [formData, setFormData] = useState({
    name: '',
    permissions: modulosERP.reduce((acc, mod) => ({ ...acc, [mod.id]: { view: false } }), {})
  });

  const [error, setError] = useState(null);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (rolEditando) {
      setFormData({
        name: rolEditando.name,
        permissions: rolEditando.permissions || {}
      });
    }
  }, [rolEditando]);

  const handleTogglePermission = (id) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [id]: { view: !prev.permissions[id]?.view }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("El nombre de la plantilla es obligatorio");
      return;
    }
    // Pasamos los datos al componente padre para que haga la petición a la API
    onSave(formData);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <AdminPanelSettingsTwoToneIcon sx={{ color: '#10b981' }} />
          <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
            {rolEditando ? 'Editar Plantilla' : 'Nueva Plantilla'}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} sx={{ color: '#fff' }}><CloseIcon /></IconButton>
      </Stack>

      <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

      {error && <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="NOMBRE DEL ROL"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase() })}
            placeholder="ej: supervisor_ventas"
            sx={styles.input}
            disabled={!!rolEditando} // Evitamos cambiar el nombre si ya existe para no romper vínculos
          />

          <Box>
            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Configuración de Permisos Base
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', mb: 2 }}>
              Cualquier usuario asignado a este rol recibirá estos accesos por defecto.
            </Typography>

            <Box sx={{ 
              maxHeight: '45vh', 
              overflowY: 'auto', 
              bgcolor: 'rgba(255,255,255,0.02)', 
              p: 2, 
              border: '1px solid rgba(255,255,255,0.05)',
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(16, 185, 129, 0.2)' }
            }}>
              <FormGroup>
                {modulosERP.map((mod) => (
                  <FormControlLabel
                    key={mod.id}
                    control={
                      <Switch 
                        size="small"
                        checked={!!formData.permissions[mod.id]?.view} 
                        onChange={() => handleTogglePermission(mod.id)}
                        color="success"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        textTransform: 'uppercase',
                        color: formData.permissions[mod.id]?.view ? '#fff' : 'rgba(255,255,255,0.3)' 
                      }}>
                        {mod.label}
                      </Typography>
                    }
                  />
                ))}
              </FormGroup>
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button 
              type="submit"
              fullWidth 
              variant="contained" 
              startIcon={<SaveTwoToneIcon />}
              sx={styles.button}
            >
              GUARDAR PLANTILLA DE ROL
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

const styles = {
  input: {
    '& .MuiOutlinedInput-root': { 
      color: '#fff', 
      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
      '&:hover fieldset': { borderColor: '#10b981' },
      '&.Mui-focused fieldset': { borderColor: '#10b981' }
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)', fontWeight: 600 },
    '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' }
  },
  button: {
    bgcolor: '#10b981', 
    py: 2, 
    fontWeight: 900,
    borderRadius: '0px',
    color: '#000',
    '&:hover': { bgcolor: '#059669', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }
  }
};

export default RolesForm;