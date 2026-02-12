import { useState, useEffect } from 'react';
import { 
    Box, TextField, MenuItem, Grid, Typography, 
    Avatar, IconButton, Fade, Button, Container, Stack, Divider
} from '@mui/material';
import { 
    Layers, Badge, ArrowBack, 
    CheckCircle, Bolt, FiberManualRecord
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductosConReceta  } from '../../api/productosApi';
import { createOrden, getOrdenById, updateOrden } from '../../api/ordenesApi';
import clienteApi from '../../api/clienteApi';
import Swal from 'sweetalert2';

const OrdenForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [formData, setFormData] = useState({
        id_producto: '',
        id_empleado: '',
        cantidad_solicitada: '',
        estado: 'pendiente'
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [resProd, resEmp] = await Promise.all([
                    getProductosConReceta(),
                    clienteApi.get('/empleados')
                ]);
    
                setProductos(resProd || []); 
                setEmpleados(resEmp.data || []);
    
                if (!resProd || resProd.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No hay productos con receta',
                        text: 'Debe crear una receta antes de generar una orden de producción.'
                    });
                }
    
                if (id) {
                    const ordenExistente = await getOrdenById(id);
                    setFormData(ordenExistente);
                }
            } catch (error) { console.error(error); }
        };
        loadInitialData();
    }, [id]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.id_producto) {
            return Swal.fire({
                icon: 'warning',
                title: 'Debe seleccionar un producto válido'
            });
        }
    
        try {
            if (id) {
                await updateOrden(id, formData);
            } else {
                await createOrden(formData);
            }
    
            Swal.fire({
                title: 'Operación Exitosa',
                icon: 'success',
                confirmButtonColor: '#0f172a'
            });
            navigate('/orden');
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error' });
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            bgcolor: '#ffffff', // Fondo blanco puro
            color: '#0f172a'    // Texto azul casi negro
        }}>
            {/* --- PANEL LATERAL MINIMALISTA --- */}
            <Box sx={{ 
                width: { xs: 0, md: '300px' }, 
                p: 5, 
                display: { xs: 'none', md: 'flex' }, 
                flexDirection: 'column',
                borderRight: '1px solid #f1f5f9'
            }}>
                <IconButton 
                    onClick={() => navigate('/orden')} 
                    sx={{ color: '#0f172a', alignSelf: 'flex-start', mb: 6, border: '1px solid #f1f5f9' }}
                >
                    <ArrowBack fontSize="small" />
                </IconButton>
                
                <Box sx={{ mt: 2 }}>
                    
                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8 }}>
                        Gestión profesional de activos y flujo de manufactura automatizada.
                    </Typography>
                </Box>

                <Stack spacing={3} sx={{ mt: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FiberManualRecord sx={{ fontSize: 10, color: '#22c55e' }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>Sincronización Activa</Typography>
                    </Box>
                    <Divider />
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        ID de Sesión: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </Typography>
                </Stack>
            </Box>

            {/* --- CUERPO DEL FORMULARIO --- */}
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 10 }, px: { xs: 2, md: 8 } }}>
                <Fade in timeout={800}>
                    <Box>
                        <Box sx={{ mb: 10 }}>
                            <Typography variant="h2" sx={{ fontWeight: 700, fontSize:40, letterSpacing: '-2px', color: '#0f172a' }}>
                                {id ? 'Configurar Orden' : 'Nueva Orden de Producción'}
                            </Typography>
                            <Box sx={{ width: 60, height: 4, bgcolor: '#3b82f6', mt: 2, borderRadius: 2 }} />
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={12}> {/* Espaciado extremo para evitar amontonamiento */}
                                
                                {/* SECCIÓN 1: PRODUCTO */}
                                <Grid item xs={12} md={6}>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 5 }}>
                                        <Avatar sx={{ bgcolor: '#f8fafc', color: '#3b82f6', border: '1px solid #e2e8f0' }}>
                                            <Layers fontSize="small" />
                                        </Avatar>
                                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Atributos</Typography>
                                    </Stack>
                                    
                                    <Stack spacing={6}>
                                    <TextField
    select
    fullWidth
    label="Referencia del Producto"
    value={formData.id_producto}
    onChange={(e) => setFormData({...formData, id_producto: e.target.value})}
    variant="standard"
    required
    sx={{ '& .MuiInput-root': { fontSize: '1.2rem', py: 1, fontWeight: 500 } }}
    InputLabelProps={{ shrink: true, sx: { color: '#94a3b8', fontWeight: 600 } }}
>
    {productos.length > 0 ? (
        productos.map(p => (
            <MenuItem key={p.id_producto} value={p.id_producto}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {p.nombre_completo}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                        {p.nombre_unidad ? `Unidad: ${p.nombre_unidad}` : ''}
                    </Typography>
                </Box>
            </MenuItem>
        ))
    ) : (
        <MenuItem disabled>No hay productos disponibles con receta</MenuItem>
    )}
</TextField>

                                        <TextField
                                            fullWidth
                                            label="Unidades Requeridas"
                                            type="number"
                                            value={formData.cantidad_solicitada}
                                            onChange={(e) => setFormData({...formData, cantidad_solicitada: e.target.value})}
                                            variant="standard"
                                            required
                                            sx={{ '& .MuiInput-root': { fontSize: '1.2rem', py: 1, fontWeight: 500 } }}
                                            InputLabelProps={{ shrink: true, sx: { color: '#94a3b8', fontWeight: 600 } }}
                                        />
                                    </Stack>
                                </Grid>

                                {/* SECCIÓN 2: ASIGNACIÓN */}
                                <Grid item xs={12} md={6}>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 5 }}>
                                        <Avatar sx={{ bgcolor: '#f8fafc', color: '#3b82f6', border: '1px solid #e2e8f0' }}>
                                            <Badge fontSize="small" />
                                        </Avatar>
                                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Responsable</Typography>
                                    </Stack>

                                    <Stack spacing={6}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Operador Asignado"
                                            value={formData.id_empleado}
                                            onChange={(e) => setFormData({...formData, id_empleado: e.target.value})}
                                            variant="standard"
                                            required
                                            sx={{ '& .MuiInput-root': { fontSize: '1.2rem', py: 1, fontWeight: 500 } }}
                                            InputLabelProps={{ shrink: true, sx: { color: '#94a3b8', fontWeight: 600 } }}
                                        >
                                            {empleados.map(emp => (
                                                <MenuItem key={emp.id_empleado} value={emp.id_empleado}>{emp.nombre_empleado}</MenuItem>
                                            ))}
                                        </TextField>

                                        {id && (
                                            <TextField
                                                select
                                                fullWidth
                                                label="Estado Operativo"
                                                value={formData.estado}
                                                onChange={(e) => setFormData({...formData, estado: e.target.value})}
                                                variant="standard"
                                                sx={{ '& .MuiInput-root': { fontSize: '1.2rem', py: 1, fontWeight: 500 } }}
                                                InputLabelProps={{ shrink: true, sx: { color: '#94a3b8', fontWeight: 600 } }}
                                            >
                                                <MenuItem value="pendiente">Pendiente</MenuItem>
                                                <MenuItem value="en_proceso">En Proceso</MenuItem>
                                                <MenuItem value="completado">Completado</MenuItem>
                                            </TextField>
                                        )}
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} sx={{ mt: 4 }}>
                                    <Divider sx={{ mb: 6 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: 300 }}>
                                            * Los cambios realizados se verán reflejados inmediatamente en el dashboard central.
                                        </Typography>
                                        <Stack direction="row" spacing={4} alignItems="center">
                                            <Button 
                                                onClick={() => navigate('/orden')}
                                                sx={{ color: '#64748b', fontWeight: 700, textTransform: 'none' }}
                                            >
                                                Descartar
                                            </Button>
                                            <Button 
                                                type="submit"
                                                variant="contained"
                                                sx={{ 
                                                    px: 8, py: 2, 
                                                    borderRadius: '14px',
                                                    bgcolor: '#0f172a',
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    textTransform: 'none',
                                                    boxShadow: '0 10px 20px rgba(15, 23, 42, 0.2)',
                                                    '&:hover': { bgcolor: '#334155' },
                                                    transition: '0.3s'
                                                }}
                                                endIcon={<CheckCircle fontSize="small" />}
                                            >
                                                {id ? 'Guardar Cambios' : 'Confirmar Orden'}
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default OrdenForm;