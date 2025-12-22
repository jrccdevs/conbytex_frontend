import { useState, useEffect } from 'react';
import { 
    Typography, Container, CircularProgress, Box, 
    Paper, Grid, Button, Divider, Stack 
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import InventoryIcon from '@mui/icons-material/Inventory';
import { getStockPorAlmacen } from '../../api/inventarioApi';
import { getAlmacenes } from '../../api/almacenesApi'; 
import InventarioTablaPT from '../../components/inventario/InventarioTablaPT';

const ProductoTerminadoPage = () => {
    const [stockTotal, setStockTotal] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarDataDirecta = async () => {
            try {
                const almacenes = await getAlmacenes();
                const promesas = almacenes.map(a => getStockPorAlmacen(a.id_almacen));
                const resultados = await Promise.all(promesas);
                const todoPT = resultados.flat().filter(item => item.tipo_producto === 'PT');
                setStockTotal(todoPT);
                setCargando(false);
            } catch (error) {
                console.error("Error:", error);
                setCargando(false);
            }
        };
        cargarDataDirecta();
    }, []);

    const totalItems = stockTotal.length;
    const stockAcumulado = stockTotal.reduce((acc, curr) => acc + Number(curr.stock_actual), 0);

    const handlePrint = () => {
        window.print();
    };

    if (cargando) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
                <CircularProgress size={60} thickness={4} sx={{ color: '#00e5ff' }} />
                <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Generando reporte de productos...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h3" fontWeight="800" sx={{ color: '#1a237e', letterSpacing: -1 }}>
                        Stock de Productos
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Reporte consolidado de inventario terminado
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<PrintIcon />} 
                    onClick={handlePrint}
                    sx={{ 
                        bgcolor: '#1a237e', 
                        '&:hover': { bgcolor: '#0d47a1' },
                        display: { xs: 'none', sm: 'flex' }
                    }}
                    className="no-print"
                >
                    Imprimir Reporte
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }} className="no-print">
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#f0f4ff', borderLeft: '6px solid #1a237e', borderRadius: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <InventoryIcon sx={{ fontSize: 40, color: '#1a237e' }} />
                            <Box>
                                <Typography variant="h4" fontWeight="bold">{totalItems}</Typography>
                                <Typography variant="body2" color="text.secondary">Variedades en Stock</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#f1f8e9', borderLeft: '6px solid #43a047', borderRadius: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ fontSize: 40 }}>📦</Box>
                            <Box>
                                <Typography variant="h4" fontWeight="bold">{stockAcumulado}</Typography>
                                <Typography variant="body2" color="text.secondary">Unidades Totales Disponibles</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            <Divider sx={{ mb: 4 }} className="no-print" />

            <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <InventarioTablaPT stock={stockTotal} />
            </Paper>

            <style>
                {`
                    @media print {
                        /* Eliminación forzada de elementos del dashboard */
                        nav, aside, header, .no-print, button, .MuiDrawer-root, .MuiAppBar-root,
                        [class*="sidebar"], [class*="Sidebar"], [class*="navbar"] {
                            display: none !important;
                            visibility: hidden !important;
                        }
                        
                        /* Expande el contenido al 100% */
                        .MuiContainer-root {
                            max-width: 100% !important;
                            width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }

                        body {
                            background-color: white !important;
                            margin: 0;
                            padding: 15px;
                        }

                        .MuiPaper-root {
                            box-shadow: none !important;
                            border: 1px solid #ddd;
                        }

                        h3 {
                            font-size: 24pt !important;
                            margin-bottom: 10px !important;
                        }
                    }
                `}
            </style>
        </Container>
    );
};

export default ProductoTerminadoPage;