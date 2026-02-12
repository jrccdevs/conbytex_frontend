import {
  Modal, Box, Typography, TextField, Button, 
  IconButton, Stack, Fade, Backdrop, Avatar
} from '@mui/material';
import { 
  Close, 
  WarehouseOutlined, 
  CheckCircleOutline,
  LabelOutlined 
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { createAlmacen, updateAlmacen } from '../../api/almacenesApi';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  bgcolor: 'background.paper',
  boxShadow: '0px 20px 40px rgba(0,0,0,0.1)',
  borderRadius: '24px',
  p: 0, // Quitamos el padding global para controlar las secciones
  overflow: 'hidden',
  outline: 'none'
};

const AlmacenModal = ({ open, setOpen, fetchAlmacenes, almacen }) => {
  const [nombre_almacen, setNombreAlmacen] = useState('');

  useEffect(() => {
    if (almacen) {
      setNombreAlmacen(almacen.nombre_almacen);
    } else {
      setNombreAlmacen('');
    }
  }, [almacen]);

  const handleSubmit = async () => {
    if (!nombre_almacen.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '<span style="color: #0f172a; font-weight: 800;">Campo Requerido</span>',
        html: '<p style="color: #64748b; font-weight: 500;">El nombre del almacén es obligatorio para continuar.</p>',
        confirmButtonColor: '#0f172a',
        confirmButtonText: 'Entendido',
        padding: '2em',
        background: '#ffffff',
        borderRadius: '24px',
        customClass: {
          confirmButton: 'custom-swal-button'
        }
      });
      return;
    }

    try {
      const payload = { nombre_almacen: nombre_almacen.toUpperCase() };
      const token = localStorage.getItem('token');

      // Definimos el estilo de éxito común
      const successToast = (title, text) => ({
        icon: 'success',
        title: `<span style="color: #0f172a; font-weight: 800;">${title}</span>`,
        html: `<p style="color: #64748b; font-weight: 500;">${text}</p>`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        padding: '2em',
        borderRadius: '24px',
        iconColor: '#3b82f6', // Azul dinámico
        background: '#ffffff',
      });

      if (almacen) {
        await updateAlmacen(almacen.id_almacen, payload, token);
        Swal.fire(successToast('¡Actualizado!', 'Los datos del almacén se han guardado con éxito.'));
      } else {
        await createAlmacen(payload, token);
        Swal.fire(successToast('¡Registro Exitoso!', 'El nuevo almacén ya está disponible en el sistema.'));
      }

      fetchAlmacenes();
      setOpen(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '<span style="color: #ef4444; font-weight: 800;">Error de Sistema</span>',
        html: '<p style="color: #64748b; font-weight: 500;">Ocurrió un problema al intentar procesar la solicitud.</p>',
        confirmButtonColor: '#ef4444',
        borderRadius: '24px',
        padding: '2em',
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
          {/* Cabecera del Modal */}
          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            bgcolor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6', width: 40, height: 40 }}>
                <WarehouseOutlined fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                  {almacen ? 'Editar Registro' : 'Nuevo Almacén'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Gestión de ubicaciones físicas
                </Typography>
              </Box>
            </Stack>
            <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: '#94a3b8' }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {/* Cuerpo del Modal */}
          <Box sx={{ p: 4 }}>
            <Typography variant="body2" sx={{ color: '#475569', mb: 3, fontWeight: 500 }}>
              Por favor, ingrese el nombre descriptivo para identificar el almacén en el sistema.
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <LabelOutlined sx={{ fontSize: 16, color: '#3b82f6' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                    Identificador de Almacén
                  </Typography>
                </Stack>
                <TextField
                  fullWidth
                  placeholder="Ej: ALMACÉN CENTRAL"
                  variant="outlined"
                  value={nombre_almacen}
                  onChange={e => setNombreAlmacen(e.target.value)}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#f1f5f9',
                      '& fieldset': { border: 'none' },
                      '&:hover fieldset': { border: '1px solid #cbd5e1' },
                      '&.Mui-focused fieldset': { border: '2px solid #3b82f6' },
                      fontWeight: 600
                    }
                  }}
                />
              </Box>
            </Stack>
          </Box>

          {/* Acciones del Modal */}
          <Box sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button 
                onClick={() => setOpen(false)}
                sx={{ 
                  color: '#64748b', 
                  fontWeight: 700, 
                  textTransform: 'none',
                  px: 3 
                }}
              >
                Cancelar
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSubmit}
                startIcon={<CheckCircleOutline />}
                sx={{ 
                  bgcolor: '#0f172a', 
                  color: 'white',
                  borderRadius: '12px',
                  px: 4,
                  py: 1,
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
                  '&:hover': { bgcolor: '#334155' }
                }}
              >
                {almacen ? 'Actualizar Almacén' : 'Crear Almacén'}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AlmacenModal;