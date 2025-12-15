import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  getAlmacenes,
  deleteAlmacen
} from '../../api/almacenesApi';

import AlmacenModal from '../../components/almacenes/AlmacenModal';
import AlmacenTable from '../../components/almacenes/AlmacenTable';

const AlmacenesList = () => {
  const [almacenes, setAlmacenes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [almacenEdit, setAlmacenEdit] = useState(null);

  const fetchAlmacenes = async () => {
    const data = await getAlmacenes();
    setAlmacenes(data);
    setFiltered(data);
  };

  useEffect(() => {
    fetchAlmacenes();
  }, []);

  useEffect(() => {
    setFiltered(
      almacenes.filter(a =>
        a.nombre_almacen.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, almacenes]);

  const handleDelete = (almacen) => {
    Swal.fire({
      title: '¿Eliminar?',
      text: almacen.nombre_almacen,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAlmacen(
            almacen.id_almacen,
            localStorage.getItem('token')
          );
          Swal.fire('Eliminado', 'Almacén eliminado', 'success');
          fetchAlmacenes();
        } catch {
          Swal.fire('Error', 'No se pudo eliminar', 'error');
        }
      }
    });
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Almacenes
      </Typography>

      {/* Buscador */}
      <TextField
        label="Buscar almacén"
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 2, width: 300 }}
      />

      <Button
        variant="contained"
        sx={{ mb: 2, ml: 2 }}
        onClick={() => {
          setAlmacenEdit(null);
          setOpen(true);
        }}
      >
        Nuevo
      </Button>

      <AlmacenTable
        almacenes={filtered}
        onEdit={(a) => {
          setAlmacenEdit(a);
          setOpen(true);
        }}
        onDelete={handleDelete}
      />

      <AlmacenModal
        open={open}
        setOpen={setOpen}
        fetchAlmacenes={fetchAlmacenes}
        almacen={almacenEdit}
      />
    </Box>
  );
};

export default AlmacenesList;
