import {
  Drawer, Box, Typography, TextField,
  Button, MenuItem, Switch, FormControlLabel, Stack, IconButton, alpha
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  Close, AppRegistrationTwoTone, CategoryTwoTone,
  LayersTwoTone, StraightenTwoTone, PaletteTwoTone,
  RuleTwoTone, SaveTwoTone, SettingsSuggestTwoTone,
  CheckCircleTwoTone
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { createProducto, updateProducto } from '../../api/productosApi';
import { getMaterials } from '../../api/materialsApi';
import { getSizes } from '../../api/sizesApi';
import { getColors } from '../../api/colorsApi';
import { getUnidades } from '../../api/unidadesApi';

// COMPONENTE CON LÍNEA DE ENFOQUE EN DEGRADADO
const BloqueCampo = ({ icon: Icon, etiqueta, children }) => (
  <Box sx={{
    mb: 3,
    position: 'relative',
    '& .linea-decorativa': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '0%',
      height: '2px',
      background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)',
      transition: 'width 0.4s ease',
    },
    '&:focus-within .linea-decorativa': {
      width: '100%',
    }
  }}>
    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
      <Icon sx={{ fontSize: 18, color: '#94a3b8' }} />
      <Typography sx={{ 
        fontWeight: 800, 
        fontSize: '0.7rem', 
        color: '#64748b', 
        textTransform: 'uppercase', 
        letterSpacing: 1 
      }}>
        {etiqueta}
      </Typography>
    </Stack>
    <Box sx={{ pb: 0.5 }}>
      {children}
    </Box>
    {/* Esta es la línea que aparece con el degradado */}
    <div className="linea-decorativa" />
    <Divider sx={{ position: 'absolute', bottom: 0, width: '100%', borderColor: alpha('#1e293b', 0.05) }} />
  </Box>
);

// Agregamos un pequeño Divider para la base
const Divider = ({ sx }) => <Box sx={{ borderBottom: '1px solid', ...sx }} />;

const ProductoModal = ({ open, setOpen, fetchProductos, producto }) => {
  // --- TU LÓGICA ORIGINAL INTACTA ---
  const [form, setForm] = useState({
    nombre_producto: '', tipo_producto: '', id_material: '',
    id_talla: '', id_color: '', id_unidadmedida: '', activo: true
  });

  const [materiales, setMateriales] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [colores, setColores] = useState([]);
  const [unidades, setUnidades] = useState([]);

  useEffect(() => {
    getMaterials().then(setMateriales);
    getSizes().then(setTallas);
    getColors().then(setColores);
    getUnidades().then(setUnidades);
  }, []);

  useEffect(() => {
    if (producto) {
      setForm({
        nombre_producto: producto.nombre_producto || '',
        tipo_producto: producto.tipo_producto || '',
        id_material: producto.id_material || '',
        id_talla: producto.id_talla ?? null,
        id_color: producto.id_color || '',
        id_unidadmedida: producto.id_unidadmedida || '',
        activo: producto.activo ?? true
      });
    } else {
      setForm({
        nombre_producto: '', tipo_producto: '', id_material: '',
        id_talla: '', id_color: '', id_unidadmedida: '', activo: true
      });
    }
  }, [producto, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const textFields = ['nombre_producto', 'tipo_producto'];
    setForm(prev => {
      const newValue = type === 'checkbox' ? checked : textFields.includes(name) ? value.toUpperCase() : value;
      const updatedForm = { ...prev, [name]: newValue };
      if (name === 'tipo_producto' && newValue === 'MP') updatedForm.id_talla = null;
      return updatedForm;
    });
  };

  const handleSubmit = async () => {
    // Configuración base para SweetAlert2 (diseño consistente)
    const swalConfig = {
      confirmButtonColor: '#0f172a', // Azul Medianoche
      cancelButtonColor: '#94a3b8',
      customClass: {
        popup: 'border-radius-20', // Clase para bordes redondeados
        title: 'custom-swal-title',
        confirmButton: 'custom-swal-button'
      },
      buttonsStyling: true
    };

    const required = ['nombre_producto', 'tipo_producto', 'id_material', 'id_unidadmedida'];
    
    // Alertas de Validación (Error/Warning)
    for (let f of required) { 
      if (!form[f]) { 
        Swal.fire({
          ...swalConfig,
          icon: 'warning',
          title: 'Campo Obligatorio',
          text: `El campo [${f.replace('_', ' ').toUpperCase()}] es necesario para continuar.`,
          confirmButtonColor: '#6366f1' // Azul Eléctrico para llamar la atención
        }); 
        return; 
      } 
    }

    if (form.tipo_producto === 'PT' && !form.id_talla) { 
      Swal.fire({
        ...swalConfig,
        icon: 'warning',
        title: 'Falta Información',
        text: 'La talla es obligatoria para Productos Terminados (PT)',
        confirmButtonColor: '#6366f1'
      }); 
      return; 
    }

    try {
      if (producto) {
        await updateProducto(producto.id_producto, form, localStorage.getItem('token'));
      } else {
        await createProducto(form, localStorage.getItem('token'));
      }
      
      fetchProductos(); 
      setOpen(false);

      // Alerta de Éxito Estilizada
      Swal.fire({
        ...swalConfig,
        icon: 'success',
        title: '¡Sincronizado!',
        text: producto ? 'Los cambios se aplicaron correctamente.' : 'El nuevo producto ha sido registrado.',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
        // Usamos un degradado en la barra de progreso que combine con tu línea azul
        didOpen: (toast) => {
          const pb = toast.querySelector('.swal2-timer-progress-bar');
          if(pb) pb.style.backgroundColor = 'linear-gradient(90deg, #6366f1, #06b6d4)';
        }
      });

    } catch (error) { 
      Swal.fire({
        ...swalConfig,
        icon: 'error',
        title: 'Fallo de Conexión',
        text: 'No se pudo establecer comunicación con el servidor.',
        confirmButtonColor: '#ef4444' // Rojo suave para errores críticos
      }); 
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{ sx: { width: { xs: '100%', sm: 480 }, border: 'none' } }}
    >
      {/* CABECERA MODERNA */}
      <Box sx={{ p: 4, bgcolor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a' }}>
              {producto ? 'Editar Producto' : 'Nuevo Producto'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Complete los detalles técnicos del activo
            </Typography>
          </Box>
          <IconButton onClick={() => setOpen(false)} sx={{ bgcolor: '#f1f5f9' }}>
            <Close />
          </IconButton>
        </Stack>
      </Box>

      {/* FORMULARIO */}
      <Box sx={{ p: 4, flexGrow: 1, overflowY: 'auto' }}>
        
        <BloqueCampo icon={AppRegistrationTwoTone} etiqueta="Nombre del Producto">
          <TextField 
            fullWidth 
            name="nombre_producto"
            value={form.nombre_producto} 
            onChange={handleChange} 
            variant="standard"
            placeholder="Ingrese nombre..."
            InputProps={{ disableUnderline: true, sx: { fontWeight: 700, py: 0.5 } }}
          />
        </BloqueCampo>

        <BloqueCampo icon={CategoryTwoTone} etiqueta="Tipo de Producto">
          <TextField
            select fullWidth name="tipo_producto"
            value={form.tipo_producto} onChange={handleChange} variant="standard"
            InputProps={{ disableUnderline: true, sx: { fontWeight: 600 } }}
          >
            <MenuItem value="MP">MP - Materia Prima</MenuItem>
            <MenuItem value="PT">PT - Producto Terminado</MenuItem>
          </TextField>
        </BloqueCampo>

        <BloqueCampo icon={LayersTwoTone} etiqueta="Material">
          <TextField 
            select fullWidth name="id_material"
            value={form.id_material} onChange={handleChange} variant="standard"
            InputProps={{ disableUnderline: true, sx: { fontWeight: 600 } }}
          >
            {materiales.map(m => <MenuItem key={m.id_material} value={m.id_material}>{m.nombre_material}</MenuItem>)}
          </TextField>
        </BloqueCampo>

        <BloqueCampo icon={StraightenTwoTone} etiqueta="Talla">
          <TextField
            select fullWidth name="id_talla"
            value={form.id_talla || ''} onChange={handleChange}
            disabled={form.tipo_producto === 'MP'} variant="standard"
            InputProps={{ disableUnderline: true, sx: { fontWeight: 600 } }}
          >
            <MenuItem value=""><em>No aplica</em></MenuItem>
            {tallas.map(t => <MenuItem key={t.id_talla} value={t.id_talla}>{t.nombre_talla}</MenuItem>)}
          </TextField>
        </BloqueCampo>

        <BloqueCampo icon={PaletteTwoTone} etiqueta="Color">
          <TextField 
            select fullWidth name="id_color"
            value={form.id_color} onChange={handleChange} variant="standard"
            InputProps={{ disableUnderline: true, sx: { fontWeight: 600 } }}
          >
            {colores.map(c => <MenuItem key={c.id_color} value={c.id_color}>{c.nombre_color}</MenuItem>)}
          </TextField>
        </BloqueCampo>

        <BloqueCampo icon={RuleTwoTone} etiqueta="Unidad de Medida">
          <TextField 
            select fullWidth name="id_unidadmedida"
            value={form.id_unidadmedida} onChange={handleChange} variant="standard"
            InputProps={{ disableUnderline: true, sx: { fontWeight: 600 } }}
          >
            {unidades.map(u => <MenuItem key={u.id_unidad} value={u.id_unidad}>{u.nombre_unidad}</MenuItem>)}
          </TextField>
        </BloqueCampo>
        <Box sx={{ 
          p: 2, 
          borderRadius: 4, 
          bgcolor: form.activo ? alpha('#10b981', 0.05) : alpha('#f43f5e', 0.05),
          border: '1px dashed',
          borderColor: form.activo ? '#10b981' : '#f43f5e',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
            <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircleTwoTone sx={{ color: form.activo ? '#10b981' : '#f43f5e' }} />
                <Typography sx={{ fontWeight: 900, fontSize: '0.7rem', color: form.activo ? '#065f46' : '#991b1b' }}>
                    {form.activo ? 'ESTADO: ACTIVO' : 'ESTADO: INACTIVO'}
                </Typography>
            </Stack>
            <FormControlLabel
              control={<Switch checked={form.activo} onChange={handleChange} name="activo" color="success" />}
              label=""
            />
        </Box>
      </Box>

      {/* BOTÓN FINAL */}
      <Box sx={{ p: 4, bgcolor: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <Button 
          fullWidth 
          variant="contained" 
          onClick={handleSubmit}
          startIcon={<SaveTwoTone />}
          sx={{ 
            bgcolor: '#0f172a', 
            py: 2.2, 
            borderRadius: '16px', 
            fontWeight: 900,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 10px 20px rgba(15, 23, 42, 0.2)',
            '&:hover': { bgcolor: '#6366f1' }
          }}
        >
          {producto ? 'Guardar Actualización' : 'Registrar Nuevo Producto'}
        </Button>
      </Box>
    </Drawer>
  );
};

export default ProductoModal;