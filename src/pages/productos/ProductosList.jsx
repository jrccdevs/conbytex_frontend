import { useEffect, useState } from 'react';
import { Box, Button, Typography, TextField, CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';
import { getProductos, deleteProducto } from '../../api/productosApi';
import { useAuth } from '../../context/AuthContext';
import ProductoTable from '../../components/productos/ProductoTable';
import ProductoModal from '../../components/productos/ProductoModal';

const ProductosList = () => {
  const [productos, setProductos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const { usuario } = useAuth();

  const fetchProductos = async () => {
    setLoading(true);
    const data = await getProductos();
    setProductos(data);
    setFiltered(data);
    setLoading(false);
  };

  useEffect(() => { fetchProductos(); }, []);

  useEffect(() => {
    setFiltered(
      productos.filter(p =>
        p.nombre_producto.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, productos]);

  const handleDelete = async (id) => {
    const r = await Swal.fire({
      title: '¿Eliminar producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
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
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Productos</Typography>
        {usuario?.role === 'admin' && (
          <Button variant="contained" onClick={() => { setSelected(null); setOpenModal(true); }}>
            Nuevo Producto
          </Button>
        )}
      </Box>

      <TextField
        fullWidth
        placeholder="Buscar producto..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {loading ? <CircularProgress /> :
        <ProductoTable productos={filtered} onEdit={p => { setSelected(p); setOpenModal(true); }} onDelete={handleDelete} />
      }

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
