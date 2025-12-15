import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { createColor, updateColor } from '../../api/colorsApi';
import Swal from 'sweetalert2';

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

const ColorModal = ({ open, setOpen, fetchColors, color }) => {
  const [colorValue, setColorValue] = useState('');

  useEffect(() => {
    if (color) setColorValue(color.nombre_color);
    else setColorValue('');
  }, [color]);

  const handleSubmit = async () => {
    if (!colorValue.trim()) {
      Swal.fire('Error', 'El nombre del color es obligatorio', 'error');
      return;
    }

    try {
      if (color) {
        await updateColor(color.id_color, { nombre_color: colorValue.toUpperCase() }, localStorage.getItem('token'));
        Swal.fire('Actualizado', 'Color actualizado correctamente', 'success');
      } else {
        await createColor({ nombre_color: colorValue.toUpperCase() }, localStorage.getItem('token'));
        Swal.fire('Creado', 'Color creado correctamente', 'success');
      }
      fetchColors();
      setOpen(false);
    } catch (error) {
      Swal.fire('Error', 'Ocurrió un error al guardar el color', 'error');
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {color ? 'Editar Color' : 'Nuevo Color'}
        </Typography>
        <TextField
          fullWidth
          label="Nombre Color"
          value={colorValue}
          onChange={(e) => setColorValue(e.target.value.toUpperCase())}
          sx={{ mb: 3 }}
        />
        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

export default ColorModal;
