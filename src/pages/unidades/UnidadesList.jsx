import React, { useEffect, useState } from 'react';
import { 
  Box, Button, Typography, CircularProgress, 
  TextField, InputAdornment, Stack, Fade, Paper 
} from '@mui/material';
import { Search, Add, Straighten, Tune } from '@mui/icons-material';
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
  const user = usuario?.user ?? usuario;

  const isAdmin = user?.roles?.some(r => r.slug === 'admin');

  const canCreate =
    isAdmin || user?.permissions?.some(p => p.slug === 'unidad.create');


  const fetchUnidades = async () => {
    setLoading(true);
    try {
      const data = await getUnidades();
      setUnidades(data || []);
      setFilteredUnidades(data || []);
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
      title: '<span style="color: #0f172a; font-weight: 900;">¿Eliminar unidad?</span>',
      html: '<p style="color: #64748b;">Esta acción es permanente y podría afectar la visualización de los productos asociados.</p>',
      icon: 'warning',
      iconColor: '#f59e0b',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#f1f5f9',
      reverseButtons: true,
      background: '#ffffff',
      borderRadius: '24px',
      padding: '2.5em',
    });

    if (!result.isConfirmed) return;

    try {
      await deleteUnidad(id_unidad, localStorage.getItem('token'));
      fetchUnidades();
      Swal.fire({
        icon: 'success',
        title: '<span style="color: #0f172a; font-weight: 800;">Eliminado</span>',
        text: 'La unidad fue removida del sistema.',
        showConfirmButton: false,
        timer: 1500,
        borderRadius: '20px'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la unidad. Es posible que esté en uso.',
        confirmButtonColor: '#0f172a',
        borderRadius: '20px'
      });
    }
  };

  const handleCreate = () => {
    setSelectedUnidad(null);
    setOpenModal(true);
  };

  return (
    <Fade in timeout={600}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HEADER DE LA PÁGINA */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: 4,
          gap: 2
        }}>
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
               <Box sx={{ bgcolor: '#0f172a', p: 1, borderRadius: '10px', display: 'flex' }}>
                  <Straighten sx={{ color: 'white', fontSize: 24 }} />
               </Box>
               <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
                Unidades de Medida
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mt: 0.5, ml: 6 }}>
              Configuración de magnitudes para el control de inventario.
            </Typography>
          </Box>

          {canCreate && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreate}
              sx={{ 
                bgcolor: '#0f172a',
                px: 3,
                py: 1.2,
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: '0 8px 16px rgba(15, 23, 42, 0.15)',
                '&:hover': { bgcolor: '#334155' }
              }}
            >
              Nueva Unidad
            </Button>
          )}
        </Box>

        {/* BARRA DE BÚSQUEDA TIPO TOOLBAR */}
        <Box sx={{ 
          bgcolor: 'white', 
          p: 1.5, 
          borderRadius: '16px', 
          mb: 3, 
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <TextField
            placeholder="Filtrar por nombre de medida..."
            variant="standard"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#94a3b8', ml: 1, mr: 1 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Tune sx={{ color: '#cbd5e1', mr: 1, fontSize: 20 }} />
                </InputAdornment>
              )
            }}
            sx={{ px: 1 }}
          />
        </Box>

        {/* CONTENIDO PRINCIPAL */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#0f172a' }} />
          </Box>
        ) : (
          <Box sx={{ animation: 'slideUp 0.5s ease-out' }}>
            <UnidadTable 
              unidades={filteredUnidades} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          </Box>
        )}

        {/* MODAL */}
        <UnidadModal
          open={openModal}
          setOpen={setOpenModal}
          fetchUnidades={fetchUnidades}
          unidad={selectedUnidad}
        />

        {/* ANIMACIÓN CSS */}
        <style>
          {`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(15px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
      </Box>
    </Fade>
  );
};

export default UnidadesList;