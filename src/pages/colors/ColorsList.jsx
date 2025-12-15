import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress, TextField } from '@mui/material';
import { getColors, deleteColor } from '../../api/colorsApi';
import { useAuth } from '../../context/AuthContext';
import ColorTable from '../../components/colors/ColorTable';
import ColorModal from '../../components/colors/ColorModal';
import Swal from 'sweetalert2';

const ColorsList = () => {
  const [colors, setColors] = useState([]);
  const [filteredColors, setFilteredColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [search, setSearch] = useState('');

  const { usuario } = useAuth();

  const fetchColors = async () => {
    setLoading(true);
    try {
      const data = await getColors();
      setColors(data);
      setFilteredColors(data);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchColors();
  }, []);

  useEffect(() => {
    setFilteredColors(
      colors.filter((c) =>
        c.nombre_color.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, colors]);

  const handleEdit = (color) => {
    setSelectedColor(color);
    setOpenModal(true);
  };

  const handleDelete = async (id_color) => {
    const result = await Swal.fire({
      title: '¿Eliminar color?',
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
      await deleteColor(id_color, localStorage.getItem('token'));
      fetchColors();
      Swal.fire('Eliminado', 'El color fue eliminado correctamente', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el color', 'error');
    }
  };

  const handleCreate = () => {
    setSelectedColor(null);
    setOpenModal(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Colores</Typography>
        {usuario?.role === 'admin' && (
          <Button variant="contained" onClick={handleCreate}>
            Nuevo Color
          </Button>
        )}
      </Box>

      <TextField
        fullWidth
        placeholder="Buscar color..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <ColorTable colors={filteredColors} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {openModal && (
        <ColorModal
          open={openModal}
          setOpen={setOpenModal}
          fetchColors={fetchColors}
          color={selectedColor}
        />
      )}
    </Box>
  );
};

export default ColorsList;
