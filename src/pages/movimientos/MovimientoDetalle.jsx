import { useEffect, useState } from 'react';
import { 
    Box, Typography, Paper, Divider, Button, 
    Stack, Chip, CircularProgress, Grid, Container 
} from '@mui/material';
import { 
    ArrowBack, Print, Person, Warehouse, 
    Inventory, Description, DateRange 
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovimientoById } from '../../api/movimientosApi';

const MovimientoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movimiento, setMovimiento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                setLoading(true);
                const data = await getMovimientoById(id);
                if (data) {
                    setMovimiento(data);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Error al cargar detalle:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchDetalle();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;

    if (error || !movimiento) {
        return (
            <Container sx={{ mt: 5, textAlign: 'center' }}>
                <Typography variant="h5" color="error">Error: No se pudo cargar el movimiento</Typography>
                <Button variant="contained" onClick={() => navigate('/movimientos')} sx={{ mt: 2 }}>Volver al listado</Button>
            </Container>
        );
    }

    const colorTheme = movimiento.tipo_movimiento === 'ingreso' ? '#2e7d32' : (movimiento.tipo_movimiento === 'salida' ? '#d32f2f' : '#0288d1');

    return (
        <Box sx={{ p: { xs: 2, md: 5 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* INYECCIÓN DE CSS PARA IMPRESIÓN PURA */}
            <style>
                {`
                @media print {
                    /* Ocultar todo el sitio web */
                    body * {
                        visibility: hidden;
                    }
                    /* Mostrar solo el área del ticket y sus hijos */
                    #ticket-print-area, #ticket-print-area * {
                        visibility: visible;
                    }
                    /* Posicionar el ticket al inicio de la página de impresión */
                    #ticket-print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 0;
                    }
                    /* Eliminar sombras y bordes innecesarios en papel */
                    .MuiPaper-root {
                        box-shadow: none !important;
                        border: 1px solid #eee !important;
                    }
                }
                `}
            </style>
            
            {/* BOTONES DE NAVEGACIÓN (Se ocultan automáticamente al imprimir) */}
            <Stack direction="row" spacing={2} sx={{ mb: 4, "@media print": { display: 'none' } }}>
                <Button startIcon={<ArrowBack />} variant="outlined" onClick={() => navigate('/movimientos')} sx={{ borderRadius: 2 }}>
                    Regresar
                </Button>
                <Button startIcon={<Print />} variant="contained" onClick={handlePrint} sx={{ bgcolor: '#111', borderRadius: 2 }}>
                    Imprimir Ticket
                </Button>
            </Stack>

            {/* CONTENEDOR DEL TICKET */}
            <Box id="ticket-print-area">
                <Paper 
                    elevation={0} 
                    sx={{ 
                        width: '100%', 
                        maxWidth: '600px', 
                        p: 5, 
                        border: '1px solid #ddd', 
                        borderRadius: 0, 
                        backgroundColor: '#fff' 
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: 1 }}>COMPROBANTE DE INVENTARIO</Typography>
                        <Typography variant="caption" color="text.secondary">FOLIO: {movimiento.id_movimiento}</Typography>
                    </Box>

                    <Divider sx={{ borderStyle: 'dashed', my: 3 }} />

                    {/* BLOQUE DE CANTIDAD Y PRODUCTO */}
                    <Box sx={{ mb: 4, p: 3, bgcolor: '#fcfcfc', border: '1px solid #f0f0f0', borderLeft: `8px solid ${colorTheme}` }}>
                        <Typography variant="caption" color="text.secondary">PRODUCTO</Typography>
                        <Typography variant="h5" fontWeight="800" gutterBottom>{movimiento.nombre_producto}</Typography>
                        
                        <Grid container alignItems="center" sx={{ mt: 2 }}>
                            <Grid item xs={8}>
                                <Typography variant="caption" color="text.secondary" display="block">CANTIDAD REGISTRADA</Typography>
                                <Typography variant="h3" fontWeight="900" sx={{ color: colorTheme, display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                    {movimiento.tipo_movimiento === 'ingreso' ? '+' : '-'}
                                    {movimiento.cantidad}
                                    <Typography component="span" variant="h5" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                                        {/* Concatenación de la unidad de medida */}
                                        {movimiento.nombre_unidad || 'unidades'}
                                    </Typography>
                                </Typography>
                            </Grid>
                            <Grid item xs={4} sx={{ textAlign: 'right' }}>
                                <Chip 
                                    label={movimiento.tipo_movimiento?.toUpperCase()} 
                                    sx={{ bgcolor: colorTheme, color: 'white', fontWeight: 'bold', borderRadius: 1 }} 
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Warehouse fontSize="inherit" /> ALMACÉN
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">{movimiento.nombre_almacen}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <DateRange fontSize="inherit" /> FECHA / HORA
                            </Typography>
                            <Typography variant="body1">{new Date(movimiento.fecha).toLocaleString()}</Typography>
                        </Grid>
                        
                        <Grid item xs={12}><Divider /></Grid>

                        <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Person fontSize="inherit" /> EMPLEADO QUE REALIZÓ EL MOVIMIENTO
                            </Typography>
                            <Typography variant="h6" fontWeight="800" sx={{ textTransform: 'uppercase', color: '#000' }}>
                                {movimiento.nombre_empleado || movimiento.empleado || "Usuario del Sistema"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Description fontSize="inherit" /> MOTIVO / DESCRIPCIÓN
                            </Typography>
                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#444' }}>
                                {movimiento.descripcion || "Sin comentarios registrados."}
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* FIRMAS (VISIBLE SOLO AL IMPRIMIR) */}
                    <Box sx={{ mt: 10, display: 'none', "@media print": { display: 'block' } }}>
                        <Stack direction="row" spacing={6} justifyContent="center">
                            <Box sx={{ width: '220px', textAlign: 'center' }}>
                                <Divider sx={{ borderColor: '#000', mb: 1, borderBottomWidth: 2 }} />
                                <Typography variant="caption" fontWeight="bold">FIRMA DE CONFORMIDAD</Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>{movimiento.nombre_empleado || movimiento.empleado}</Typography>
                            </Box>
                            <Box sx={{ width: '220px', textAlign: 'center' }}>
                                <Divider sx={{ borderColor: '#000', mb: 1, borderBottomWidth: 2 }} />
                                <Typography variant="caption" fontWeight="bold">VALIDACIÓN ALMACÉN</Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 5 }}>
                        <Typography variant="caption" sx={{ color: '#aaa', textTransform: 'uppercase', letterSpacing: 1 }}>
                            Copia para Control de Inventario
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default MovimientoDetalle;