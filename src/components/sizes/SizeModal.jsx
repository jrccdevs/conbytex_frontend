// src/components/sizes/SizeModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  Modal, Box, Typography, TextField, Button, 
  IconButton, Stack, Fade, Backdrop, Avatar 
} from '@mui/material';
import { 
  Close, 
  AspectRatioTwoTone, 
  CheckCircleTwoTone, 
  StraightenTwoTone 
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { createSize, updateSize } from '../../api/sizesApi';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  bgcolor: 'background.paper',
  borderRadius: '24px',
  boxShadow: '0px 20px 40px rgba(15, 23, 42, 0.15)',
  p: 0,
  overflow: 'hidden',
  outline: 'none'
};

const SizeModal = ({ open, setOpen, fetchSizes, size }) => {
  const [sizeValue, setSizeValue] = useState('');

  useEffect(() => {
    if (size) setSizeValue(size.nombre_talla);
    else setSizeValue('');
  }, [size]);

  // Configuración común para SweetAlert de éxito
  const swalSuccess = (title, text) => ({
    icon: 'success',
    title: `<span style="color: #0f172a; font-weight: 800;">${title}</span>`,
    html: `<p style="color: #64748b; font-weight: 500;">${text}</p>`,
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    borderRadius: '20px',
    iconColor: '#3b82f6',
    background: '#ffffff',
  });

  const handleSubmit = async () => {
    if (!sizeValue.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '<span style="color: #0f172a; font-weight: 800;">Atención</span>',
        html: '<p style="color: #64748b;">El nombre de la talla no puede estar vacío.</p>',
        confirmButtonColor: '#0f172a',
        borderRadius: '20px'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = { nombre_talla: sizeValue.toUpperCase() };

      if (size) {
        await updateSize(size.id_talla, payload, token);
        Swal.fire(swalSuccess('Talla Actualizada', 'Los cambios se guardaron correctamente.'));
      } else {
        await createSize(payload, token);
        Swal.fire(swalSuccess('Talla Registrada', 'La nueva talla ha sido creada.'));
      }

      fetchSizes();
      setOpen(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '<span style="color: #ef4444; font-weight: 800;">Error</span>',
        text: 'No se pudo procesar la solicitud.',
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
        backdrop: { timeout: 500, sx: { backgroundColor: 'rgba(15, 23, 42, 0.7)' } }
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          {/* Header */}
          <Box sx={{ p: 3, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6' }}>
                <AspectRatioTwoTone fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                  {size ? 'Editar Talla' : 'Nueva Talla'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Dimensiones y Escalas
                </Typography>
              </Box>
            </Stack>
            <IconButton onClick={() => setOpen(false)} size="small">
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {/* Body */}
          <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f0f9ff', borderRadius: '12px', borderLeft: '4px solid #3b82f6', display: 'flex', gap: 1.5 }}>
              <StraightenTwoTone sx={{ color: '#0369a1', fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: '#0369a1', fontWeight: 500 }}>
                Ejemplos: <b>XL, 42, 32x34, SMALL</b>. El sistema lo convertirá a mayúsculas.
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Nombre de la Talla"
              placeholder="Ej: XL"
              value={sizeValue}
              onChange={(e) => setSizeValue(e.target.value.toUpperCase())}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  fontWeight: 600
                }
              }}
            />
          </Box>

          {/* Footer */}
          <Box sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
            <Stack direction="row" spacing={2}>
              <Button 
                fullWidth 
                onClick={() => setOpen(false)}
                sx={{ color: '#64748b', fontWeight: 700, textTransform: 'none' }}
              >
                Cancelar
              </Button>
              <Button 
                fullWidth 
                variant="contained" 
                onClick={handleSubmit}
                startIcon={<CheckCircleTwoTone />}
                sx={{ 
                  bgcolor: '#0f172a', 
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 700,
                  py: 1.2,
                  '&:hover': { bgcolor: '#334155' }
                }}
              >
                Guardar Talla
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SizeModal;