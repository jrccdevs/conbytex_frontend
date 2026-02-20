import { useEffect, useState } from 'react';
import { Box, Button, Typography, TextField, CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';
import { getProductos, deleteProducto } from '../../api/productosApi';
import { useAuth } from '../../context/AuthContext';
import ProductoTable from '../../components/productos/ProductoTable';
import ProductoModal from '../../components/productos/ProductoModal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ProductosList = () => {
  const [productos, setProductos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const { usuario } = useAuth();
  
  const user = usuario?.user ?? usuario;

  const isAdmin = user?.roles?.some(r => r.slug === 'admin');

  const canCreate =
    isAdmin || user?.permissions?.some(p => p.slug === 'productos.create');

 
    const fetchProductos = async () => {
    setLoading(true);
    const data = await getProductos();
    setProductos(data);
    setFiltered(data);
    setLoading(false);
  };

  useEffect(() => { fetchProductos(); }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      productos.filter(p =>
        // Busca en el nombre
        p.nombre_producto.toLowerCase().includes(term) || 
        // Busca en el código (asegurando que el código exista para evitar errores)
        (p.codigo && p.codigo.toLowerCase().includes(term))
      )
    );
  }, [search, productos]);

  const handleDelete = async (id) => {
    const r = await Swal.fire({
      title: '¿Eliminar producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b'
    });
    if (!r.isConfirmed) return;

    try {
      await deleteProducto(id, localStorage.getItem('token'));
      fetchProductos();
      Swal.fire('Eliminado', 'Producto eliminado', 'success');
    } catch {
      Swal.fire('Error', 'No se puede eliminar (llaves foráneas)', 'error');
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
      {/* Encabezado con Estilo */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Productos
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Gestiona el inventario y catálogo de activos
          </Typography>
        </Box>
        
        {canCreate && (
          <Button 
            variant="contained" 
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => { setSelected(null); setOpenModal(true); }}
            sx={{ 
              borderRadius: '12px', 
              textTransform: 'none', 
              fontWeight: 700,
              bgcolor: '#0f172a',
              '&:hover': { bgcolor: '#334155' }
            }}
          >
            Nuevo Producto
          </Button>
        )}
      </Box>

      {/* Buscador Estilizado */}
      <TextField
        fullWidth
        placeholder="Buscar por nombre de producto..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ 
          mb: 4,
          '& .MuiOutlinedInput-root': {
            borderRadius: '14px',
            bgcolor: '#fff',
            '& fieldset': { borderColor: '#e2e8f0' },
          }
        }}
      />

      {/* CONTENEDOR DE SCROLL: Esto arregla la visibilidad de la columna GESTIÓN */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>
      ) : (
        <Box sx={{ 
          width: '100%', 
          overflowX: 'auto', // Permite scroll horizontal si la tabla es muy ancha
          borderRadius: '24px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}>
          <ProductoTable 
            productos={filtered} 
            onEdit={p => { setSelected(p); setOpenModal(true); }} 
            onDelete={handleDelete} 
          />
        </Box>
      )}

      {openModal && (
        <ProductoModal
          open={openModal}
          setOpen={setOpenModal}
          fetchProductos={fetchProductos}
          producto={selected}
        />
      )}
    </Box>
  );
};

export default ProductosList;