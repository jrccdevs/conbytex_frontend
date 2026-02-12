import { useState, useEffect } from 'react';
import { 
    Box, TextField, MenuItem, Grid, Typography, 
    Avatar, IconButton, Fade, Button, Container, Stack, Divider, Paper
} from '@mui/material';
import { 
    ArrowBack, Add, DeleteOutline, RestaurantMenu, 
    Science, CheckCircle, Scale, Save, WarningAmber
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createReceta, updateReceta, deleteReceta } from '../../api/recetasApi';
import { getProductos } from '../../api/productosApi';

const RecetaEditForm = ({ recetas, fetchRecetas }) => {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [items, setItems] = useState([]);
    const [itemsEliminados, setItemsEliminados] = useState([]);
    
    const id_producto = recetas[0]?.id_producto;
    const nombre_producto = recetas[0]?.producto_terminado || "Producto";
    const token = localStorage.getItem('token');

    // 1. Cargar productos (Mantenemos tu lógica)
    useEffect(() => {
        const loadProductos = async () => {
            try {
                const data = await getProductos();
                setProductos(data);
            } catch (error) { console.error(error); }
        };
        loadProductos();
    }, []);

    // 2. Inicializar items (Mantenemos tu lógica)
    useEffect(() => {
        if (recetas.length > 0) {
            setItems(
                recetas.map((r) => ({
                    id_receta: r.id_receta,
                    id_producto_material: r.id_producto_material,
                    cantidad: r.cantidad
                }))
            );
        }
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

    // 3. Submit con tu lógica de Update/Create/Delete
    const handleSubmit = async (e) => {
        if(e) e.preventDefault();
        try {
            for (const id of itemsEliminados) {
                await deleteReceta(id, token);
            }
            setItemsEliminados([]);

            for (const item of items) {
                const dataToSave = {
                    id_producto,
                    id_producto_material: item.id_producto_material,
                    cantidad: item.cantidad
                };

                if (item.id_receta) {
                    await updateReceta(item.id_receta, dataToSave, token);
                } else {
                    await createReceta(dataToSave, token);
                }
            }

            Swal.fire({ title: '¡Actualizado!', icon: 'success', confirmButtonColor: '#0f172a' });
            fetchRecetas();
            navigate('/recetas'); // Redirigir al terminar
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo actualizar la receta', 'error');
        }
    };

    const renderMateriaPrimaLabel = (id) => {
        const p = productos.find((prod) => prod.id_producto === id);
        if (!p) return '';
        return [p.nombre_producto, p.nombre_color, p.nombre_material, p.nombre_unidad]
            .filter(Boolean).join(' | ');
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#ffffff' }}>
            {/* PANEL LATERAL DE INFORMACIÓN */}
            <Box sx={{ 
                width: { xs: 0, md: '320px' }, p: 5, display: { xs: 'none', md: 'flex' }, 
                flexDirection: 'column', borderRight: '1px solid #f1f5f9', position: 'fixed', height: '100vh'
            }}>
                <IconButton onClick={() => navigate('/recetas')} sx={{ alignSelf: 'flex-start', mb: 6, border: '1px solid #f1f5f9' }}>
                    <ArrowBack fontSize="small" />
                </IconButton>
                
                <Avatar sx={{ bgcolor: '#f59e0b', mb: 3, width: 48, height: 48 }}>
                    <Save />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
                    Edición de <span style={{ color: '#f59e0b' }}>Receta</span>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8 }}>
                    Estás modificando la composición técnica de <strong>{nombre_producto}</strong>. 
                    Cualquier cambio afectará los costos y el descuento de inventario.
                </Typography>

                <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff7ed', borderRadius: '12px', border: '1px solid #fed7aa', mt: 'auto' }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <WarningAmber sx={{ fontSize: 16, color: '#d97706' }} />
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#d97706' }}>AVISO</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#9a3412' }}>
                        Al eliminar una fila, el cambio será permanente una vez que hagas clic en "Guardar Cambios".
                    </Typography>
                </Paper>
            </Box>

            {/* CUERPO DEL FORMULARIO */}
            <Box sx={{ flexGrow: 1, ml: { md: '320px' } }}>
                <Container maxWidth="md" sx={{ py: { xs: 4, md: 10 }, px: { xs: 2, md: 8 } }}>
                    <Fade in timeout={800}>
                        <Box>
                            <Box sx={{ mb: 8 }}>
                                <Typography variant="overline" sx={{ color: '#f59e0b', fontWeight: 800, letterSpacing: 2 }}>
                                    AJUSTE TÉCNICO
                                </Typography>
                                <Typography variant="h2" sx={{ fontWeight: 700, fontSize:30, letterSpacing: '-2px', mt: 1 }}>
                                    {nombre_producto}
                                </Typography>
                            </Box>

                            <Grid container spacing={6}>
                                <Grid item xs={12}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ bgcolor: '#f8fafc', color: '#f59e0b', border: '1px solid #e2e8f0', width: 32, height: 32 }}>
                                                <Science sx={{ fontSize: 18 }} />
                                            </Avatar>
                                            <Typography variant="h6" sx={{ fontWeight: 800 }}>Insumos de la Receta</Typography>
                                        </Stack>
                                        <Button startIcon={<Add />} onClick={handleAddItem} sx={{ textTransform: 'none', fontWeight: 700 }}>
                                            Agregar Material
                                        </Button>
                                    </Stack>

                                    <Stack spacing={4}>
                                        {items.map((item, index) => (
                                            <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="flex-end">
                                                <TextField
                                                    select
                                                    fullWidth
                                                    label="Materia Prima"
                                                    variant="standard"
                                                    value={item.id_producto_material}
                                                    onChange={(e) => handleChange(index, 'id_producto_material', e.target.value)}
                                                    InputLabelProps={{ shrink: true }}
                                                >
                                                    {productos.filter(p => p.tipo_producto === 'MP').map((p) => (
                                                        <MenuItem key={p.id_producto} value={p.id_producto}>
                                                            {renderMateriaPrimaLabel(p.id_producto)}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>

                                                <TextField
                                                    label="Cantidad"
                                                    type="number"
                                                    variant="standard"
                                                    value={item.cantidad}
                                                    onChange={(e) => handleChange(index, 'cantidad', e.target.value)}
                                                    sx={{ width: { xs: '100%', sm: '150px' } }}
                                                    InputProps={{ 
                                                        startAdornment: <Scale sx={{ fontSize: 16, mr: 1, color: '#94a3b8' }} />
                                                    }}
                                                    InputLabelProps={{ shrink: true }}
                                                />

                                                <IconButton 
                                                    onClick={() => handleRemoveItem(index)}
                                                    sx={{ color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '8px' }}
                                                >
                                                    <DeleteOutline fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} sx={{ mt: 6 }}>
                                    <Divider sx={{ mb: 4 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
                                        <Button onClick={() => navigate('/recetas')} sx={{ color: '#64748b', fontWeight: 700 }}>
                                            Descartar
                                        </Button>
                                        <Button 
                                            variant="contained" 
                                            onClick={handleSubmit}
                                            sx={{ 
                                                px: 6, py: 1.5, borderRadius: '12px', bgcolor: '#0f172a', fontWeight: 700,
                                                '&:hover': { bgcolor: '#334155' }
                                            }}
                                            endIcon={<CheckCircle />}
                                        >
                                            Guardar Cambios
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Fade>
                </Container>
            </Box>
        </Box>
    );
};

export default RecetaEditForm;