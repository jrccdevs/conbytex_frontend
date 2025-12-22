import { useEffect, useState } from 'react';
import { 
    Box, Typography, Button, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip, CircularProgress, Stack 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useNavigate } from 'react-router-dom';
import { getMovimientos, deleteMovimiento } from '../../api/movimientosApi';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const MovimientosList = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { usuario } = useAuth();

    const fetchMovimientos = async () => {
        setLoading(true);
        try {
            const data = await getMovimientos();
            setMovimientos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMovimientos(); }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar registro?',
            text: "Esto no afectará el stock actual, solo borra el historial.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        });

        if (result.isConfirmed) {
            try {
                await deleteMovimiento(id);
                fetchMovimientos();
                Swal.fire('Eliminado', 'El registro ha sido borrado', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar', 'error');
            }
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" color="primary">Historial de Inventario</Typography>
                {usuario?.role === 'admin' && (
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={() => navigate('/movimientos/nuevo')}
                    >
                        Nuevo Movimiento
                    </Button>
                )}
            </Stack>

            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Cantidad</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Almacén</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Empleado</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movimientos.map((m) => (
                            <TableRow key={m.id_movimiento} hover>
                                <TableCell>{new Date(m.fecha).toLocaleString()}</TableCell>
                                <TableCell sx={{ fontWeight: 'medium' }}>{m.nombre_producto}</TableCell>
                                <TableCell>
                                <Chip 
                                     // Cambiado de 'entrada' a 'ingreso'
                                     icon={m.tipo_movimiento === 'ingreso' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                     label={m.tipo_movimiento.toUpperCase()} 
                                     color={m.tipo_movimiento === 'ingreso' ? 'success' : 'error'} 
                                     variant="outlined"
                                     size="small"
                                />
                                </TableCell>
                                <TableCell>
                                  <Typography 
                                         fontWeight="bold" 
                                         // Cambiamos 'entrada' por 'ingreso'
                                        color={m.tipo_movimiento === 'ingreso' ? 'success.main' : 'error.main'}
                                           >
                                        {/* Lógica para mostrar + si es ingreso, - si es salida o ajuste */}
                                       {m.tipo_movimiento === 'ingreso' ? `+${m.cantidad}` : `-${m.cantidad}`}
                                    </Typography>
                                   </TableCell>
                                <TableCell>{m.nombre_almacen}</TableCell>
                                <TableCell>{m.empleado}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Ver detalles">
                                        <IconButton color="info" onClick={() => navigate(`/movimientos/${m.id_movimiento}`)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                    {usuario?.role === 'admin' && (
                                        <IconButton color="error" onClick={() => handleDelete(m.id_movimiento)}>
                                            <DeleteIcon />
                                        </IconButton>
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

export default MovimientosList;