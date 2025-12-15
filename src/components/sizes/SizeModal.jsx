// src/components/sizes/SizeModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import Swal from 'sweetalert2';
import { createSize, updateSize } from '../../api/sizesApi';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4
};

const SizeModal = ({ open, setOpen, fetchSizes, size }) => {
  const [sizeValue, setSizeValue] = useState('');

  useEffect(() => {
    if (size) setSizeValue(size.nombre_talla);
    else setSizeValue('');
  }, [size]);

  const handleSubmit = async () => {
    // VALIDACIONES
    if (!sizeValue.trim()) {
      Swal.fire('Error', 'El nombre de la talla no puede estar vacío', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (size) {
        // EDITAR
        await updateSize(size.id_talla, { nombre_talla: sizeValue }, token);
        Swal.fire({
          title: 'Talla Actualizada',
          text: 'La talla se actualizó correctamente.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // CREAR
        await createSize({ nombre_talla: sizeValue }, token);
        Swal.fire({
          title: 'Talla Registrada',
          text: 'La nueva talla fue creada correctamente.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }

      fetchSizes();
      setOpen(false);

    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar la talla', 'error');
      console.error(error);
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {size ? 'Editar Talla' : 'Nueva Talla'}
        </Typography>

        <TextField
          fullWidth
          label="Nombre de la Talla"
          value={sizeValue}
          onChange={(e) =>
            setSizeValue(e.target.value.toUpperCase()) // <-- MAYÚSCULAS AUTOMÁTICAS
          }
          sx={{ mb: 3 }}
        />

        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

export default SizeModal;
