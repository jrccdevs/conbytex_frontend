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
        const cargarData = async () => {
            try {
                // Solo consultamos almacén PT (id = 2)
                const response = await getStockPorAlmacen(2);
    
                const contenido = response?.data || response;
    
                const soloPT = Array.isArray(contenido)
                    ? contenido.filter(item =>
                        item.tipo_producto?.toString().trim().toUpperCase() === 'PT'
                      )
                    : [];
    
                setStockTotal(soloPT);
                setCargando(false);
    
            } catch (error) {
                console.error("Error al cargar inventario PT:", error);
                setCargando(false);
            }
        };
    
        cargarData();
    }, []);

    // Cálculo dinámico de indicadores
    const totalItems = stockTotal.length;

    // CORRECCIÓN PARA EL NaN: Usamos los nombres reales de las columnas según tus logs
    const stockAcumulado = stockTotal.reduce((acc, curr) => {
        // En tus logs la columna es 'stock_fisico' o 'stock_disponible'
        const valor = curr.stock_fisico || curr.stock_disponible || curr.stock_actual || 0;
        const n = Number(valor);
        return acc + (isNaN(n) ? 0 : n);
    }, 0);

    const handlePrint = () => { window.print(); };

    if (cargando) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
                <CircularProgress size={60} thickness={4} sx={{ color: '#1B3B4A' }} />
                <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Generando reporte de productos...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Encabezado */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h3" fontWeight="800" sx={{ color: '#091429', letterSpacing: -1 }}>
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
                    sx={{ bgcolor: '#1B3B4A', '&:hover': { bgcolor: '#091429' }, display: { xs: 'none', sm: 'flex' } }}
                    className="no-print"
                >
                    Imprimir Reporte
                </Button>
            </Box>

            {/* Tarjetas de Resumen */}
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
                                <Typography variant="h4" fontWeight="bold">{stockAcumulado.toLocaleString()}</Typography>
                                <Typography variant="body2" color="text.secondary">Unidades Totales Disponibles</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            <Divider sx={{ mb: 4 }} className="no-print" />

            {/* Tabla de Resultados */}
            <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <InventarioTablaPT stock={stockTotal} />
            </Paper>

            {/* Estilos para Impresión */}
            <style>
                {`
                    @media print {
                        nav, aside, header, footer, .no-print, button, 
                        .MuiDrawer-root, .MuiAppBar-root, [class*="sidebar"], [class*="menu"] {
                            display: none !important;
                        }
                        .MuiContainer-root {
                            max-width: 100% !important;
                            width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }
                        body { background-color: white !important; margin: 0; padding: 15px; }
                    }
                `}
            </style>
        </Container>
    );
};

export default ProductoTerminadoPage;