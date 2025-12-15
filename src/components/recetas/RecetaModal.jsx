import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Box,
    MenuItem
  } from '@mui/material';
  import AddIcon from '@mui/icons-material/Add';
  import DeleteIcon from '@mui/icons-material/Delete';
  import { useEffect, useState } from 'react';
  import Swal from 'sweetalert2';
  
  import { createReceta } from '../../api/recetasApi';
  import { getProductos } from '../../api/productosApi';
  
  const RecetaModal = ({ open, setOpen, fetchRecetas }) => {
    const [productos, setProductos] = useState([]);
    const [productoFinal, setProductoFinal] = useState('');
    const [items, setItems] = useState([
      { id_producto_material: '', cantidad: '' }
    ]);
  
    const token = localStorage.getItem('token');
  
    // 🔹 Cargar productos
    useEffect(() => {
      const loadProductos = async () => {
        try {
          const data = await getProductos();
          setProductos(data);
        } catch (error) {
          console.error(error);
        }
      };
      loadProductos();
    }, []);
  
    // 🔹 Mostrar etiqueta clara de materia prima
    const renderMateriaPrimaLabel = (p) => {
      return [
        p.nombre_producto,
        p.nombre_color,
        p.nombre_material,
        p.nombre_unidad
      ].filter(Boolean).join(' | ');
    };
  
    const handleAddItem = () => {
      setItems([...items, { id_producto_material: '', cantidad: '' }]);
    };
  
    const handleRemoveItem = (index) => {
      if (items.length === 1) return;
      setItems(items.filter((_, i) => i !== index));
    };
  
    const handleChange = (index, field, value) => {
      const newItems = [...items];
      newItems[index][field] = value;
      setItems(newItems);
    };
  
    const handleSubmit = async () => {
      if (!productoFinal) {
        Swal.fire('Error', 'Debe seleccionar un producto terminado', 'error');
        return;
      }
  
      for (const item of items) {
        if (!item.id_producto_material || !item.cantidad) {
          Swal.fire('Error', 'Complete todas las materias primas', 'error');
          return;
        }
      }
  
      try {
        // 🔹 Se crea una receta por cada materia prima
        for (const item of items) {
          await createReceta(
            {
              id_producto: productoFinal,
              id_producto_material: item.id_producto_material,
              cantidad: item.cantidad
            },
            token
          );
        }
  
        Swal.fire('Correcto', 'Receta creada correctamente', 'success');
        fetchRecetas();
        setOpen(false);
        setProductoFinal('');
        setItems([{ id_producto_material: '', cantidad: '' }]);
      } catch (error) {
        Swal.fire('Error', 'No se pudo crear la receta', 'error');
      }
    };
  
    return (
      <Dialog open={open} maxWidth="md" fullWidth>
        <DialogTitle>Nueva Receta</DialogTitle>
  
        <DialogContent>
  
          {/* 🔹 Producto Terminado */}
          <TextField
            select
            fullWidth
            label="Producto Terminado"
            value={productoFinal}
            onChange={(e) => setProductoFinal(e.target.value)}
            sx={{ mb: 3 }}
          >
            <MenuItem value="" />
            {productos
              .filter(p => p.tipo_producto === 'PT')
              .map(p => (
                <MenuItem key={p.id_producto} value={p.id_producto}>
                  {p.nombre_producto}
                </MenuItem>
              ))}
          </TextField>
  
          {/* 🔹 Materias primas */}
          {items.map((item, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}
            >
              <TextField
                select
                label="Materia Prima"
                value={item.id_producto_material}
                onChange={(e) =>
                  handleChange(index, 'id_producto_material', e.target.value)
                }
                fullWidth
              >
                <MenuItem value="" />
                {productos
                  .filter(p => p.tipo_producto === 'MP')
                  .map(p => (
                    <MenuItem key={p.id_producto} value={p.id_producto}>
                      {renderMateriaPrimaLabel(p)}
                    </MenuItem>
                  ))}
              </TextField>
  
              <TextField
                label="Cantidad"
                type="number"
                value={item.cantidad}
                onChange={(e) =>
                  handleChange(index, 'cantidad', e.target.value)
                }
                sx={{ width: 150 }}
              />
  
              <IconButton
                color="error"
                onClick={() => handleRemoveItem(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
  
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddItem}
          >
            Agregar materia prima
          </Button>
  
        </DialogContent>
  
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Guardar Receta
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default RecetaModal;
  