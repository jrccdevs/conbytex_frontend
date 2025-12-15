import {
    Modal, Box, Typography, TextField,
    Button, MenuItem, Switch, FormControlLabel
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import Swal from 'sweetalert2';
  import { createProducto, updateProducto } from '../../api/productosApi';
  import { getMaterials } from '../../api/materialsApi';
  import { getSizes } from '../../api/sizesApi';
  import { getColors } from '../../api/colorsApi';
  import { getUnidades } from '../../api/unidadesApi';
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: 2,
    p: 4
  };
  
  const ProductoModal = ({ open, setOpen, fetchProductos, producto }) => {
    const [form, setForm] = useState({
      nombre_producto: '',
      tipo_producto: '',
      id_material: '',
      id_talla: '',
      id_color: '',
      id_unidadmedida: '',
      activo: true
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
        }
      }, [producto]);
      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
      
        const textFields = ['nombre_producto', 'tipo_producto'];
      
        setForm(prev => {
          const newValue =
            type === 'checkbox'
              ? checked
              : textFields.includes(name)
                ? value.toUpperCase()
                : value;
      
          const updatedForm = {
            ...prev,
            [name]: newValue
          };
      
          // 👉 Si es MP, talla debe ser NULL (no string vacío)
          if (name === 'tipo_producto' && newValue === 'MP') {
            updatedForm.id_talla = null;
          }
      
          return updatedForm;
        });
      };
      const handleSubmit = async () => {
        const required = ['nombre_producto', 'tipo_producto', 'id_material', 'id_unidadmedida'];
      
        for (let f of required) {
          if (!form[f]) {
            Swal.fire('Error', `${f} es obligatorio`, 'error');
            return;
          }
        }
      
        if (form.tipo_producto === 'PT' && !form.id_talla) {
          Swal.fire('Error', 'La talla es obligatoria para productos PT', 'error');
          return;
        }
      
        try {
          if (producto) {
            await updateProducto(producto.id_producto, form, localStorage.getItem('token'));
            Swal.fire('Actualizado', 'Producto actualizado correctamente', 'success');
          } else {
            await createProducto(form, localStorage.getItem('token'));
            Swal.fire('Creado', 'Producto creado correctamente', 'success');
          }
          fetchProductos();
          setOpen(false);
        } catch (error) {
          Swal.fire('Error', 'No se pudo guardar el producto', 'error');
        }
      };
  
    return (
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </Typography>
  
          <TextField fullWidth label="Nombre" name="nombre_producto"
            value={form.nombre_producto} onChange={handleChange} sx={{ mb: 2 }} />
  
  <TextField
  select
  fullWidth
  label="Tipo de Producto"
  name="tipo_producto"
  value={form.tipo_producto}
  onChange={handleChange}
  sx={{ mb: 2 }}
>
  <MenuItem value="MP">MP - Materia Prima</MenuItem>
  <MenuItem value="PT">PT - Producto Terminado</MenuItem>
</TextField>
          <TextField select fullWidth label="Material" name="id_material"
            value={form.id_material} onChange={handleChange} sx={{ mb: 2 }}>
            {materiales.map(m => (
              <MenuItem key={m.id_material} value={m.id_material}>{m.nombre_material}</MenuItem>
            ))}
          </TextField>
  
          <TextField
  select
  fullWidth
  label="Talla"
  name="id_talla"
  value={form.id_talla}
  onChange={handleChange}
  sx={{ mb: 2 }}
  disabled={form.tipo_producto === 'MP'}
>
  {tallas.map(t => (
    <MenuItem key={t.id_talla} value={t.id_talla}>
      {t.nombre_talla}
    </MenuItem>
  ))}
</TextField>
  
          <TextField select fullWidth label="Color" name="id_color"
            value={form.id_color} onChange={handleChange} sx={{ mb: 2 }}>
            {colores.map(c => (
              <MenuItem key={c.id_color} value={c.id_color}>{c.nombre_color}</MenuItem>
            ))}
          </TextField>
  
          <TextField select fullWidth label="Unidad" name="id_unidadmedida"
            value={form.id_unidadmedida} onChange={handleChange} sx={{ mb: 2 }}>
            {unidades.map(u => (
              <MenuItem key={u.id_unidad} value={u.id_unidad}>{u.nombre_unidad}</MenuItem>
            ))}
          </TextField>
  
          <FormControlLabel
            control={<Switch checked={form.activo} onChange={handleChange} name="activo" />}
            label="Activo"
          />
  
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
            Guardar
          </Button>
        </Box>
      </Modal>
    );
  };
  
  export default ProductoModal;
  