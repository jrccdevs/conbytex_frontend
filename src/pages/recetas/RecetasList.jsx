import { useEffect, useState, useCallback } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRecetas, getRecetasByProducto, deleteReceta } from '../../api/recetasApi';
import RecetaTable from '../../components/recetas/RecetaTable';
import RecetaViewModal from '../../components/recetas/RecetaViewModal';

const RecetasList = () => {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedReceta, setSelectedReceta] = useState(null);

  const navigate = useNavigate();
  const { usuario } = useAuth();

  // Normalización del usuario y permisos
  const user = usuario?.user ?? usuario;
  const isAdmin = user?.roles?.some(r => r.slug === 'admin');
  const hasPermission = (perm) => user?.permissions?.some(p => p.slug === perm);

  const canCreate = isAdmin || hasPermission('recetas.create');

  // Función para obtener los datos de la API
  const fetchRecetas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecetas();
      setRecetas(data);
    } catch (error) {
      console.error("Error al cargar recetas:", error);
      // El 403 ahora se captura aquí si el interceptor deja pasar el error
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect corregido: sin el console.log que duplicaba la ejecución
  useEffect(() => {
    fetchRecetas();
  }, [fetchRecetas]);

  const handleDelete = async (id_producto) => {
    const result = await Swal.fire({
      title: '¿Eliminar receta completa?',
      text: "Se borrarán todos los materiales asociados a este producto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      // Filtramos los registros que pertenecen a ese producto para borrarlos
      const recetasProducto = recetas.filter(r => r.id_producto === id_producto);
      
      // Ya no pasamos el 'token' manualmente, el clienteApi lo pone solo
      for (const r of recetasProducto) {
        await deleteReceta(r.id_receta);
      }

      await fetchRecetas(); // Refrescar tabla
      Swal.fire('Eliminado', 'Receta eliminada correctamente', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar la receta', 'error');
    }
  };

  const handleView = async (id_producto) => {
    try {
      // Ya no pasamos el 'token' manualmente
      const data = await getRecetasByProducto(id_producto);
      
      if (data && data.length > 0) {
        setSelectedReceta({
          producto_terminado: data[0].producto_terminado,
          items: data.map(r => ({
            id_receta: r.id_receta,
            materia_prima: r.materia_prima,
            cantidad: r.cantidad
          }))
        });
        setOpenViewModal(true);
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo obtener el detalle', 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>
            Recetas
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Gestión de fórmulas y materiales
          </Typography>
        </Box>
        
        {canCreate && (
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => navigate('/recetas/nuevo')}
            sx={{ 
              bgcolor: '#0f172a', 
              borderRadius: '10px', 
              px: 3,
              textTransform: 'none',
              fontWeight: 700,
              '&:hover': { bgcolor: '#334155' }
            }}
          >
            Nueva Receta
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={30} sx={{ color: '#0f172a' }} />
        </Box>
      ) : (
        <RecetaTable
          recetas={recetas}
          onView={handleView}
          onDelete={handleDelete}
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