import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { createMaterial, updateMaterial } from '../../api/materialsApi';
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

const MaterialModal = ({ open, setOpen, fetchMaterials, material }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (material) setName(material.nombre_material);
    else setName('');
  }, [material]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Swal.fire('Error', 'El nombre del material es obligatorio', 'error');
      return;
    }

    try {
      if (material) {
        await updateMaterial(material.id_material, { nombre_material: name.toUpperCase() }, localStorage.getItem('token'));
        Swal.fire('Actualizado', 'Material actualizado correctamente', 'success');
      } else {
        await createMaterial({ nombre_material: name.toUpperCase() }, localStorage.getItem('token'));
        Swal.fire('Creado', 'Material creado correctamente', 'success');
      }
      fetchMaterials();
      setOpen(false);
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar el material', 'error');
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {material ? 'Editar Material' : 'Nuevo Material'}
        </Typography>
        <TextField
          fullWidth
          label="Nombre del Material"
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          sx={{ mb: 3 }}
        />
        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

export default MaterialModal;
