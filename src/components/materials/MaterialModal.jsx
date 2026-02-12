import React, { useState, useEffect } from 'react';
import { 
  Modal, Box, Typography, TextField, Button, 
  IconButton, Stack, Fade, Backdrop, Avatar 
} from '@mui/material';
import { 
  Close, 
  LayersTwoTone, 
  SaveTwoTone, 
  InfoOutlined 
} from '@mui/icons-material';
import { createMaterial, updateMaterial } from '../../api/materialsApi';
import Swal from 'sweetalert2';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 420 },
  bgcolor: 'background.paper',
  borderRadius: '24px',
  boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
  p: 0,
  overflow: 'hidden',
  outline: 'none'
};

const MaterialModal = ({ open, setOpen, fetchMaterials, material }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (material) setName(material.nombre_material);
    else setName('');
  }, [material]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '<span style="color: #0f172a; font-weight: 800;">Falta información</span>',
        html: '<p style="color: #64748b;">El nombre del material es obligatorio para el registro.</p>',
        confirmButtonColor: '#6366f1',
        borderRadius: '20px'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = { nombre_material: name.toUpperCase() };

      const swalConfig = (title, text) => ({
        icon: 'success',
        title: `<span style="color: #0f172a; font-weight: 800;">${title}</span>`,
        text: text,
        showConfirmButton: false,
        timer: 1800,
        borderRadius: '20px',
        iconColor: '#6366f1',
      });

      if (material) {
        await updateMaterial(material.id_material, payload, token);
        Swal.fire(swalConfig('¡Actualizado!', 'Los datos del material han sido modificados.'));
      } else {
        await createMaterial(payload, token);
        Swal.fire(swalConfig('¡Registro Exitoso!', 'El nuevo material se añadió al catálogo.'));
      }

      fetchMaterials();
      setOpen(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo procesar la solicitud en este momento.',
        confirmButtonColor: '#0f172a',
        borderRadius: '20px'
      });
    }
  };

  return (
    <Modal 
      open={open} 
      onClose={() => setOpen(false)}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: { timeout: 500, sx: { backgroundColor: 'rgba(15, 23, 42, 0.8)' } }
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          {/* Header con gradiente sutil */}
          <Box sx={{ 
            p: 3, 
            background: 'linear-gradient(to right, #f8fafc, #ffffff)', 
            borderBottom: '1px solid #e2e8f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: '#eef2ff', color: '#6366f1', width: 45, height: 45 }}>
                <LayersTwoTone />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.1rem' }}>
                  {material ? 'Editar Material' : 'Nuevo Material'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Definición de materia prima
                </Typography>
              </Box>
            </Stack>
            <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: '#94a3b8' }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {/* Formulario */}
          <Box sx={{ p: 4 }}>
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              bgcolor: '#f8fafc', 
              borderRadius: '16px', 
              border: '1px dashed #cbd5e1',
              display: 'flex',
              gap: 1.5,
              alignItems: 'flex-start'
            }}>
              <InfoOutlined sx={{ color: '#6366f1', fontSize: 20, mt: 0.2 }} />
              <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.5 }}>
                Ingrese el nombre técnico del material. Este nombre se verá reflejado en las fichas de productos.
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Nombre del Material"
              placeholder="Ej: ALGODÓN ORGÁNICO"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              variant="outlined"
              autoFocus
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  backgroundColor: '#ffffff',
                  fontWeight: 600,
                  '& fieldset': { borderColor: '#e2e8f0' },
                  '&:hover fieldset': { borderColor: '#6366f1' },
                },
                '& .MuiInputLabel-root': { fontWeight: 500 }
              }}
            />
          </Box>

          {/* Acciones */}
          <Box sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
            <Stack direction="row" spacing={2}>
              <Button 
                fullWidth 
                onClick={() => setOpen(false)}
                sx={{ 
                  color: '#64748b', 
                  fontWeight: 800, 
                  textTransform: 'none',
                  borderRadius: '12px'
                }}
              >
                Descartar
              </Button>
              <Button 
                fullWidth 
                variant="contained" 
                onClick={handleSubmit}
                startIcon={<SaveTwoTone />}
                sx={{ 
                  bgcolor: '#6366f1', 
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 700,
                  py: 1.4,
                  boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                  '&:hover': { bgcolor: '#4f46e5' }
                }}
              >
                Guardar Cambios
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default MaterialModal;