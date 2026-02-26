import { useEffect, useState } from 'react';
import { 
    Box, Typography, Button, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip, 
    CircularProgress, Fade, Stack, Avatar, useTheme, Card, Grid,
    TextField, InputAdornment // Importamos componentes para el buscador
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone'; // Icono de lupa
// ... (resto de tus imports de iconos iguales)
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';
import AssessmentTwoToneIcon from '@mui/icons-material/AssessmentTwoTone';
import { useNavigate } from 'react-router-dom';
import { getOrdenes, deleteOrden } from '../../api/ordenesApi';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const OrdenList = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // ESTADO PARA EL BUSCADOR
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const theme = useTheme();

    // ... (Tu lógica de permisos y colores exacta)
    const user = usuario?.user ?? usuario;
    const isAdmin = user?.roles?.some(r => r.slug === 'admin');
    const hasPermission = (perm) => user?.permissions?.some(p => p.slug === perm);
    const canCreate = isAdmin || hasPermission('orden.create');
    const canEdit   = isAdmin || hasPermission('orden.edit');
    const canDelete = isAdmin || hasPermission('orden.delete');

    const colors = {
        primary: '#1e293b',
        accent: '#6366f1',
        bgLight: '#f8fafc',
        border: '#f1f5f9',
        textMain: '#0f172a',
        textSecondary: '#64748b'
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

    // LÓGICA DE FILTRADO
    const ordenesFiltradas = ordenes.filter(o => 
        o.id_orden?.toString().toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.producto_terminado?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar orden?',
            text: "Esta acción no se puede deshacer y liberará recursos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: colors.primary,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            customClass: { popup: 'rounded-3xl' }
        });

        if (result.isConfirmed) {
            try {
                await deleteOrden(id);
                Swal.fire({ title: 'Eliminado', icon: 'success', customClass: { popup: 'rounded-3xl' } });
                fetchOrdenes();
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar la orden', 'error');
            }
        }
    };

    const getStatusStyles = (status) => {
        const config = {
            pendiente: { color: '#b45309', bg: '#fffbeb', label: 'Pendiente' },
            en_proceso: { color: '#1d4ed8', bg: '#eff6ff', label: 'En Proceso' },
            completado: { color: '#15803d', bg: '#f0fdf4', label: 'Completado' },
            cancelado: { color: '#b91c1c', bg: '#fef2f2', label: 'Cancelado' }
        };
        return config[status] || { color: '#475569', bg: '#f1f5f9', label: status };
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: 2 }}>
                <CircularProgress thickness={4} size={45} sx={{ color: colors.accent }} />
                <Typography variant="body2" sx={{ color: colors.textSecondary, fontWeight: 500 }}>Cargando panel de producción...</Typography>
            </Box>
        );
    }

    return (
        <Fade in={true} timeout={600}>
            <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: '1600px', mx: 'auto', bgcolor: '#fbfcfd', minHeight: '100vh' }}>
                
                {/* --- HEADER --- */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5, flexWrap: 'wrap', gap: 3 }}>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: colors.textMain, letterSpacing: '-1.5px', mb: 1 }}>
                            Producción
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                            <Typography variant="body2" sx={{ color: colors.textSecondary, fontWeight: 500 }}>
                                {ordenesFiltradas.length} órdenes encontradas
                            </Typography>
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: { xs: 1, md: 0 }, width: { xs: '100%', md: 'auto' } }}>
                        {/* BUSCADOR IMPLEMENTADO */}
                        <TextField
                            placeholder="Buscar por código o producto..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ 
                                bgcolor: '#fff', 
                                borderRadius: '12px',
                                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                minWidth: '300px'
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchTwoToneIcon sx={{ color: colors.textSecondary }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {canCreate && (
                            <Button 
                                variant="contained" 
                                startIcon={<AddCircleTwoToneIcon />} 
                                onClick={() => navigate('/orden/nuevo')}
                                sx={{ 
                                    bgcolor: colors.primary, borderRadius: '14px', px: 4, py: 1.5,
                                    textTransform: 'none', fontWeight: 700, fontSize: '0.95rem',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                    '&:hover': { bgcolor: '#000', transform: 'translateY(-2px)' },
                                    transition: 'all 0.2s',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Nueva Orden
                            </Button>
                        )}
                    </Stack>
                </Box>

                {/* --- METRICS CARDS --- */}
                <Grid container spacing={3} sx={{ mb: 5 }}>
                    {[
                        { label: 'Total Órdenes', value: ordenes.length, icon: <AssignmentTwoToneIcon />, color: colors.accent },
                        { label: 'En Proceso', value: ordenes.filter(o => o.estado === 'en_proceso').length, icon: <AssessmentTwoToneIcon />, color: '#3b82f6' },
                        { label: 'Retrasadas', value: ordenes.filter(o => o.dias_retraso > 0).length, icon: <CalendarTodayTwoToneIcon />, color: '#ef4444' }
                    ].map((card, i) => (
                        <Grid item xs={12} sm={4} key={i}>
                            <Paper sx={{ p: 3, borderRadius: '24px', border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', gap: 2, boxShadow: 'none' }}>
                                <Avatar sx={{ bgcolor: `${card.color}15`, color: card.color, width: 56, height: 56 }}>{card.icon}</Avatar>
                                <Box>
                                    <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase' }}>{card.label}</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: colors.textMain }}>{card.value}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* --- TABLA --- */}
                <TableContainer 
                    component={Paper} 
                    sx={{ 
                        borderRadius: '24px', 
                        border: `1px solid ${colors.border}`,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        overflowX: 'auto',
                    }}
                >
                    <Table sx={{ minWidth: 1100, tableLayout: 'auto' }}>
                        <TableHead sx={{ bgcolor: '#fff' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: colors.textSecondary, py: 3 }}>REFERENCIA</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: colors.textSecondary }}>PRODUCTO</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: colors.textSecondary }}>CANTIDAD</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: colors.textSecondary }}>RESPONSABLE</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: colors.textSecondary }}>PLAZO</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: colors.textSecondary }}>ESTADO</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: colors.textSecondary }}>ALERTA</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: colors.textSecondary, pr: 4 }}>ACCIONES</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ordenesFiltradas.map((o) => { // USAMOS LAS FILTRADAS AQUÍ
                                const status = getStatusStyles(o.estado);
                                return (
                                    <TableRow key={o.id_orden} sx={{ '&:hover': { bgcolor: '#fcfdfe' }, transition: 'background 0.2s' }}>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                            <Typography sx={{ fontWeight: 800, color: colors.accent, fontSize: '0.85rem' }}>
                                                ORD-{o.id_orden}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 700, color: colors.textMain, fontSize: '0.9rem', minWidth: '150px' }}>
                                                {o.producto_terminado}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1.5, py: 0.5, bgcolor: '#f1f5f9', borderRadius: '8px' }}>
                                                <Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>{o.cantidad_solicitada}</Typography>
                                                <Typography sx={{ ml: 0.5, color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>UDS</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', fontWeight: 700, bgcolor: colors.primary }}>
                                                    {o.empleado?.substring(0, 2).toUpperCase()}
                                                </Avatar>
                                                <Typography sx={{ fontWeight: 500, color: colors.textMain, fontSize: '0.85rem' }}>{o.empleado}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                            <Box>
                                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: colors.textMain }}>
                                                    {o.fecha_entrega_estimada ? new Date(o.fecha_entrega_estimada).toLocaleDateString() : '---'}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                                    Inicio: {new Date(o.fecha).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={status.label} 
                                                sx={{ 
                                                    fontWeight: 700, fontSize: '0.7rem', 
                                                    bgcolor: status.bg, color: status.color,
                                                    borderRadius: '10px', height: '28px',
                                                    border: `1px solid ${status.color}20`
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {/* (Logica de alertas igual...) */}
                                            {!o.fecha_entrega_estimada ? (
                                                <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>Sin fecha límite</Typography>
                                            ) : o.estado === 'cancelado' ? (
                                                <Typography sx={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600 }}>Orden cancelada</Typography>
                                            ) : o.estado === 'pendiente' ? (
                                                <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>Pendiente de iniciar</Typography>
                                            ) : o.estado === 'completado' ? (
                                                o.dias_retraso > 0 ? (
                                                    <Chip label={`${o.dias_retraso}d de retraso`} size="small" sx={{ bgcolor: '#fff1f2', color: '#e11d48', fontWeight: 800, fontSize: '0.7rem' }} />
                                                ) : (
                                                    <Chip label="Completado en tiempo" size="small" sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700, fontSize: '0.7rem' }} />
                                                )
                                            ) : o.estado === 'en_proceso' ? (
                                                o.retraso_actual > 0 ? (
                                                    <Chip label={`${o.retraso_actual}d de retraso`} size="small" sx={{ bgcolor: '#fff1f2', color: '#e11d48', fontWeight: 800, fontSize: '0.7rem' }} />
                                                ) : (
                                                    <Typography sx={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 600 }}>En plazo</Typography>
                                                )
                                            ) : (
                                                <Typography sx={{ color: '#cbd5e1', fontSize: '0.8rem' }}>---</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="right" sx={{ pr: 3, whiteSpace: 'nowrap' }}>
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Tooltip title="Explorar">
                                                    <IconButton onClick={() => navigate(`/orden/detalle/${o.id_orden}`)} sx={{ color: colors.textSecondary, '&:hover': { color: colors.accent, bgcolor: `${colors.accent}10` } }}>
                                                        <VisibilityTwoToneIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                {canEdit && (
                                                    <Tooltip title="Editar">
                                                        <IconButton onClick={() => navigate(`/orden/editar/${o.id_orden}`)} sx={{ color: colors.textSecondary, '&:hover': { color: colors.primary, bgcolor: '#f1f5f9' } }}>
                                                            <EditTwoToneIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {canDelete && (
                                                    <Tooltip title="Eliminar">
                                                        <IconButton onClick={() => handleDelete(o.id_orden)} sx={{ color: '#fda4af', '&:hover': { color: '#e11d48', bgcolor: '#fff1f2' } }}>
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

                {ordenesFiltradas.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 12, bgcolor: '#fff', borderRadius: '32px', mt: 3, border: `2px dashed ${colors.border}` }}>
                        <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 3, bgcolor: colors.bgLight }}>
                            <AssignmentTwoToneIcon sx={{ fontSize: 40, color: '#cbd5e1' }} />
                        </Avatar>
                        <Typography variant="h6" sx={{ color: colors.textMain, fontWeight: 700 }}>Sin resultados</Typography>
                        <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>No encontramos órdenes que coincidan con tu búsqueda.</Typography>
                    </Box>
                )}
            </Box>
        </Fade>
    );
};

export default OrdenList;