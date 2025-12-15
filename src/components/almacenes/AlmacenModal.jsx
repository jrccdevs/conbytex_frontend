import {
    Modal, Box, Typography, TextField, Button
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import Swal from 'sweetalert2';
  import { createAlmacen, updateAlmacen } from '../../api/almacenesApi';
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    p: 4
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
        Swal.fire('Error', 'El nombre es obligatorio', 'error');
        return;
      }
  
      try {
        const payload = {
          nombre_almacen: nombre_almacen.toUpperCase()
        };
  
        if (almacen) {
          await updateAlmacen(
            almacen.id_almacen,
            payload,
            localStorage.getItem('token')
          );
          Swal.fire('Actualizado', 'Almacén actualizado', 'success');
        } else {
          await createAlmacen(
            payload,
            localStorage.getItem('token')
          );
          Swal.fire('Creado', 'Almacén creado', 'success');
        }
  
        fetchAlmacenes();
        setOpen(false);
      } catch (error) {
        Swal.fire('Error', 'No se pudo guardar el almacén', 'error');
      }
    };
  
    return (
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>
            {almacen ? 'Editar Almacén' : 'Nuevo Almacén'}
          </Typography>
  
          <TextField
            fullWidth
            label="Nombre del almacén"
            value={nombre_almacen}
            onChange={e => setNombreAlmacen(e.target.value)}
            sx={{ mb: 2 }}
          />
  
          <Button fullWidth variant="contained" onClick={handleSubmit}>
            Guardar
          </Button>
        </Box>
      </Modal>
    );
  };
  
  export default AlmacenModal;
  