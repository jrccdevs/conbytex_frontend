import { useState, useEffect } from 'react';
import { 
    Typography, Container, CircularProgress, Box, 
    Paper, Grid, Button, Divider, Stack 
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { getStockPorAlmacen } from '../../api/inventarioApi';
import { getAlmacenes } from '../../api/almacenesApi'; 
import InventarioTablaMP from '../../components/inventario/InventarioTablaMP';

const MateriaPrimaPage = () => {
    const [stockTotal, setStockTotal] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarData = async () => {
            try {
                // Solo consultamos almacén MP (id = 1)
                const response = await getStockPorAlmacen(1);
    
                const contenido = response?.data || response;
    
                const soloMP = Array.isArray(contenido)
                    ? contenido.filter(item =>
                        item.tipo_producto?.toString().trim().toUpperCase() === 'MP'
                      )
                    : [];
    
                setStockTotal(soloMP);
                setCargando(false);
    
            } catch (error) {
                console.error("Error al cargar MP:", error);
                setCargando(false);
            }
        };
    
        cargarData();
    }, []);
    

    const totalVariedades = stockTotal.length;
    const unidadesTotales = stockTotal.reduce((acc, curr) => 
        acc + Number(curr.stock_fisico || curr.stock_actual), 0
    );

    // OPCIONAL: Podrías añadir una constante para ver cuánto tienes "parado"
    const totalReservado = stockTotal.reduce((acc, curr) => 
        acc + Number(curr.stock_reservado || 0), 0
    );
    const handlePrint = () => { window.print(); };

    if (cargando) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
                <CircularProgress size={60} thickness={4} sx={{ color: '#00ced1' }} />
                <Typography sx={{ mt: 2, fontWeight: 'bold', color: '#37474f' }}>
                    Sincronizando inventario de insumos...
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h3" fontWeight="800" sx={{ color: '#263238', letterSpacing: -1 }}>
                        Control de Materia Prima
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Gestión global de suministros e insumos
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<PrintIcon />} 
                    onClick={handlePrint}
                    sx={{ 
                        bgcolor: '#00838f', '&:hover': { bgcolor: '#006064' },
                        display: { xs: 'none', sm: 'flex' }, borderRadius: 2,
                        textTransform: 'none', fontWeight: 'bold'
                    }}
                    className="no-print"
                >
                    Imprimir Inventario
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }} className="no-print">
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#e0f7fa', borderLeft: '6px solid #00838f', borderRadius: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <PrecisionManufacturingIcon sx={{ fontSize: 40, color: '#00838f' }} />
                            <Box>
                                <Typography variant="h4" fontWeight="bold" color="#263238">{totalVariedades}</Typography>
                                <Typography variant="body2" color="text.secondary">Insumos Registrados</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#f5f5f5', borderLeft: '6px solid #455a64', borderRadius: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ fontSize: 40 }}>🛠️</Box>
                            <Box>
                                <Typography variant="h4" fontWeight="bold" color="#263238">{unidadesTotales}</Typography>
                                <Typography variant="body2" color="text.secondary">Stock Físico Total</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            <Divider sx={{ mb: 4 }} className="no-print" />

            <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                <InventarioTablaMP stock={stockTotal} />
            </Paper>

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
                        body { background-color: white !important; margin: 0; padding: 10mm; }
                    }
                `}
            </style>
        </Container>
    );
};

export default MateriaPrimaPage;