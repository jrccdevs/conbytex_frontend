import { useEffect, useState } from 'react';
import { 
    Box, TextField, MenuItem, Button, IconButton, 
    Typography, Container, Paper, Stack, Divider, Grid, Avatar, Fade
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { createReceta } from '../../api/recetasApi';
import { getProductos } from '../../api/productosApi';

const RecetaCreateForm = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [productoFinal, setProductoFinal] = useState('');
  const [items, setItems] = useState([
    { id_producto_material: '', cantidad: '' }
  ]);

  const token = localStorage.getItem('token');

  // 🔹 Cargar productos (Igual al Modal)
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

  // 🔹 Mostrar etiqueta clara de materia prima (Igual al Modal)
  const renderMateriaPrimaLabel = (p) => {
    return [
      p.nombre_producto,
      p.nombre_color,
      p.nombre_material,
      p.nombre_unitario // o p.nombre_unidad según tu API
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

  // 🔹 Lógica de envío (Igual al Modal pero con navegación al final)
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

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
      // 🔹 Se crea una receta por cada materia prima (Lógica Modal)
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

      await Swal.fire({
        title: 'Correcto',
        text: 'Receta creada correctamente',
        icon: 'success',
        confirmButtonColor: '#0f172a'
      });
      
      navigate('/recetas'); // Navegamos de vuelta a la lista
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear la receta', 'error');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#ffffff' }}>
      {/* PANEL LATERAL INFORMATIVO */}
      <Box sx={{ 
          width: { xs: 0, md: '320px' }, p: 5, display: { xs: 'none', md: 'flex' }, 
          flexDirection: 'column', borderRight: '1px solid #f1f5f9', position: 'fixed', height: '100vh'
      }}>
        <IconButton onClick={() => navigate('/recetas')} sx={{ alignSelf: 'flex-start', mb: 6, border: '1px solid #f1f5f9' }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        
        <Avatar sx={{ bgcolor: '#0f172a', mb: 3, width: 48, height: 48 }}>
          <ConstructionIcon />
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
          Nueva <span style={{ color: '#3b82f6' }}>Receta</span>
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8 }}>
          Defina la composición técnica del producto. Asegúrese de ingresar las cantidades exactas para un control de inventario preciso.
        </Typography>
      </Box>

      {/* CUERPO DEL FORMULARIO */}
      <Box sx={{ flexGrow: 1, ml: { md: '320px' } }}>
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 8 } }}>
          <Fade in timeout={800}>
            <Box>
              <Box sx={{ mb: 6 }}>
                <Typography variant="overline" sx={{ color: '#3b82f6', fontWeight: 800, letterSpacing: 2 }}>
                  INGENIERÍA DE PRODUCTO
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, fontSize:40, letterSpacing: '-1.5px', mt: 1 }}>
                  Configurar Receta
                </Typography>
              </Box>

              <Stack spacing={6}>
                {/* 🔹 SECCIÓN: PRODUCTO TERMINADO */}
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    1. Producto Objetivo
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    label="Seleccione Producto Terminado"
                    value={productoFinal}
                    onChange={(e) => setProductoFinal(e.target.value)}
                    variant="outlined"
                    sx={{ bgcolor: '#f8fafc' }}
                  >
                    <MenuItem value=""><em>Seleccione un producto</em></MenuItem>
                    {productos
                      .filter(p => p.tipo_producto === 'PT')
                      .map(p => (
                        <MenuItem key={p.id_producto} value={p.id_producto}>
                          {p.nombre_producto}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>

                <Divider />

                {/* 🔹 SECCIÓN: MATERIAS PRIMAS */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      2. Materias Primas / Insumos
                    </Typography>
                    <Button 
                      startIcon={<AddIcon />} 
                      onClick={handleAddItem}
                      variant="text"
                      sx={{ fontWeight: 700 }}
                    >
                      Añadir Fila
                    </Button>
                  </Stack>

                  <Stack spacing={2}>
                    {items.map((item, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          display: 'flex', 
                          gap: 2, 
                          p: 2, 
                          bgcolor: '#f8fafc', 
                          borderRadius: '12px',
                          border: '1px solid #f1f5f9',
                          alignItems: 'center' 
                        }}
                      >
                        <TextField
                          select
                          label="Materia Prima"
                          value={item.id_producto_material}
                          onChange={(e) => handleChange(index, 'id_producto_material', e.target.value)}
                          fullWidth
                          size="small"
                        >
                          <MenuItem value=""><em>Seleccionar material</em></MenuItem>
                          {productos
                            .filter(p => p.tipo_producto === 'MP')
                            .map(p => (
                              <MenuItem key={p.id_producto} value={p.id_producto}>
                                {renderMateriaPrimaLabel(p)}
                              </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                          label="Cant."
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => handleChange(index, 'cantidad', e.target.value)}
                          sx={{ width: 120 }}
                          size="small"
                        />

                        <IconButton 
                          color="error" 
                          onClick={() => handleRemoveItem(index)}
                          disabled={items.length === 1}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Box sx={{ pt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button 
                      onClick={() => navigate('/recetas')}
                      sx={{ fontWeight: 700, color: '#64748b' }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                      variant="contained" 
                      onClick={handleSubmit}
                      startIcon={<CheckCircleIcon />}
                      sx={{ 
                        bgcolor: '#0f172a', 
                        px: 4, 
                        py: 1.5, 
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontWeight: 700
                      }}
                    >
                      Guardar Receta
                    </Button>
                </Box>
              </Stack>
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default RecetaCreateForm;