import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { createUnidad, updateUnidad } from '../../api/unidadesApi';
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

const UnidadModal = ({ open, setOpen, fetchUnidades, unidad }) => {
  const [unidadValue, setUnidadValue] = useState('');

  useEffect(() => {
    if (unidad) setUnidadValue(unidad.nombre_unidad);
    else setUnidadValue('');
  }, [unidad]);

  const handleSubmit = async () => {
    if (!unidadValue.trim()) {
      Swal.fire('Error', 'El nombre de la unidad es obligatorio', 'error');
      return;
    }

    try {
      if (unidad) {
        await updateUnidad(unidad.id_unidad, { nombre_unidad: unidadValue.toUpperCase() }, localStorage.getItem('token'));
        Swal.fire('Actualizado', 'Unidad actualizada correctamente', 'success');
      } else {
        await createUnidad({ nombre_unidad: unidadValue.toUpperCase() }, localStorage.getItem('token'));
        Swal.fire('Creado', 'Unidad creada correctamente', 'success');
      }
      fetchUnidades();
      setOpen(false);
    } catch (error) {
      Swal.fire('Error', 'Ocurrió un error al guardar la unidad', 'error');
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {unidad ? 'Editar Unidad' : 'Nueva Unidad'}
        </Typography>
        <TextField
          fullWidth
          label="Nombre Unidad"
          value={unidadValue}
          onChange={(e) => setUnidadValue(e.target.value.toUpperCase())}
          sx={{ mb: 3 }}
        />
        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

export default UnidadModal;
