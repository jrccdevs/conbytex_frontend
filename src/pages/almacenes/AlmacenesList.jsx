import { Box, Button, TextField, Typography, InputAdornment, Stack, Fade } from '@mui/material';
import { useEffect, useState } from 'react';
import { Search, Add, Warehouse, Apartment } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { getAlmacenes, deleteAlmacen } from '../../api/almacenesApi';
import { useAuth } from '../../context/AuthContext';
import AlmacenModal from '../../components/almacenes/AlmacenModal';
import AlmacenTable from '../../components/almacenes/AlmacenTable';

const AlmacenesList = () => {
  const [almacenes, setAlmacenes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [almacenEdit, setAlmacenEdit] = useState(null);
  const { usuario } = useAuth();
  const user = usuario?.user ?? usuario;

  const isAdmin = user?.roles?.some(r => r.slug === 'admin');

  const canCreate =
    isAdmin || user?.permissions?.some(p => p.slug === 'almacen.create');

  const fetchAlmacenes = async () => {
    try {
      const data = await getAlmacenes();
      setAlmacenes(data || []);
      setFiltered(data || []);
    } catch (error) {
      console.error("Error al cargar almacenes", error);
    }
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
      title: '<span style="color: #0f172a; font-weight: 900; font-size: 1.5rem;">¿Eliminar almacén?</span>',
      html: `
        <div style="margin-top: 10px;">
          <p style="color: #64748b; font-weight: 500; font-size: 1rem; margin-bottom: 5px;">
            Estás a punto de eliminar:
          </p>
          <b style="color: #0f172a; font-size: 1.1rem; text-transform: uppercase;">
            ${almacen.nombre_almacen}
          </b>
          <p style="color: #ef4444; font-weight: 700; font-size: 0.85rem; margin-top: 15px; background: #fef2f2; padding: 10px; border-radius: 12px; border: 1px dashed #fecaca;">
            ⚠️ Esta acción es irreversible y podría afectar el inventario asociado.
          </p>
        </div>
      `,
      icon: 'warning',
      iconColor: '#f59e0b',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // Rojo vibrante para peligro
      cancelButtonColor: '#f1f5f9',  // Fondo gris muy claro para el cancelar
      confirmButtonText: 'Sí, eliminar registro',
      cancelButtonText: '<span style="color: #475569; font-weight: 700;">Cancelar</span>',
      reverseButtons: true, // Pone el botón de cancelar a la izquierda (UX estándar)
      background: '#ffffff',
      borderRadius: '24px',
      padding: '2.5em',
      customClass: {
        confirmButton: 'custom-confirm-delete',
        cancelButton: 'custom-cancel-delete'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAlmacen(
            almacen.id_almacen,
            localStorage.getItem('token')
          );
  
          // Alerta de éxito minimalista (Toast)
          Swal.fire({
            icon: 'success',
            title: '<span style="color: #0f172a; font-weight: 800;">Registro Eliminado</span>',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            borderRadius: '20px',
            iconColor: '#3b82f6',
            background: '#ffffff',
          });
          
          fetchAlmacenes();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: '<span style="color: #ef4444; font-weight: 800;">Error</span>',
            text: 'No se pudo eliminar el registro. Intente de nuevo.',
            confirmButtonColor: '#0f172a',
            borderRadius: '20px'
          });
        }
      }
    });
  };

  return (
    <Fade in timeout={500}>
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
            <Stack direction="row" spacing={1} alignItems="center">
               <Apartment sx={{ color: '#0f172a', fontSize: 32 }} />
               <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
                Almacenes
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mt: 0.5 }}>
              Administra las ubicaciones físicas y puntos de inventario.
            </Typography>
          </Box>
          {canCreate && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setAlmacenEdit(null);
              setOpen(true);
            }}
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
            Nuevo Almacén
          </Button>
          )}
        </Box>

        {/* BARRA DE HERRAMIENTAS (FILTRO) */}
        <Box sx={{ 
          bgcolor: 'white', 
          p: 2, 
          borderRadius: '16px', 
          mb: 3, 
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center'
        }}>
          <TextField
            placeholder="Buscar por nombre de almacén..."
            variant="standard"
            fullWidth
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#94a3b8', mr: 1 }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              px: 2,
              '& .MuiInputBase-input': { 
                fontWeight: 500,
                fontSize: '0.95rem'
              } 
            }}
          />
        </Box>

        {/* TABLA DE RESULTADOS */}
        <Box sx={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <AlmacenTable
            almacenes={filtered}
            onEdit={(a) => {
              setAlmacenEdit(a);
              setOpen(true);
            }}
            onDelete={handleDelete}
          />
        </Box>

        {/* MODAL INTEGRADO */}
        <AlmacenModal
          open={open}
          setOpen={setOpen}
          fetchAlmacenes={fetchAlmacenes}
          almacen={almacenEdit}
        />

        {/* ESTILOS EXTRA PARA ANIMACIÓN */}
        <style>
          {`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
      </Box>
    </Fade>
  );
};

export default AlmacenesList;