import { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { getRecetas, getRecetasByProducto, deleteReceta } from '../../api/recetasApi';
import RecetaTable from '../../components/recetas/RecetaTable';
import RecetaModal from '../../components/recetas/RecetaModal';
import RecetaViewModal from '../../components/recetas/RecetaViewModal';

const RecetasList = () => {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedReceta, setSelectedReceta] = useState(null);

  const { usuario } = useAuth();
  const token = localStorage.getItem('token');

  const fetchRecetas = async () => {
    setLoading(true);
    try {
      const data = await getRecetas();
      setRecetas(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecetas();
  }, []);

  const handleDelete = async (id_producto) => {
    const result = await Swal.fire({
      title: '¿Eliminar receta completa?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar'
    });
    if (!result.isConfirmed) return;

    try {
      // Eliminar todas las recetas de ese producto
      const recetasProducto = recetas.filter(r => r.id_producto === id_producto);
      for (const r of recetasProducto) {
        await deleteReceta(r.id_receta, token);
      }
      fetchRecetas();
      Swal.fire('Eliminado', 'Receta eliminada correctamente', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar la receta', 'error');
    }
  };

  const handleView = async (id_producto) => {
    try {
      const data = await getRecetasByProducto(id_producto);
      setSelectedReceta({
        producto_terminado: data[0].producto_terminado,
        items: data.map(r => ({
          id_receta: r.id_receta,
          materia_prima: r.materia_prima,
          cantidad: r.cantidad
        }))
      });
      setOpenViewModal(true);
    } catch (error) {
      Swal.fire('Error', 'No se pudo obtener la receta', 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Recetas</Typography>
        {usuario?.role === 'admin' && (
          <Button variant="contained" onClick={() => setOpenModal(true)}>
            Nueva Receta
          </Button>
        )}
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <RecetaTable
          recetas={recetas}
          onView={handleView}
          onDelete={handleDelete}
        />
      )}

      {openModal && (
        <RecetaModal
          open={openModal}
          setOpen={setOpenModal}
          fetchRecetas={fetchRecetas}
        />
      )}

      {openViewModal && selectedReceta && (
        <RecetaViewModal
          open={openViewModal}
          setOpen={setOpenViewModal}
          receta={selectedReceta}
        />
      )}
    </Box>
  );
};

export default RecetasList;
