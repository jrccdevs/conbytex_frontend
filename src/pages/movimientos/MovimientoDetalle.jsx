import { useEffect, useState } from 'react';
import { 
    Box, Typography, Paper, Divider, Button, 
    Stack, CircularProgress, Grid, Container,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Avatar
} from '@mui/material';
import { 
    ArrowBack, Print, Person, Warehouse, 
    LocalShipping, EventNote, Business, ReceiptLong
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
                if (data) setMovimiento(data);
                else setError(true);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchDetalle();
    }, [id]);

    const handlePrint = () => window.print();

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    if (error || !movimiento) return (
        <Container sx={{ mt: 5, textAlign: 'center' }}>
            <Typography variant="h5" color="error">Documento no encontrado</Typography>
            <Button variant="outlined" onClick={() => navigate('/movimientos')} sx={{ mt: 2 }}>Regresar</Button>
        </Container>
    );

    const isIngreso = movimiento.tipo_movimiento === 'ingreso';
    const isSalida = movimiento.tipo_movimiento === 'salida';
    const accentColor = isIngreso ? '#2e7d32' : (isSalida ? '#d32f2f' : '#1976d2');
    const esSalidaConValor = isSalida && movimiento.total;

    return (
        <Box sx={{ 
            p: { xs: 1, md: 4 }, 
            bgcolor: '#f8f9fa', 
            minHeight: '100vh',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
        }}>
            
            <style>
            {`
    @media print {
        /* 1. Ocultar absolutamente todo el layout, dashboards, navbars, etc. */
        body * {
            visibility: hidden;
            background: none !important;
        }

        /* 2. Seleccionar el papel de la factura y todo su contenido para que sea visible */
        #invoice-paper, #invoice-paper * {
            visibility: visible;
        }

        /* 3. Posicionar el papel al inicio de la página de impresión */
        #invoice-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
        }

        /* 4. Forzar que no haya márgenes grises ni fondos raros */
        @page {
            size: auto;
            margin: 10mm;
        }
    }
    `}
            </style>
            
            <Stack direction="row" spacing={2} sx={{ mb: 3, width: '100%', maxWidth: '850px' }} className="no-print">
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/movimientos')} sx={{ color: '#555' }}>
                    Atrás
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button startIcon={<Print />} variant="contained" onClick={handlePrint} sx={{ bgcolor: '#2c3e50' }}>
                    Imprimir Documento
                </Button>
            </Stack>

            <Paper 
                id="invoice-paper"
                elevation={3} 
                sx={{ 
                    width: '100%', 
                    maxWidth: '850px', 
                    p: { xs: 3, md: 6 }, 
                    borderRadius: '4px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decoración Superior */}
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', bgcolor: accentColor }} />

                {/* HEADER */}
                <Grid container spacing={2} sx={{ mb: 5 }}>
                    <Grid item xs={12} md={7}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                            <Avatar sx={{ bgcolor: '#2c3e50', width: 56, height: 56 }}>
                                <Business fontSize="large" />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight="800" letterSpacing={-0.5} color="#2c3e50">
                                    CONBYTEX SRL
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: -0.5 }}>
                                    NIT: 123456789-0 | Central Santa Cruz, Bolivia
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                        <Typography variant="h6" fontWeight="700" color={accentColor} sx={{ textTransform: 'uppercase' }}>
                           Comprobante de {movimiento.tipo_movimiento}
                        </Typography>
                        <Typography variant="h5" fontWeight="400" color="text.secondary">
                            N° {movimiento.id_movimiento.toString().padStart(6, '0')}
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ mb: 4 }} />

                {/* INFORMACIÓN DEL DOCUMENTO */}
                <Grid container spacing={3} sx={{ mb: 5 }}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary">Origen / Ubicación</Typography>
                        <Stack direction="row" spacing={1} mt={1}>
                            <Warehouse sx={{ color: '#555', fontSize: 20 }} />
                            <Typography variant="body2" fontWeight="600">{movimiento.nombre_almacen}</Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary">Fecha de Emisión</Typography>
                        <Stack direction="row" spacing={1} mt={1}>
                            <EventNote sx={{ color: '#555', fontSize: 20 }} />
                            <Typography variant="body2">
                                {new Date(movimiento.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary">Responsable</Typography>
                        <Stack direction="row" spacing={1} mt={1}>
                            <Person sx={{ color: '#555', fontSize: 20 }} />
                            <Typography variant="body2">{movimiento.empleado || 'Admin Central'}</Typography>
                        </Stack>
                    </Grid>
                </Grid>

                {/* SECCIÓN CLIENTE (Si aplica) */}
                {isSalida && movimiento.cliente_nombre && (
                    <Box sx={{ mb: 5, p: 2, bgcolor: '#fbfbfb', border: '1px solid #eee', borderRadius: 1 }}>
                        <Typography variant="overline" fontWeight="800" sx={{ mb: 1, display: 'block', color: accentColor }}>
                            Datos del Destinatario / Cliente
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2"><strong>Nombre:</strong> {movimiento.cliente_nombre}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2"><strong>Documento:</strong> {movimiento.tipo_documento} {movimiento.numero_documento}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* TABLA DE PRODUCTOS */}
                <TableContainer component={Box} sx={{ mb: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#2c3e50' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>CÓDIGO</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>DESCRIPCIÓN</TableCell>
                                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>CANT.</TableCell>
                                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>U.M.</TableCell>
                                {esSalidaConValor && <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>PRECIO</TableCell>}
                                {esSalidaConValor && <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>SUBTOTAL</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                                <TableCell sx={{ fontWeight: '500' }}>PRD-{movimiento.id_producto}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold">{movimiento.nombre_producto}</Typography>
                                    <Typography variant="caption" color="text.secondary">Cod. Barras: 7801234567</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2" fontWeight="700" color={accentColor}>
                                        {isIngreso ? '+' : '-'}{movimiento.cantidad}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">{movimiento.nombre_unidad || 'PZA'}</TableCell>
                                {esSalidaConValor && <TableCell align="right">${Number(movimiento.precio_unitario).toFixed(2)}</TableCell>}
                                {esSalidaConValor && <TableCell align="right" sx={{ fontWeight: 'bold' }}>${Number(movimiento.total).toFixed(2)}</TableCell>}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* FOOTER DE LA FACTURA */}
                <Grid container spacing={4} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={7}>
                        <Typography variant="overline" fontWeight="700">Observaciones Generales</Typography>
                        <Typography variant="body2" sx={{ color: '#666', minHeight: '60px', p: 1, border: '1px solid #f0f0f0', borderRadius: 1, mt: 1 }}>
                            {movimiento.descripcion || "Sin observaciones adicionales."}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Stack spacing={1.5} sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 1 }}>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2">Cantidad de Items:</Typography>
                                <Typography variant="body2" fontWeight="bold">{movimiento.cantidad}</Typography>
                            </Stack>
                            <Divider />
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" fontWeight="700">Total:</Typography>
                                <Typography variant="h5" fontWeight="800" color={accentColor}>
                                    {esSalidaConValor ? `$${Number(movimiento.total).toFixed(2)}` : `${movimiento.cantidad} Unidades`}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>

                {/* FIRMAS */}
                <Grid container spacing={8} sx={{ mt: 8, mb: 4 }}>
                    <Grid item xs={6}>
                        <Box sx={{ borderTop: '1px solid #ccc', pt: 1, textAlign: 'center' }}>
                            <Typography variant="caption" fontWeight="700" sx={{ textTransform: 'uppercase' }}>
                                Firma Entrega
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ borderTop: '1px solid #ccc', pt: 1, textAlign: 'center' }}>
                            <Typography variant="caption" fontWeight="700" sx={{ textTransform: 'uppercase' }}>
                                Firma Recibido
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="caption" color="text.disabled" sx={{ letterSpacing: 2 }}>
                        DOCUMENTO NO VÁLIDO COMO FACTURA FISCAL - CONTROL INTERNO
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default MovimientoDetalle;