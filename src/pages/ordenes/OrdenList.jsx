import { useEffect, useState } from 'react';
import { 
    Box, Typography, Button, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip, CircularProgress 
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { getOrdenes, deleteOrden } from '../../api/ordenesApi';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const OrdenList = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { usuario } = useAuth();

    const fetchOrdenes = async () => {
        setLoading(true);
        try {
            const data = await getOrdenes();
            setOrdenes(data);
        } catch (error) {
            console.error("Error al cargar órdenes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrdenes(); }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar orden?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await deleteOrden(id);
                Swal.fire('Eliminado', 'La orden ha sido borrada', 'success');
                fetchOrdenes();
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar la orden', 'error');
            }
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Órdenes de Producción
                </Typography>
                {usuario?.role === 'admin' && (
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={() => navigate('/ordenes/nueva')}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Nueva Orden
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Cant.</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Empleado Asignado</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ordenes.map((o) => (
                            <TableRow key={o.id_orden} hover>
                                <TableCell>#{o.id_orden}</TableCell>
                                <TableCell sx={{ fontWeight: 'medium' }}>{o.producto_terminado}</TableCell>
                                <TableCell>{o.cantidad_solicitada}</TableCell>
                                <TableCell>{o.empleado}</TableCell>
                                <TableCell>{new Date(o.fecha).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={o.estado.toUpperCase()} 
                                        size="small" 
                                        color={o.estado === 'pendiente' ? 'warning' : 'success'} 
                                        sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Ver Detalle / Materiales">
                                        <IconButton color="info" onClick={() => navigate(`/ordenes/${o.id_orden}`)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                    {usuario?.role === 'admin' && (
                                        <>
                                            <IconButton color="primary" onClick={() => navigate(`/ordenes/editar/${o.id_orden}`)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(o.id_orden)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default OrdenList;