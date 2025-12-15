import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { getSizes, deleteSize } from '../../api/sizesApi';
import { useAuth } from '../../context/AuthContext';
import SizeTable from '../../components/sizes/SizeTable';
import SizeModal from '../../components/sizes/SizeModal';
import Swal from 'sweetalert2';

const SizesList = () => {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  const { usuario } = useAuth();

  const fetchSizes = async () => {
    setLoading(true);
    try {
      const data = await getSizes();
      setSizes(data);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleEdit = (size) => {
    setSelectedSize(size);
    setOpenModal(true);
  };

  // 🔥 ESTA FUNCIÓN FALTABA 🔥
  const handleCreate = () => {
    setSelectedSize(null);
    setOpenModal(true);
  };

  const handleDelete = async (id_talla) => {
    const result = await Swal.fire({
      title: '¿Eliminar talla?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });

    if (!result.isConfirmed) return;

    try {
      await deleteSize(id_talla, localStorage.getItem('token'));
      fetchSizes();

      Swal.fire({
        title: 'Eliminado',
        text: 'La talla fue eliminada correctamente.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar la talla', 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Tallas</Typography>

        {usuario?.role === 'admin' && (
          <Button variant="contained" onClick={handleCreate}>
            Nueva Talla
          </Button>
        )}
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <SizeTable sizes={sizes} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {openModal && (
        <SizeModal
          open={openModal}
          setOpen={setOpenModal}
          fetchSizes={fetchSizes}
          size={selectedSize}
        />
      )}
    </Box>
  );
};

export default SizesList;
