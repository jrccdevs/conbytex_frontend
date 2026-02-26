import { useEffect, useState } from 'react';
import { 
    Box, Typography, Button, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip, 
    CircularProgress, Stack, TextField, InputAdornment, Fade, MenuItem 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';
import { getMovimientos, deleteMovimiento } from '../../api/movimientosApi';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const MovimientosList = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [filteredMovimientos, setFilteredMovimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para filtros
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('todos'); // Nuevo estado para tipo

    const navigate = useNavigate();
    const { usuario } = useAuth();

    const user = usuario?.user ?? usuario;
    const isAdmin = user?.roles?.some(r => r.slug === 'admin');
    const hasPermission = (perm) => user?.permissions?.some(p => p.slug === perm);

    const canCreate = isAdmin || hasPermission('movimientos.create');
    const canDelete = isAdmin || hasPermission('movimientos.delete');

    const fetchMovimientos = async () => {
        setLoading(true);
        try {
            const data = await getMovimientos();
            setMovimientos(data);
            setFilteredMovimientos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMovimientos(); }, []);

    /* ============================
       🔎 LÓGICA DE FILTRADO (Actualizada)
       ============================ */
    useEffect(() => {
        let result = movimientos;

        // Filtro por nombre de producto/material
        if (search) {
            result = result.filter(m => 
                m.nombre_producto?.toLowerCase().includes(search.toLowerCase()) ||
                m.nombre_material?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Filtro por Tipo de Movimiento
        if (tipoFiltro !== 'todos') {
            result = result.filter(m => m.tipo_movimiento === tipoFiltro);
        }

        // Filtro por rango de fechas
        if (startDate) {
            result = result.filter(m => new Date(m.fecha) >= new Date(startDate));
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            result = result.filter(m => new Date(m.fecha) <= end);
        }

        setFilteredMovimientos(result);
    }, [search, startDate, endDate, tipoFiltro, movimientos]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar registro?',
            text: "Esto no afectará el stock actual, solo borra el historial.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
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

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>;

    return (
        <Fade in timeout={600}>
            <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
                
                {/* HEADER */}
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
                            Kárdex de Movimientos
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                            Auditoría de ingresos y salidas de inventario
                        </Typography>
                    </Box>
                    {canCreate && (
                        <Button 
                            variant="contained" 
                            disableElevation
                            startIcon={<AddIcon />} 
                            onClick={() => navigate('/movimientos/nuevo')}
                            sx={{ bgcolor: '#6366f1', borderRadius: '10px', px: 3, py: 1.2, textTransform: 'none', fontWeight: 700 }}
                        >
                            Nuevo Movimiento
                        </Button>
                    )}
                </Stack>

                {/* BARRA DE FILTROS AVANZADA */}
                <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        {/* Buscador de Producto */}
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Buscar producto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: '#6366f1' }} /></InputAdornment>),
                                sx: { borderRadius: '8px', bgcolor: '#f8fafc' }
                            }}
                            sx={{ flex: 1.5 }}
                        />

                        {/* Filtro por Tipo (Select) */}
                        <TextField
                            select
                            size="small"
                            label="Tipo"
                            value={tipoFiltro}
                            onChange={(e) => setTipoFiltro(e.target.value)}
                            InputProps={{
                                startAdornment: (<InputAdornment position="start"><FilterListIcon sx={{ color: '#6366f1', fontSize: 20 }} /></InputAdornment>),
                                sx: { borderRadius: '8px' }
                            }}
                            sx={{ flex: 0.8 }}
                        >
                            <MenuItem value="todos">Todos</MenuItem>
                            <MenuItem value="ingreso">Ingresos</MenuItem>
                            <MenuItem value="salida">Salidas</MenuItem>
                        </TextField>

                        {/* Rango de Fechas */}
                        <TextField
                            type="date"
                            size="small"
                            label="Desde"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: { borderRadius: '8px' } }}
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            type="date"
                            size="small"
                            label="Hasta"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: { borderRadius: '8px' } }}
                            sx={{ flex: 1 }}
                        />
                    </Stack>
                </Paper>

                {/* TABLA DE RESULTADOS */}
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <Box sx={{ width: '100%', overflowX: 'auto' }}>
                        <Table sx={{ minWidth: 900 }}>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Fecha / Hora</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Producto Detalle</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Tipo</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Cant.</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Almacén</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Empleado</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredMovimientos.map((m) => (
                                    <TableRow key={m.id_movimiento} hover>
                                        <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                                            <strong>{new Date(m.fecha).toLocaleDateString()}</strong> <br/>
                                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                {new Date(m.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                                            {[m.nombre_producto, m.nombre_material, m.nombre_color, m.nombre_talla].filter(Boolean).join(' - ')}
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={m.tipo_movimiento.toUpperCase()} 
                                                size="small"
                                                sx={{ 
                                                    fontWeight: 800, 
                                                    fontSize: '0.65rem',
                                                    bgcolor: m.tipo_movimiento === 'ingreso' ? '#dcfce7' : '#fee2e2',
                                                    color: m.tipo_movimiento === 'ingreso' ? '#166534' : '#991b1b',
                                                }} 
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography fontWeight="900" sx={{ color: m.tipo_movimiento === 'ingreso' ? '#16a34a' : '#dc2626' }}>
                                                {m.tipo_movimiento === 'ingreso' ? `+${m.cantidad}` : `-${m.cantidad}`}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.85rem', color: '#64748b' }}>{m.nombre_almacen}</TableCell>
                                        <TableCell sx={{ fontSize: '0.85rem', color: '#64748b' }}>{m.empleado}</TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" justifyContent="center" spacing={1}>
                                                <IconButton size="small" sx={{ color: '#6366f1', bgcolor: '#f5f3ff', '&:hover': { bgcolor: '#e0e7ff' } }} onClick={() => navigate(`/movimientos/${m.id_movimiento}`)}>
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                                {canDelete && (
                                                    <IconButton size="small" sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }} onClick={() => handleDelete(m.id_movimiento)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredMovimientos.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                                            <Box sx={{ opacity: 0.5 }}>
                                                <FilterListIcon sx={{ fontSize: 48, mb: 1 }} />
                                                <Typography variant="body1">No se encontraron registros coincidentes</Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Box>
                </TableContainer>
            </Box>
        </Fade>
    );
};

export default MovimientosList;