import { useState, useEffect } from 'react';
import { 
    Box, TextField, Button, MenuItem, Grid, Card, CardContent, Typography, Divider 
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductos } from '../../api/productosApi'; // Reutilizamos tu API de productos
import { createOrden, getOrdenById, updateOrden } from '../../api/ordenesApi';
import clienteApi from '../../api/clienteApi'; // USANDO CLIENTE API
import Swal from 'sweetalert2';

const OrdenForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [formData, setFormData] = useState({
        id_producto: '',
        id_empleado: '',
        cantidad_solicitada: '',
        estado: 'pendiente'
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [resProd, resEmp] = await Promise.all([
                    getProductos(),
                    clienteApi.get('/empleados') // Cargamos empleados directamente con el cliente
                ]);
                
                // Filtramos productos que sean terminados (suponiendo id_tipo_producto 1 o 2)
                setProductos(resProd); 
                setEmpleados(resEmp.data);

                if (id) {
                    const ordenExistente = await getOrdenById(id);
                    setFormData({
                        id_producto: ordenExistente.id_producto,
                        id_empleado: ordenExistente.id_empleado,
                        cantidad_solicitada: ordenExistente.cantidad_solicitada,
                        estado: ordenExistente.estado
                    });
                }
            } catch (error) {
                console.error("Error cargando datos del formulario", error);
            }
        };
        loadInitialData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await updateOrden(id, formData);
                Swal.fire('¡Actualizado!', 'La orden se actualizó con éxito', 'success');
            } else {
                await createOrden(formData);
                Swal.fire('¡Creado!', 'La orden de producción fue generada', 'success');
            }
            navigate('/ordenes');
        } catch (error) {
            Swal.fire('Error', 'No se pudo procesar la solicitud', 'error');
        }
    };

    return (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ maxWidth: 700, width: '100%', borderRadius: 4, elevation: 5 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                        {id ? `Editar Orden #${id}` : 'Nueva Orden de Producción'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Complete los campos para gestionar la fabricación del producto.
                    </Typography>
                    <Divider sx={{ mb: 4 }} />

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Producto a Fabricar"
                                    value={formData.id_producto}
                                    onChange={(e) => setFormData({...formData, id_producto: e.target.value})}
                                    required
                                >
                                    {productos.map(p => (
                                        <MenuItem key={p.id_producto} value={p.id_producto}>
                                            {p.nombre_producto} | {p.nombre_material} | {p.nombre_color}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Empleado Responsable"
                                    value={formData.id_empleado}
                                    onChange={(e) => setFormData({...formData, id_empleado: e.target.value})}
                                    required
                                >
                                    {empleados.map(emp => (
                                        <MenuItem key={emp.id_empleado} value={emp.id_empleado}>
                                            {emp.nombre_empleado}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Cantidad Solicitada"
                                    type="number"
                                    value={formData.cantidad_solicitada}
                                    onChange={(e) => setFormData({...formData, cantidad_solicitada: e.target.value})}
                                    required
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>

                            {id && (
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Estado de la Orden"
                                        value={formData.estado}
                                        onChange={(e) => setFormData({...formData, estado: e.target.value})}
                                    >
                                        <MenuItem value="pendiente">Pendiente</MenuItem>
                                        <MenuItem value="en proceso">En Proceso</MenuItem>
                                        <MenuItem value="completada">Completada</MenuItem>
                                        <MenuItem value="cancelada">Cancelada</MenuItem>
                                    </TextField>
                                </Grid>
                            )}

                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button 
                                        fullWidth 
                                        variant="outlined" 
                                        onClick={() => navigate('/ordenes')}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button 
                                        fullWidth 
                                        variant="contained" 
                                        type="submit"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        {id ? 'Actualizar Orden' : 'Generar Orden'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default OrdenForm;