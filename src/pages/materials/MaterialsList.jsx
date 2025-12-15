// src/pages/materials/MaterialsList.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  MenuItem,
} from '@mui/material';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { getMaterials, deleteMaterial } from '../../api/materialsApi';
import MaterialTable from '../../components/materials/MaterialTable';
import MaterialModal from '../../components/materials/MaterialModal';

const MaterialsList = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [search, setSearch] = useState('');
  const [filterLetter, setFilterLetter] = useState('');

  const { usuario } = useAuth();

  // Traer materiales desde la API
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const data = await getMaterials();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      Swal.fire('Error', 'No se pudieron cargar los materiales', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Filtrado dinámico: búsqueda + letra inicial
  const filteredMaterials = materials.filter((m) => {
    const matchesSearch = m.nombre_material.toLowerCase().includes(search.toLowerCase());
    const matchesLetter = filterLetter
      ? m.nombre_material.charAt(0).toLowerCase() === filterLetter.toLowerCase()
      : true;
    return matchesSearch && matchesLetter;
  });

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar material?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      await deleteMaterial(id, localStorage.getItem('token'));
      fetchMaterials();
      Swal.fire('Eliminado', 'Material eliminado correctamente', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el material', 'error');
    }
  };

  const handleCreate = () => {
    setSelectedMaterial(null);
    setOpenModal(true);
  };

  // Letras únicas para filtro
  const letters = Array.from(new Set(materials.map((m) => m.nombre_material.charAt(0).toUpperCase()))).sort();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="h5">Materiales</Typography>
        {usuario?.role === 'admin' && (
          <Button variant="contained" onClick={handleCreate}>
            Nuevo Material
          </Button>
        )}
      </Box>

      {/* Buscador y filtro */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Buscar material..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
        />
        <TextField
          select
          label="Filtrar por inicial"
          value={filterLetter}
          onChange={(e) => setFilterLetter(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="">Todos</MenuItem>
          {letters.map((letter) => (
            <MenuItem key={letter} value={letter}>
              {letter}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <MaterialTable
          materials={filteredMaterials}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal solo se muestra encima del listado */}
      {openModal && (
        <MaterialModal
          open={openModal}
          setOpen={setOpenModal}
          fetchMaterials={fetchMaterials}
          material={selectedMaterial}
        />
      )}
    </Box>
  );
};

export default MaterialsList;
