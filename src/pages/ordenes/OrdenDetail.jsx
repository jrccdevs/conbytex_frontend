import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Card, CardContent, Grid, Divider, 
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Paper, Chip, Button, CircularProgress, Alert,
    Stack, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { getOrdenById } from '../../api/ordenesApi';

const OrdenDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orden, setOrden] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrden = async () => {
            try {
                const data = await getOrdenById(id);
                setOrden(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrden();
    }, [id]);

    // --- FUNCIÓN DE IMPRESIÓN ---
    const handlePrint = () => {
        window.print();
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (!orden) return <Alert severity="error">No se encontró la información de la orden.</Alert>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            
            {/* Cabecera de Acciones (Se oculta al imprimir) */}
            <Stack 
                direction="row" 
                justifyContent="space-between" 
                alignItems="center" 
                sx={{ mb: 3, display: 'print-none' }} // Clase ficticia para identificar
                className="no-print"
            >
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={() => navigate('/orden')}
                    variant="outlined"
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                    Volver a Órdenes
                </Button>
                
                <Button 
                    startIcon={<PrintIcon />} 
                    onClick={handlePrint}
                    variant="contained"
                    color="secondary"
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                >
                    Imprimir Orden
                </Button>
            </Stack>

            {/* CONTENEDOR PRINCIPAL (ESTILO DOCUMENTO) */}
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 4, 
                    borderRadius: 3, 
                    maxWidth: '1000px', 
                    margin: '0 auto',
                    backgroundColor: '#fff',
                    // Estilos específicos para la impresión
                    '@media print': {
                        boxShadow: 'none',
                        margin: 0,
                        p: 0,
                        width: '100%'
                    }
                }}
            >
                {/* Encabezado del Reporte */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            ORDEN DE PRODUCCIÓN
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Nº Folio: #000{orden.id_orden}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                    <Chip 
    label={orden.estado.toUpperCase()} 
    color={
        orden.estado === 'pendiente' ? 'warning' : 
        orden.estado === 'en_proceso' ? 'info' : 
        orden.estado === 'completado' ? 'success' : 'error'
    } 
    sx={{ fontWeight: 'bold', mb: 1 }}
/>
                        <Typography variant="body2" color="text.secondary">
                            Generado el: {new Date(orden.fecha).toLocaleDateString()}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 4, borderBottomWidth: 2 }} />

                {/* Grid de Información Principal */}
                <Grid container spacing={3} sx={{ mb: 5 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <InventoryIcon color="action" />
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block">PRODUCTO</Typography>
                                <Typography variant="subtitle1" fontWeight="bold">{orden.producto_terminado}</Typography>
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <AssignmentIcon color="action" />
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block">CANTIDAD TOTAL</Typography>
                                <Typography variant="h6" fontWeight="bold" color="secondary">{orden.cantidad_solicitada} Unidades</Typography>
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <PersonIcon color="action" />
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block">RESPONSABLE</Typography>
                                <Typography variant="subtitle1" fontWeight="bold">{orden.empleado}</Typography>
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <CalendarTodayIcon color="action" />
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block">FECHA INICIO</Typography>
                                <Typography variant="subtitle1" fontWeight="bold">{new Date(orden.fecha).toLocaleDateString()}</Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>

                {/* TABLA DE EXPLOSIÓN DE MATERIALES */}
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 4, height: 24, bgcolor: 'primary.main', mr: 1.5, borderRadius: 1 }} />
                    Explosión de Materia Prima Requerida
                </Typography>
                
                <TableContainer component={Box} sx={{ mt: 2, mb: 4 }}>
                    <Table sx={{ minWidth: 650 }} size="medium">
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                                <TableCell sx={{ fontWeight: 'bold', color: '#555' }}>CÓDIGO MP</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#555' }}>DESCRIPCIÓN DE MATERIAL</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#555' }}>CANTIDAD NECESARIA</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orden.materiales?.map((mat) => (
                                <TableRow key={mat.id_producto_material} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>MP-{mat.id_producto_material}</TableCell>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight="medium">
                                            {mat.materia_prima}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {mat.cantidad_necesaria}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Alert severity="info" variant="outlined" sx={{ mb: 4, '@media print': { display: 'none' } }}>
                    Estas cantidades han sido calculadas automáticamente en base a la receta del producto y la cantidad solicitada.
                </Alert>

                {/* Sección de Firmas (Solo visible al imprimir) */}
                <Box sx={{ 
                    mt: 8, 
                    display: 'none', 
                    '@media print': { display: 'flex' }, 
                    justifyContent: 'space-between' 
                }}>
                    <Box sx={{ textAlign: 'center', width: '200px' }}>
                        <Divider sx={{ mb: 1, borderColor: '#000' }} />
                        <Typography variant="body2">Firma Responsable</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', width: '200px' }}>
                        <Divider sx={{ mb: 1, borderColor: '#000' }} />
                        <Typography variant="body2">Firma Control de Calidad</Typography>
                    </Box>
                </Box>
            </Paper>

            {/* ESTILOS CSS PARA IMPRESIÓN */}
            <style>
                {`
                @media print {
                    body { 
                        background-color: #fff !important; 
                        margin: 0;
                        padding: 0;
                    }
                    .no-print { 
                        display: none !important; 
                    }
                    /* Ocultar sidebar y topbar si usas LayoutPrincipal */
                    nav, header, aside, .MuiDrawer-root, .MuiAppBar-root { 
                        display: none !important; 
                    }
                    main {
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                }
                `}
            </style>
        </Box>
    );
};

export default OrdenDetail;