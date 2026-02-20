import { useEffect, useState } from 'react';
import { 
    Box, TextField, MenuItem, Button, IconButton, Autocomplete,
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
                  <Autocomplete
  fullWidth
  options={productos.filter(p => p.tipo_producto === 'PT')}
  
  // 1. CONCATENACIÓN AL SELECCIONAR: Incluye el Color
  getOptionLabel={(p) => 
    `${p.codigo || ''} - ${p.nombre_producto || ''} [${p.nombre_material || ''}] ${p.nombre_color ? `| Color: ${p.nombre_color}` : ''} ${p.nombre_talla ? `- Talla: ${p.nombre_talla}` : ''}`
  }
  
  value={productos.find(p => p.id_producto === productoFinal) || null}
  onChange={(event, newValue) => {
    setProductoFinal(newValue ? newValue.id_producto : "");
  }}

  // 2. FILTRADO: Ahora también busca por el nombre del color
  filterOptions={(options, state) => {
    const query = state.inputValue.toLowerCase();
    return options.filter(p => 
      (p.nombre_producto && p.nombre_producto.toLowerCase().includes(query)) || 
      (p.codigo && p.codigo.toLowerCase().includes(query)) ||
      (p.nombre_material && p.nombre_material.toLowerCase().includes(query)) ||
      (p.nombre_color && p.nombre_color.toLowerCase().includes(query)) || // <--- FILTRO POR COLOR
      (p.nombre_talla && p.nombre_talla.toLowerCase().includes(query))
    );
  }}

  renderOption={(props, p) => (
    <Box component="li" {...props} key={p.id_producto} sx={{ borderBottom: '1px solid #f1f5f9' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {p.codigo}
          </Typography>
          <Stack direction="row" spacing={1}>
            {/* Badge de Color */}
            {p.nombre_color && (
              <Typography variant="caption" sx={{ bgcolor: '#f1f5f9', color: '#475569', px: 1, borderRadius: 1, fontWeight: 700, border: '1px solid #e2e8f0' }}>
                {p.nombre_color}
              </Typography>
            )}
            <Typography variant="caption" sx={{ bgcolor: '#e0e7ff', color: '#4338ca', px: 1, borderRadius: 1, fontWeight: 700 }}>
              {p.nombre_material}
            </Typography>
            {p.nombre_talla && (
              <Typography variant="caption" sx={{ bgcolor: '#fef3c7', color: '#92400e', px: 1, borderRadius: 1, fontWeight: 700 }}>
                Talla: {p.nombre_talla}
              </Typography>
            )}
          </Stack>
        </Box>
        <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5 }}>
          {p.nombre_producto}
        </Typography>
      </Box>
    </Box>
  )}

  renderInput={(params) => (
    <TextField
      {...params}
      label="Seleccione Producto Terminado"
      variant="outlined"
      placeholder="Buscar por código, nombre, color, material o talla..."
      sx={{ bgcolor: '#f8fafc' }}
      InputLabelProps={{ shrink: true }}
    />
  )}
  noOptionsText="No se encontraron coincidencias"
/>
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
                       <Autocomplete
  fullWidth
  size="small"
  // Filtramos para mostrar solo Materia Prima
  options={productos.filter(p => p.tipo_producto === 'MP')}
  
  // Lo que se muestra en el input al seleccionar (Código - Nombre [Material])
  getOptionLabel={(p) => `${p.codigo || ''} - ${p.nombre_producto || ''} [${p.nombre_material || ''}]`}
  
  // Buscamos el objeto basado en el ID guardado en item.id_producto_material
  value={productos.find(p => p.id_producto === item.id_producto_material) || null}

  // Usamos tu función handleChange original
  onChange={(event, newValue) => {
    handleChange(index, 'id_producto_material', newValue ? newValue.id_producto : '');
  }}

  // FILTRADO INTELIGENTE: Por Nombre, Código o Material
  filterOptions={(options, state) => {
    const query = state.inputValue.toLowerCase();
    return options.filter(p => 
      (p.nombre_producto && p.nombre_producto.toLowerCase().includes(query)) || 
      (p.codigo && p.codigo.toLowerCase().includes(query)) ||
      (p.nombre_material && p.nombre_material.toLowerCase().includes(query))
    );
  }}

  // DISEÑO DE LA LISTA DESPLEGABLE
  renderOption={(props, p) => (
    <Box component="li" {...props} key={p.id_producto} sx={{ borderBottom: '1px solid #f1f5f9' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {p.codigo}
          </Typography>
          <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 800, textTransform: 'uppercase' }}>
            {p.nombre_material}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#64748b' }}>
          {p.nombre_producto} {p.nombre_color ? `| Color: ${p.nombre_color}` : ''}
        </Typography>
      </Box>
    </Box>
  )}

  renderInput={(params) => (
    <TextField
      {...params}
      label="Materia Prima"
      placeholder="Buscar por nombre, código o material..."
      // Si quieres mantener el estilo anterior, puedes agregar variant="standard" aquí
      InputLabelProps={{ shrink: true }}
    />
  )}
  noOptionsText="No se encontraron coincidencias"
/>

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