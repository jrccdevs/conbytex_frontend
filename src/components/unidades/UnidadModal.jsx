import React, { useState, useEffect } from 'react';
import { 
  Modal, Box, Typography, TextField, Button, 
  IconButton, Stack, Fade, Backdrop, Avatar 
} from '@mui/material';
import { 
  Close, 
  Straighten, 
  CheckCircleTwoTone, 
  InfoOutlined 
} from '@mui/icons-material';
import { createUnidad, updateUnidad } from '../../api/unidadesApi';
import Swal from 'sweetalert2';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  bgcolor: 'background.paper',
  borderRadius: '24px',
  boxShadow: '0px 20px 40px rgba(15, 23, 42, 0.1)',
  p: 0,
  overflow: 'hidden',
  outline: 'none'
};

const UnidadModal = ({ open, setOpen, fetchUnidades, unidad }) => {
  const [unidadValue, setUnidadValue] = useState('');

  useEffect(() => {
    if (unidad) setUnidadValue(unidad.nombre_unidad);
    else setUnidadValue('');
  }, [unidad]);

  const handleSubmit = async () => {
    if (!unidadValue.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '<span style="color: #0f172a; font-weight: 800;">Atención</span>',
        html: '<p style="color: #64748b;">El nombre de la unidad es obligatorio.</p>',
        confirmButtonColor: '#3b82f6',
        borderRadius: '20px'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = { nombre_unidad: unidadValue.toUpperCase() };

      const swalConfig = (title, text) => ({
        icon: 'success',
        title: `<span style="color: #0f172a; font-weight: 800;">${title}</span>`,
        html: `<p style="color: #64748b;">${text}</p>`,
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
        borderRadius: '20px',
        iconColor: '#3b82f6'
      });

      if (unidad) {
        await updateUnidad(unidad.id_unidad, payload, token);
        Swal.fire(swalConfig('¡Actualizado!', 'La unidad de medida ha sido modificada.'));
      } else {
        await createUnidad(payload, token);
        Swal.fire(swalConfig('¡Creado!', 'La nueva unidad de medida se registró correctamente.'));
      }

      fetchUnidades();
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
                <Straighten fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                  {unidad ? 'Editar Unidad' : 'Nueva Unidad'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Estándares de medición
                </Typography>
              </Box>
            </Stack>
            <IconButton onClick={() => setOpen(false)} size="small">
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {/* Body */}
          <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f0f9ff', borderRadius: '12px', display: 'flex', gap: 1.5 }}>
              <InfoOutlined sx={{ color: '#0369a1', fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: '#0369a1', fontWeight: 500 }}>
                Use nombres claros y breves (Ej: KILOGRAMOS, METROS, UNIDADES).
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Nombre de la Unidad"
              placeholder="EJ: GRAMOS"
              value={unidadValue}
              onChange={(e) => setUnidadValue(e.target.value.toUpperCase())}
              variant="outlined"
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
                Guardar Unidad
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default UnidadModal;