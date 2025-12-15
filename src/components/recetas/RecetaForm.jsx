import { Box, TextField, IconButton, Button, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createReceta, updateReceta, deleteReceta } from '../../api/recetasApi';
import { getProductos } from '../../api/productosApi';

const RecetaForm = ({ recetas, fetchRecetas }) => {
  const [productos, setProductos] = useState([]);
  const [items, setItems] = useState([]);
  const [itemsEliminados, setItemsEliminados] = useState([]);
  const id_producto = recetas[0]?.id_producto;
  const token = localStorage.getItem('token');

  // Cargar productos
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

  // Inicializar items con recetas existentes
  useEffect(() => {
    setItems(
      recetas.map((r) => ({
        id_receta: r.id_receta,
        id_producto_material: r.id_producto_material,
        cantidad: r.cantidad
      }))
    );
  }, [recetas]);

  const handleAddItem = () =>
    setItems([...items, { id_producto_material: '', cantidad: '' }]);

  const handleRemoveItem = (index) => {
    const item = items[index];
    if (item.id_receta) {
      setItemsEliminados([...itemsEliminados, item.id_receta]);
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async () => {
    try {
      // 🔹 Eliminar items eliminados
      for (const id of itemsEliminados) {
        await deleteReceta(id, token);
      }
      setItemsEliminados([]);

      // 🔹 Actualizar o crear
      for (const item of items) {
        
        // CORRECCIÓN: Creamos el objeto de datos que incluye id_producto
        // para cumplir con la validación del backend.
        const dataToSave = {
            id_producto, // Aseguramos que se envía el ID del producto terminado
            id_producto_material: item.id_producto_material,
            cantidad: item.cantidad
        };

        if (item.id_receta) {
          // Actualizar
          await updateReceta(item.id_receta, dataToSave, token);
        } else {
          // Crear
          await createReceta(dataToSave, token);
        }
      }

      Swal.fire('Correcto', 'Receta actualizada', 'success');
      fetchRecetas();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar', 'error');
    }
  };

  // 🔹 Mostrar etiqueta clara de materia prima
  const renderMateriaPrimaLabel = (id) => {
    const p = productos.find((prod) => prod.id_producto === id);
    if (!p) return '';
    return [p.nombre_producto, p.nombre_color, p.nombre_material, p.nombre_unidad]
      .filter(Boolean)
      .join(' | ');
  };

  return (
    <Box>
      {items.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <TextField
            select
            label="Materia Prima"
            value={item.id_producto_material}
            onChange={(e) => handleChange(index, 'id_producto_material', e.target.value)}
            fullWidth
          >
            <MenuItem value="" />
            {productos
              .filter((p) => p.tipo_producto === 'MP')
              .map((p) => (
                <MenuItem key={p.id_producto} value={p.id_producto}>
                  {renderMateriaPrimaLabel(p.id_producto)}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            label="Cantidad"
            type="number"
            value={item.cantidad}
            onChange={(e) => handleChange(index, 'cantidad', e.target.value)}
            sx={{ width: 150 }}
          />
          <IconButton color="error" onClick={() => handleRemoveItem(index)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Button startIcon={<AddIcon />} onClick={handleAddItem}>
        Agregar Materia Prima
      </Button>
      <Button variant="contained" onClick={handleSubmit} sx={{ ml: 2 }}>
        Guardar
      </Button>
    </Box>
  );
};

export default RecetaForm;