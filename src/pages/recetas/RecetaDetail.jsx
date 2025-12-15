import { useEffect, useState, useMemo } from 'react';
import { 
    Box, 
    Typography, 
    CircularProgress, 
    Button, 
    Card, 
    CardContent,
    Divider, 
    Tooltip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecetasByProducto } from '../../api/recetasApi';
import { getProductos } from '../../api/productosApi'; 
import RecetaForm from '../../components/recetas/RecetaForm';
import { useAuth } from '../../context/AuthContext';

const RecetaDetail = () => {
    const { id_producto } = useParams();
    const navigate = useNavigate();
    const [recetas, setRecetas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);

    const { usuario } = useAuth(); 

    // Función de utilidad
    const getProductoDetails = (id) => {
        // Buscamos solo si la lista de productos existe y si el ID es válido
        if (!productos || !id) return null; 
        return productos.find(p => p.id_producto === Number(id));
    };

    // --- HOOKS DE ESTADO Y CÁLCULO ---
    const productoFinal = useMemo(() => { 
        return getProductoDetails(id_producto) || {};
    }, [productos, id_producto]);

    const fetchRecetas = async () => {
        setLoading(true);
        try {
            const [dataRecetas, dataProductos] = await Promise.all([
                getRecetasByProducto(id_producto).catch(err => {
                     if (err.response && err.response.status === 404) return [];
                     throw err; 
                }),
                getProductos().catch(err => {
                     console.error("Error al cargar productos:", err);
                     return [];
                })
            ]);
            
            setRecetas(Array.isArray(dataRecetas) ? dataRecetas : []);
            setProductos(Array.isArray(dataProductos) ? dataProductos : []);

        } catch (error) {
            console.error("Error crítico al cargar RecetaDetail:", error);
            Swal.fire('Error', 'No se pudieron cargar los datos de la receta o los productos asociados.', 'error');
            setRecetas([]);
            setProductos([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRecetas();
    }, [id_producto]);
    
    const handleEditSuccess = () => {
        setEditMode(false);
        fetchRecetas();
    };

    if (loading || productos.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    
    // El resto del código que usa productoFinal ahora es seguro
    const productoTerminado = `${productoFinal.nombre_producto || 'Producto Desconocido'} `;
    const unidadMedidaPT = productoFinal.nombre_unidad_medida || 'Unidad';
    const productoID = id_producto;


    // --- FUNCIÓN DE CONCATENACIÓN DE MATERIA PRIMA (se mantiene igual) ---
    const formatMateriaPrima = (r) => {
        const mpDetails = getProductoDetails(r.id_producto_material); 
        
        if (!mpDetails) return r.materia_prima || `ID ${r.id_producto_material} Desconocido`;

        const parts = [
            mpDetails.nombre_producto,
            mpDetails.nombre_material, 
            mpDetails.nombre_color
        ].filter(Boolean);

        return parts.join('  ');
    };
    
    // --- FUNCIÓN DE CONCATENACIÓN DE CANTIDAD CON UNIDAD (CORREGIDA) ---
    const formatCantidad = (r) => {
        const mpDetails = getProductoDetails(r.id_producto_material);
        
        // ⚠️ CORRECCIÓN CLAVE: Accedemos directamente a la unidad de medida de la materia prima.
        // Si el detalle existe y tiene el campo, lo usamos.
        const unidad = mpDetails?.nombre_unidad || 'Unidades';
        
        return `${r.cantidad || 0} ${unidad}`;
    };

    // Estructura de la vista de lectura (Tabla)
    const RecetaViewTable = () => (
        <TableContainer component={Paper} elevation={3}>
            <Table size="small">
                <TableHead sx={{ backgroundColor: 'primary.light' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>ID Receta</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Materia Prima (Material | Color)</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', width: '25%' }}>Cantidad Requerida</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {recetas.map((r) => (
                        <TableRow 
                            key={r.id_receta} 
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            hover
                        >
                            <TableCell component="th" scope="row">
                                {r.id_receta}
                            </TableCell>
                            <TableCell>
                                {formatMateriaPrima(r)}
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="subtitle1" fontWeight="medium">
                                    {formatCantidad(r)}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Box sx={{ p: 3 }}>
            
            {/* 1. Encabezado de la Receta */}
            <Card variant="outlined" sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        
                        <Box>
                             <Typography variant="overline" color="text.secondary">
                                 Receta de Producto Final (ID: {productoID})
                             </Typography>
                             <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                                 {productoTerminado}
                             </Typography>
                             <Typography variant="subtitle2" color="primary.dark" sx={{ mt: 0.5, backgroundColor: 'primary.light', p: '2px 8px', borderRadius: 1, display: 'inline-block' }}>
                                 Unidad de Producto Final: **{unidadMedidaPT}**
                             </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Volver a la lista">
                                <IconButton color="info" onClick={() => navigate('/recetas')}>
                                    <ArrowBackIcon />
                                </IconButton>
                            </Tooltip>

                            {usuario?.role === 'admin' && (
                                <Tooltip title={editMode ? 'Cancelar Edición' : 'Editar Receta'}>
                                    <IconButton
                                        color={editMode ? 'error' : 'primary'}
                                        onClick={() => setEditMode(!editMode)}
                                        size="large"
                                    >
                                        {editMode ? <CloseIcon /> : <EditIcon />}
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
            
            <Divider sx={{ mb: 3 }} />

            {/* 2. Contenido Principal (Formulario o Vista) */}
            {editMode ? (
                // MODO EDICIÓN
                <RecetaForm 
                    recetas={recetas} 
                    fetchRecetas={handleEditSuccess} 
                />
            ) : (
                // MODO VISTA (Lectura)
                <Box>
                    {recetas.length === 0 ? (
                        <Alert severity="warning" sx={{ mb: 3 }}>
                            Este producto no tiene materias primas asignadas. 
                            {usuario?.role === 'admin' && (
                                <Button 
                                    onClick={() => setEditMode(true)} 
                                    sx={{ ml: 2, textDecoration: 'underline' }} 
                                    size="small"
                                    color="inherit"
                                >
                                    Haga clic aquí para añadir.
                                </Button>
                            )}
                        </Alert>
                    ) : (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Desglose de Materias Primas ({recetas.length} items)
                            </Typography>
                            <RecetaViewTable />
                        </>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default RecetaDetail;