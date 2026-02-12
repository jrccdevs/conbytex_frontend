import React, { useEffect, useState } from 'react';
import { 
  Box, Button, Typography, CircularProgress, 
  TextField, InputAdornment, Stack, Fade, Chip 
} from '@mui/material';
import { 
  Search, Add, Straighten, 
  FilterList, Numbers 
} from '@mui/icons-material';
import { getSizes, deleteSize } from '../../api/sizesApi';
import { useAuth } from '../../context/AuthContext';
import SizeTable from '../../components/sizes/SizeTable';
import SizeModal from '../../components/sizes/SizeModal';
import Swal from 'sweetalert2';

const SizesList = () => {
  const [sizes, setSizes] = useState([]);
  const [filteredSizes, setFilteredSizes] = useState([]); // Nueva lógica para filtrar
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [search, setSearch] = useState('');

  const { usuario } = useAuth();
  const user = usuario?.user ?? usuario;

  const isAdmin = user?.roles?.some(r => r.slug === 'admin');

  const canCreate =
    isAdmin || user?.permissions?.some(p => p.slug === 'size.create');

  const fetchSizes = async () => {
    setLoading(true);
    try {
      const data = await getSizes();
      setSizes(data || []);
      setFilteredSizes(data || []);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  // SUGERENCIA: Lógica de filtrado en tiempo real
  useEffect(() => {
    const result = sizes.filter((s) =>
      s.nombre_talla.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSizes(result);
  }, [search, sizes]);

  const handleEdit = (size) => {
    setSelectedSize(size);
    setOpenModal(true);
  };

  const handleCreate = () => {
    setSelectedSize(null);
    setOpenModal(true);
  };

  const handleDelete = async (id_talla) => {
    const result = await Swal.fire({
      title: '<span style="color: #0f172a; font-weight: 900;">¿Eliminar talla?</span>',
      html: '<p style="color: #64748b;">Esta acción es irreversible y podría afectar a los productos vinculados.</p>',
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
      await deleteSize(id_talla, localStorage.getItem('token'));
      fetchSizes();
      Swal.fire({
        icon: 'success',
        title: '<span style="color: #0f172a; font-weight: 800;">Eliminado</span>',
        showConfirmButton: false,
        timer: 1500,
        borderRadius: '20px'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el registro.',
        confirmButtonColor: '#0f172a',
        borderRadius: '20px'
      });
    }
  };

  return (
    <Fade in timeout={600}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: 4, gap: 2 
        }}>
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
               <Box sx={{ bgcolor: '#0f172a', p: 1, borderRadius: '12px', display: 'flex' }}>
                  <Straighten sx={{ color: 'white' }} />
               </Box>
               <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
                Tallas
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mt: 0.5, ml: 6 }}>
              Gestión de dimensiones y tallajes para inventario.
            </Typography>
          </Box>

          {canCreate && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreate}
              sx={{ 
                bgcolor: '#0f172a', px: 3, py: 1.2, borderRadius: '12px',
                textTransform: 'none', fontWeight: 700,
                boxShadow: '0 8px 16px rgba(15, 23, 42, 0.15)',
                '&:hover': { bgcolor: '#334155' }
              }}
            >
              Nueva Talla
            </Button>
          )}
        </Box>

        {/* BUSCADOR SUGERIDO */}
        <Box sx={{ 
          bgcolor: 'white', p: 2, borderRadius: '20px', mb: 3, 
          border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', gap: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <TextField
            placeholder="Buscar por nombre de talla..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ 
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: '#f8fafc',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: '#cbd5e1' },
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
          />
          
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip 
              icon={<Numbers sx={{ fontSize: '16px !important' }} />} 
              label={`${filteredSizes.length} Registros`} 
              variant="outlined"
              sx={{ fontWeight: 700, borderRadius: '10px', color: '#64748b' }}
            />
            <Box sx={{ color: '#e2e8f0', fontSize: '20px' }}>|</Box>
            <FilterList sx={{ color: '#94a3b8' }} />
          </Stack>
        </Box>

        {/* TABLA O CARGA */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#0f172a' }} />
          </Box>
        ) : (
          <SizeTable 
            sizes={filteredSizes} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}

        {/* MODAL */}
        <SizeModal
          open={openModal}
          setOpen={setOpenModal}
          fetchSizes={fetchSizes}
          size={selectedSize}
        />
      </Box>
    </Fade>
  );
};

export default SizesList;