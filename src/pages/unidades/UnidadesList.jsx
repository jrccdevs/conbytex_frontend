import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress, TextField } from '@mui/material';
import { getUnidades, deleteUnidad } from '../../api/unidadesApi';
import { useAuth } from '../../context/AuthContext';
import UnidadTable from '../../components/unidades/UnidadTable';
import UnidadModal from '../../components/unidades/UnidadModal';
import Swal from 'sweetalert2';

const UnidadesList = () => {
  const [unidades, setUnidades] = useState([]);
  const [filteredUnidades, setFilteredUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [search, setSearch] = useState('');

  const { usuario } = useAuth();

  const fetchUnidades = async () => {
    setLoading(true);
    try {
      const data = await getUnidades();
      setUnidades(data);
      setFilteredUnidades(data);
    } catch (error) {
      console.error('Error fetching unidades:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUnidades();
  }, []);

  useEffect(() => {
    setFilteredUnidades(
      unidades.filter((u) =>
        u.nombre_unidad.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, unidades]);

  const handleEdit = (unidad) => {
    setSelectedUnidad(unidad);
    setOpenModal(true);
  };

  const handleDelete = async (id_unidad) => {
    const result = await Swal.fire({
      title: '¿Eliminar unidad?',
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
      await deleteUnidad(id_unidad, localStorage.getItem('token'));
      fetchUnidades();
      Swal.fire('Eliminado', 'La unidad fue eliminada correctamente', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar la unidad', 'error');
    }
  };

  const handleCreate = () => {
    setSelectedUnidad(null);
    setOpenModal(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Unidades de Medida</Typography>
        {usuario?.role === 'admin' && (
          <Button variant="contained" onClick={handleCreate}>
            Nueva Unidad
          </Button>
        )}
      </Box>

      <TextField
        fullWidth
        placeholder="Buscar unidad..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <UnidadTable unidades={filteredUnidades} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {openModal && (
        <UnidadModal
          open={openModal}
          setOpen={setOpenModal}
          fetchUnidades={fetchUnidades}
          unidad={selectedUnidad}
        />
      )}
    </Box>
  );
};

export default UnidadesList;
