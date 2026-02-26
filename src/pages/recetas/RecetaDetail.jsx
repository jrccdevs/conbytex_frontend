import { useEffect, useState, useMemo, useCallback } from 'react';
import { 
    Box, Typography, CircularProgress, Button, Card, CardContent,
    Stack, Avatar, Chip, Fade, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Alert, IconButton, Tooltip
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import Swal from 'sweetalert2';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// Importaciones de API y Contexto
import { getRecetasByProducto } from '../../api/recetasApi';
import { getProductos } from '../../api/productosApi'; 
import RecetaForm from '../../components/recetas/RecetaForm';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente interno para renderizar la tabla de materiales (Vista de solo lectura)
 */
const RenderRecetaTable = ({ recetas, formatMateriaPrima, formatCantidad,formatCodigo, colors }) => (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
        <Table>
            <TableHead sx={{ backgroundColor: colors.bgLight }}>
                <TableRow>
                    <TableCell sx={{ fontWeight: 800, color: colors.primary }}>Codigo</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: colors.primary }}>Materia Prima / Insumo</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: colors.primary }}>Cantidad Requerida</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {recetas.map((r) => (
                    <TableRow key={r.id_receta} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell>
                        <Chip label={formatCodigo(r)} size="small" sx={{ fontWeight: 700, bgcolor: colors.border }} /></TableCell>
                        <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>
                                {formatMateriaPrima(r)}
                            </Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Box sx={{ display: 'inline-block', bgcolor: '#f1f5f9', px: 2, py: 0.5, borderRadius: '8px' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: colors.accent }}>
                                    {formatCantidad(r)}
                                </Typography>
                            </Box>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

const RecetaDetail = () => {
    const { id_producto } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // Para detectar si venimos de "Editar" en la tabla
    const { usuario } = useAuth();

    // Estados
    const [recetas, setRecetas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(location.state?.editImmediately || false);

    // Colores del sistema
    const colors = {
        primary: '#0f172a',
        accent: '#6366f1',
        bgLight: '#f8fafc',
        border: '#e2e8f0'
    };

    // --- LÓGICA DE PERMISOS ---
    const user = usuario?.user ?? usuario;
    const isAdmin = user?.roles?.some(r => r.slug === 'admin');
    const hasPermission = (perm) => user?.permissions?.some(p => p.slug === perm);
    const canEdit = isAdmin || hasPermission('recetas.edit');

    // --- MANEJO DE DATOS ---
    const getProductoDetails = useCallback((id) => {
        if (!productos || !id) return null; 
        return productos.find(p => p.id_producto === Number(id));
    }, [productos]);

    const productoFinal = useMemo(() => { 
        return getProductoDetails(id_producto) || {};
    }, [id_producto, getProductoDetails]);

    const fetchRecetas = async () => {
        setLoading(true);
        try {
            const [dataRecetas, dataProductos] = await Promise.all([
                getRecetasByProducto(id_producto).catch(err => {
                     if (err.response?.status === 404) return [];
                     throw err; 
                }),
                getProductos().catch(() => [])
            ]);
            setRecetas(Array.isArray(dataRecetas) ? dataRecetas : []);
            setProductos(Array.isArray(dataProductos) ? dataProductos : []);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los datos del expediente.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecetas();
    }, [id_producto]);

    // --- FORMATEADORES ---
    const formatMateriaPrima = (r) => {
        const mpDetails = getProductoDetails(r.id_producto_material); 
        if (!mpDetails) return r.materia_prima || `ID ${r.id_producto_material}`;
        return [mpDetails.nombre_producto, mpDetails.nombre_material, mpDetails.nombre_color].filter(Boolean).join(' • ');
    };
    const formatCodigo = (r) => {
        const mpDetails = getProductoDetails(r.id_producto_material); 
        // Si existe el detalle, retorna el código, si no, el ID o un guion
        return mpDetails?.codigo || r.codigo || "S/C";
    };
    const formatCantidad = (r) => {
        const mpDetails = getProductoDetails(r.id_producto_material);
        return `${r.cantidad || 0} ${mpDetails?.nombre_unidad || 'Unidades'}`;
    };

    // --- RENDERIZADO ---
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress thickness={5} size={50} sx={{ color: colors.accent }} />
            </Box>
        );
    }

    return (
        <Fade in={true}>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
                {/* Cabecera del Expediente */}
                <Card sx={{ mb: 4, borderRadius: '24px', border: `1px solid ${colors.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                            <Stack direction="row" spacing={3} alignItems="center">
                                <Avatar sx={{ width: 80, height: 80, bgcolor: colors.primary }}>
                                    <InventoryTwoToneIcon sx={{ fontSize: 40, color: '#818cf8' }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="overline" sx={{ fontWeight: 900, color: colors.accent }}>EXPEDIENTE TÉCNICO #{id_producto}</Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 30, color: colors.primary, letterSpacing: '-1px' }}>
                                        {productoFinal.nombre_producto || 'Producto Desconocido'}
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                        <Chip label={`Unidad Base: ${productoFinal.nombre_unidad_medida || 'Unidad'}`} sx={{ fontWeight: 700 }} />
                                        <Chip label={`${recetas.length} Materiales`} variant="outlined" sx={{ fontWeight: 700 }} />
                                    </Stack>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1}>
                                <Tooltip title="Volver al listado">
                                    <IconButton onClick={() => navigate('/recetas')} sx={{ border: `1px solid ${colors.border}` }}>
                                        <ArrowBackTwoToneIcon />
                                    </IconButton>
                                </Tooltip>
                                
                                {canEdit && (
                                    <Button
                                        variant="contained"
                                        startIcon={editMode ? <CloseTwoToneIcon /> : <EditTwoToneIcon />}
                                        onClick={() => setEditMode(!editMode)}
                                        sx={{ 
                                            bgcolor: editMode ? '#ef4444' : colors.primary, 
                                            borderRadius: '12px', 
                                            fontWeight: 800,
                                            '&:hover': { bgcolor: editMode ? '#dc2626' : '#334155' }
                                        }}
                                    >
                                        {editMode ? 'Cancelar Edición' : 'Editar Receta'}
                                    </Button>
                                )}
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>

                {/* Contenido Principal: Formulario o Tabla */}
                <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>
                    {editMode ? (
                        <RecetaForm 
                            recetas={recetas} 
                            fetchRecetas={() => { 
                                setEditMode(false); 
                                fetchRecetas(); 
                            }} 
                        />
                    ) : (
                        <Box>
                            {recetas.length === 0 ? (
                                <Alert severity="info" sx={{ borderRadius: '16px', fontWeight: 600 }}>
                                    Este producto aún no tiene materiales asignados en su receta.
                                </Alert>
                            ) : (
                                <>
                                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, color: colors.primary }}>
                                        Insumos de Producción
                                    </Typography>
                                    <RenderRecetaTable 
                                        recetas={recetas} 
                                        formatMateriaPrima={formatMateriaPrima} 
                                        formatCantidad={formatCantidad} 
                                        formatCodigo={formatCodigo}
                                        colors={colors} 
                                    />
                                </>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </Fade>
    );
};

export default RecetaDetail;