import React, { useState, useEffect } from 'react';
import { 
  Modal, Box, Typography, TextField, Button, 
  IconButton, Stack, Fade, Backdrop, Avatar 
} from '@mui/material';
import { 
  Close, 
  PaletteTwoTone, 
  SaveTwoTone, 
  ColorLensTwoTone 
} from '@mui/icons-material';
import { createColor, updateColor } from '../../api/colorsApi';
import Swal from 'sweetalert2';

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

const ColorModal = ({ open, setOpen, fetchColors, color }) => {
  const [colorValue, setColorValue] = useState('');

  useEffect(() => {
    if (color) setColorValue(color.nombre_color);
    else setColorValue('');
  }, [color]);

  const handleSubmit = async () => {
    if (!colorValue.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '<span style="color: #0f172a; font-weight: 800;">Atención</span>',
        html: '<p style="color: #64748b;">Debe asignar un nombre al color para registrarlo.</p>',
        confirmButtonColor: '#3b82f6',
        borderRadius: '20px'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = { nombre_color: colorValue.toUpperCase() };

      const swalConfig = (title, text) => ({
        icon: 'success',
        title: `<span style="color: #0f172a; font-weight: 800;">${title}</span>`,
        html: `<p style="color: #64748b;">${text}</p>`,
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
        borderRadius: '20px',
        iconColor: '#3b82f6',
        background: '#ffffff',
      });

      if (color) {
        await updateColor(color.id_color, payload, token);
        Swal.fire(swalConfig('¡Actualizado!', 'El catálogo de colores ha sido actualizado.'));
      } else {
        await createColor(payload, token);
        Swal.fire(swalConfig('¡Creado!', 'El nuevo color se registró correctamente.'));
      }

      fetchColors();
      setOpen(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '<span style="color: #ef4444; font-weight: 800;">Error</span>',
        text: 'Ocurrió un problema al guardar el color.',
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
          {/* Header del Modal */}
          <Box sx={{ 
            p: 3, 
            bgcolor: '#f8fafc', 
            borderBottom: '1px solid #e2e8f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6', width: 42, height: 42 }}>
                <PaletteTwoTone fontSize="medium" />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                  {color ? 'Editar Color' : 'Nuevo Color'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Catálogo de variantes visuales
                </Typography>
              </Box>
            </Stack>
            <IconButton onClick={() => setOpen(false)} size="small">
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {/* Body del Modal */}
          <Box sx={{ p: 4 }}>
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              bgcolor: '#f1f5f9', 
              borderRadius: '12px', 
              borderLeft: '4px solid #3b82f6',
              display: 'flex', 
              alignItems: 'center', 
              gap: 2 
            }}>
              <ColorLensTwoTone sx={{ color: '#3b82f6' }} />
              <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                Ingrese el nombre descriptivo del tono (Ej: AZUL MARINO, ROJO MATE).
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Nombre del Color"
              placeholder="EJ: VERDE ESMERALDA"
              value={colorValue}
              onChange={(e) => setColorValue(e.target.value.toUpperCase())}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  fontWeight: 600,
                  '&:hover fieldset': { borderColor: '#3b82f6' },
                }
              }}
            />
          </Box>

          {/* Footer del Modal */}
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
                startIcon={<SaveTwoTone />}
                sx={{ 
                  bgcolor: '#0f172a', 
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 700,
                  py: 1.2,
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
                  '&:hover': { bgcolor: '#334155' }
                }}
              >
                Guardar Color
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ColorModal;