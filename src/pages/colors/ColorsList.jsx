import React, { useEffect, useState } from 'react';
import { 
  Box, Button, Typography, CircularProgress, 
  TextField, InputAdornment, Stack, Fade 
} from '@mui/material';
import { Search, Add, ColorLens, Tune } from '@mui/icons-material';
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
  const user = usuario?.user ?? usuario;

  const isAdmin = user?.roles?.some(r => r.slug === 'admin');

  const canCreate =
    isAdmin || user?.permissions?.some(p => p.slug === 'color.create');

  const fetchColors = async () => {
    setLoading(true);
    try {
      const data = await getColors();
      setColors(data || []);
      setFilteredColors(data || []);
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
      title: '<span style="color: #0f172a; font-weight: 900;">¿Eliminar color?</span>',
      html: '<p style="color: #64748b;">Esta acción removerá el color del catálogo y no podrá ser revertida.</p>',
      icon: 'warning',
      iconColor: '#f59e0b',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar color',
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
      await deleteColor(id_color, localStorage.getItem('token'));
      fetchColors();
      Swal.fire({
        icon: 'success',
        title: '<span style="color: #0f172a; font-weight: 800;">Eliminado</span>',
        showConfirmButton: false,
        timer: 1500,
        borderRadius: '20px',
        iconColor: '#3b82f6'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el color. Es posible que esté asignado a un producto.',
        confirmButtonColor: '#0f172a',
        borderRadius: '20px'
      });
    }
  };

  const handleCreate = () => {
    setSelectedColor(null);
    setOpenModal(true);
  };

  return (
    <Fade in timeout={600}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* CABECERA DINÁMICA */}
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
               <Box sx={{ bgcolor: '#eff6ff', p: 1, borderRadius: '10px', display: 'flex' }}>
                  <ColorLens sx={{ color: '#3b82f6', fontSize: 28 }} />
               </Box>
               <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
                Catálogo de Colores
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mt: 0.5, ml: 6 }}>
              Administra las variantes cromáticas para la clasificación de productos.
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
              Nuevo Color
            </Button>
          )}
        </Box>

        {/* BARRA DE FILTRO MODERNA */}
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
            placeholder="Buscar color por nombre..."
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

        {/* ÁREA DE CONTENIDO */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
            <CircularProgress size={40} sx={{ color: '#0f172a' }} />
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Cargando catálogo...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ animation: 'fadeInUp 0.6s ease-out' }}>
            <ColorTable 
              colors={filteredColors} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          </Box>
        )}

        {/* COMPONENTE MODAL */}
        <ColorModal
          open={openModal}
          setOpen={setOpenModal}
          fetchColors={fetchColors}
          color={selectedColor}
        />

        {/* KEYFRAMES ANIMACIÓN */}
        <style>
          {`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
      </Box>
    </Fade>
  );
};

export default ColorsList;