import { useEffect, useState } from 'react';
import { 
    Box, Typography, Button, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip, 
    CircularProgress, Fade, Stack, Avatar, useTheme
} from '@mui/material';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';
import { useNavigate } from 'react-router-dom';
import { getOrdenes, deleteOrden } from '../../api/ordenesApi';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const OrdenList = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const theme = useTheme();

    const user = usuario?.user ?? usuario;
    const isAdmin = user?.roles?.some(r => r.slug === 'admin');
    const hasPermission = (perm) => user?.permissions?.some(p => p.slug === perm);

    // Permisos específicos para órdenes
    const canCreate = isAdmin || hasPermission('orden.create');
    const canEdit   = isAdmin || hasPermission('orden.edit');
    const canDelete = isAdmin || hasPermission('orden.delete'); // o 'ordenes.delete' según tu API
    // Paleta de colores consistente
    const colors = {
        primary: '#0f172a',
        accent: '#6366f1',
        bgLight: '#f8fafc',
        border: '#e2e8f0'
    };

    const fetchOrdenes = async () => {
        setLoading(true);
        try {
            const data = await getOrdenes();
            setOrdenes(Array.isArray(data) ? data : []);
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
            text: "Esta acción liberará los recursos asignados.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: colors.primary,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            customClass: { popup: 'rounded-2xl' }
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

    const getStatusStyles = (status) => {
        const config = {
            pendiente: { color: '#f59e0b', bg: '#fef3c7', label: 'Pendiente' },
            en_proceso: { color: '#3b82f6', bg: '#dbeafe', label: 'En Proceso' },
            completado: { color: '#10b981', bg: '#d1fae5', label: 'Completado' }
        };
        return config[status] || { color: '#64748b', bg: '#f1f5f9', label: status };
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress thickness={5} size={50} sx={{ color: colors.accent }} />
            </Box>
        );
    }

    return (
        <Fade in={true}>
            <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', mx: 'auto' }}>
                {/* --- HEADER --- */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 4,
                    flexWrap: 'wrap',
                    gap: 2 
                }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: colors.primary, letterSpacing: '-1px' }}>
                            Órdenes de Producción
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                            Gestiona y monitorea el flujo de fabricación en tiempo real.
                        </Typography>
                    </Box>
                    {canCreate && (
                        <Button 
                            variant="contained" 
                            startIcon={<AddCircleTwoToneIcon />} 
                            onClick={() => navigate('/orden/nuevo')}
                            sx={{ 
                                bgcolor: colors.primary, 
                                borderRadius: '12px', 
                                px: 3, py: 1.2,
                                textTransform: 'none', 
                                fontWeight: 800,
                                boxShadow: '0 10px 20px rgba(15, 23, 42, 0.15)',
                                '&:hover': { bgcolor: '#1e293b' }
                            }}
                        >
                            Nueva Orden
                        </Button>
                   )}
                </Box>

                {/* --- TABLA --- */}
                <TableContainer 
                    component={Paper} 
                    elevation={0} 
                    sx={{ 
                        borderRadius: '20px', 
                        border: `1px solid ${colors.border}`,
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}
                >
                    <Table>
                        <TableHead sx={{ bgcolor: colors.bgLight }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Referencia</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Producto Terminado</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Cantidad</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Responsable</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Fecha Registro</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Estado</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 800, color: '#475569' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ordenes.map((o) => {
                                const status = getStatusStyles(o.estado);
                                return (
                                    <TableRow key={o.id_orden} hover sx={{ '&:last-child td': { border: 0 } }}>
                                        <TableCell>
                                            <Chip 
                                                label={`#ORD-${o.id_orden}`} 
                                                size="small" 
                                                sx={{ fontWeight: 700, bgcolor: colors.border, color: colors.primary }} 
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: colors.primary }}>
                                                {o.producto_terminado}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 800 }}>{o.cantidad_solicitada}</Typography>
                                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>uds</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: colors.accent }}>
                                                    {o.empleado?.charAt(0)}
                                                </Avatar>
                                                <Typography variant="body2">{o.empleado}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#64748b' }}>
                                                <CalendarTodayTwoToneIcon sx={{ fontSize: 16 }} />
                                                <Typography variant="body2">
                                                    {new Date(o.fecha).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={status.label.toUpperCase()} 
                                                size="small" 
                                                sx={{ 
                                                    fontWeight: 800, 
                                                    fontSize: '0.65rem', 
                                                    bgcolor: status.bg, 
                                                    color: status.color,
                                                    borderRadius: '6px'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={0.5} justifyContent="center">
                                                <Tooltip title="Ver Detalles">
                                                    <IconButton 
                                                        size="small" 
                                                        sx={{ color: colors.accent, '&:hover': { bgcolor: '#eef2ff' } }}
                                                        onClick={() => navigate(`/orden/detalle/${o.id_orden}`)}
                                                    >
                                                        <VisibilityTwoToneIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                
                                               
                                                      {canEdit && (
                                                        <Tooltip title="Editar">
                                                            <IconButton 
                                                                size="small" 
                                                                sx={{ color: colors.primary, '&:hover': { bgcolor: colors.bgLight } }}
                                                                onClick={() => navigate(`/orden/editar/${o.id_orden}`)}
                                                            >
                                                                <EditTwoToneIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                      )}
                                                      {canDelete && (
                                                        <Tooltip title="Eliminar">
                                                            <IconButton 
                                                                size="small" 
                                                                sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}
                                                                onClick={() => handleDelete(o.id_orden)}
                                                            >
                                                                <DeleteTwoToneIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                     )}
                                               
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                {ordenes.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 10, bgcolor: colors.bgLight, borderRadius: '20px', mt: 2, border: `2px dashed ${colors.border}` }}>
                        <AssignmentTwoToneIcon sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#94a3b8' }}>No se encontraron órdenes registradas</Typography>
                    </Box>
                )}
            </Box>
        </Fade>
    );
};

export default OrdenList;