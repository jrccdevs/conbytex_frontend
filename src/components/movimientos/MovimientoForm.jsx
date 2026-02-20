import { useState, useEffect } from 'react';
import { 
    Box, Button, Typography, Paper, Grid, Stack, IconButton, 
    TextField, Autocomplete, MenuItem, Avatar, Divider, Chip, Fade
} from '@mui/material';
import { 
    Close, Add, Remove, SyncAlt, Save, 
    Inventory2, Warehouse, Person, HistoryEdu 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getProductos } from '../../api/productosApi';
import { getEmpleados } from '../../api/empleadosApi';
import clienteApi from '../../api/clienteApi';
import { createMovimiento } from '../../api/movimientosApi';
import Swal from 'sweetalert2';

const MovimientoForm = () => {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [almacenes, setAlmacenes] = useState([]);
    const [empleados, setEmpleados] = useState([]);

    const [formData, setFormData] = useState({
        id_producto: '', id_almacen: '', id_empleado: '',
        tipo_movimiento: 'ingreso', cantidad: '', descripcion: ''
    });

    useEffect(() => {
        const loadData = async () => {
            const [resProd, resEmp, resAlm] = await Promise.all([
                getProductos(), getEmpleados(), clienteApi.get('/almacenes')
            ]);
            setProductos(resProd);
            setEmpleados(resEmp);
            setAlmacenes(resAlm.data);
        };
        loadData();
    }, []);

    const handleSubmit = async () => {
        // 1. Validación básica de campos
        if(!formData.id_producto || !formData.id_almacen || !formData.id_empleado) {
            return Swal.fire('Atención', 'Por favor completa todos los campos de selección', 'warning');
        }
    
        // 2. Validación de número positivo
        const cantNum = Number(formData.cantidad);
        if(isNaN(cantNum) || cantNum <= 0) {
            return Swal.fire('Error', 'La cantidad debe ser un número mayor a 0', 'error');
        }
    
        // 3. Validación de descripción en ajustes (Buena práctica)
        if(formData.tipo_movimiento === 'ajuste' && !formData.descripcion) {
            return Swal.fire('Atención', 'Los ajustes de inventario requieren una descripción de motivo', 'warning');
        }
    
        try {
            await createMovimiento({
                ...formData,
                cantidad: cantNum
            });
            Swal.fire('Registrado', 'Movimiento procesado con éxito', 'success');
            navigate('/movimientos');
        } catch (error) {
            // El error.response.data.message traerá el texto "Stock insuficiente..." del backend
            const mensaje = error.response?.data?.message || 'No se pudo completar la operación';
            Swal.fire('Operación Fallida', mensaje, 'error');
        }
    };
    const getMainColor = () => {
        if (formData.tipo_movimiento === 'ingreso') return '#2e7d32';
        if (formData.tipo_movimiento === 'salida') return '#d32f2f';
        return '#0288d1';
    };

    return (
        <Fade in={true}>
            <Box sx={{ p: { xs: 1, md: 4 }, display: 'flex', justifyContent: 'center', bgcolor: '#f4f6f8', minHeight: '90vh' }}>
                <Paper elevation={0} sx={{ width: '100%', maxWidth: 1100, borderRadius: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                    
                    {/* PANEL IZQUIERDO: Configuración */}
                    <Box sx={{ flex: 1, p: 4, bgcolor: 'white' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h5" fontWeight="800">Nueva Operación</Typography>
                            <IconButton onClick={() => navigate('/movimientos')}><Close /></IconButton>
                        </Stack>

                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, display: 'block' }}> TIPO DE MOVIMIENTO </Typography>
                                <Stack direction="row" spacing={1}>
                                    {[
                                        { id: 'ingreso', label: 'Ingreso', icon: <Add /> },
                                        { id: 'salida', label: 'Salida', icon: <Remove /> },
                                        { id: 'ajuste', label: 'Ajuste', icon: <SyncAlt /> }
                                    ].map((t) => (
                                        <Button
                                            key={t.id}
                                            variant={formData.tipo_movimiento === t.id ? 'contained' : 'outlined'}
                                            onClick={() => setFormData({ ...formData, tipo_movimiento: t.id })}
                                            startIcon={t.icon}
                                            sx={{ 
                                                flex: 1, 
                                                borderRadius: 2, 
                                                bgcolor: formData.tipo_movimiento === t.id ? getMainColor() : 'transparent',
                                                '&:hover': { bgcolor: formData.tipo_movimiento === t.id ? getMainColor() : '#f5f5f5' }
                                            }}
                                        >
                                            {t.label}
                                        </Button>
                                    ))}
                                </Stack>
                            </Box>

                            <Divider />

                            <Autocomplete
  options={productos}
  getOptionLabel={(p) => `${p.codigo} - ${p.nombre_producto} (${p.nombre_material} / ${p.nombre_color})`}
  value={productos.find(p => p.id_producto === formData.id_producto) || null}
  onChange={(event, newValue) => {
    setFormData({ ...formData, id_producto: newValue ? newValue.id_producto : '' });
  }}
  // Esto permite que el usuario busque por código o nombre
  filterOptions={(options, state) => {
    const display = state.inputValue.toLowerCase();
    return options.filter(p => 
      p.nombre_producto.toLowerCase().includes(display) || 
      p.codigo.toLowerCase().includes(display)
    );
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Buscar Producto (Código o Nombre)"
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <>
            <Inventory2 sx={{ mr: 1, color: 'action.active' }} />
            {params.InputProps.startAdornment}
          </>
        ),
      }}
    />
  )}
  // Mejora el rendimiento con listas largas
  noOptionsText="No se encontraron coincidencias"
/>

                            <TextField
                                select fullWidth label="Almacén"
                                value={formData.id_almacen}
                                onChange={(e) => setFormData({ ...formData, id_almacen: e.target.value })}
                                InputProps={{ startAdornment: <Warehouse sx={{ mr: 1, color: 'action.active' }} /> }}
                            >
                                {almacenes.map(a => <MenuItem key={a.id_almacen} value={a.id_almacen}>{a.nombre_almacen}</MenuItem>)}
                            </TextField>

                            <TextField
                                select fullWidth label="Responsable"
                                value={formData.id_empleado}
                                onChange={(e) => setFormData({ ...formData, id_empleado: e.target.value })}
                                InputProps={{ startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} /> }}
                            >
                                {empleados.map(emp => <MenuItem key={emp.id_empleado} value={emp.id_empleado}>{emp.nombre_empleado}</MenuItem>)}
                            </TextField>
                        </Stack>
                    </Box>

                    {/* PANEL DERECHO: Cantidad y Acción (El "Cajero") */}
                    <Box sx={{ width: { xs: '100%', md: 400 }, bgcolor: '#fafafa', p: 4, display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e0e0e0' }}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography variant="overline" color="text.secondary">CANTIDAD A PROCESAR</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                                <Typography variant="h2" fontWeight="900" sx={{ color: getMainColor() }}>
                                    {formData.cantidad || '0'}
                                </Typography>
                                <Typography variant="h5" sx={{ ml: 1, color: 'text.secondary' }}>Uds.</Typography>
                            </Box>
                        </Box>

                        <TextField
                            fullWidth
                            type="number"
                            placeholder="Ingrese cantidad"
                            value={formData.cantidad}
                            onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                            variant="outlined"
                            autoFocus
                            sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Comentarios del movimiento"
                            placeholder="Ej: Por reposición de stock..."
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            sx={{ mb: 'auto', '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                        />

                        <Box sx={{ mt: 4 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleSubmit}
                                startIcon={<Save />}
                                sx={{ 
                                    py: 2, 
                                    borderRadius: 3, 
                                    bgcolor: getMainColor(),
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    '&:hover': { bgcolor: getMainColor(), opacity: 0.9 }
                                }}
                            >
                                
                                Procesar {formData.tipo_movimiento}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Fade>
    );
};

export default MovimientoForm;