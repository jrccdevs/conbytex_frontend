import {
    Modal, Box, Typography, TextField,
    Button, Switch, FormControlLabel
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import Swal from 'sweetalert2';
  import { createEmpleado, updateEmpleado } from '../../api/empleadosApi';
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    borderRadius: 2,
    p: 4
  };
  
  const EmpleadoModal = ({ open, setOpen, fetchEmpleados, empleado }) => {
    const [form, setForm] = useState({
      nombre_empleado: '',
      cargo: '',
      id_usuario: '',
      activo: true
    });
  
    useEffect(() => {
      if (empleado) {
        setForm({
          nombre_empleado: empleado.nombre_empleado || '',
          cargo: empleado.cargo || '',
          id_usuario: empleado.id_usuario || '',
          activo: empleado.activo ?? true
        });
      }
    }, [empleado]);
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
  
      setForm(prev => ({
        ...prev,
        [name]:
          type === 'checkbox'
            ? checked
            : ['nombre_empleado', 'cargo'].includes(name)
              ? value.toUpperCase()
              : value
      }));
    };
  
    const handleSubmit = async () => {
      if (!form.nombre_empleado) {
        Swal.fire('Error', 'El nombre del empleado es obligatorio', 'error');
        return;
      }
  
      try {
        const payload = {
          ...form,
          id_usuario: form.id_usuario || null
        };
  
        if (empleado) {
          await updateEmpleado(empleado.id_empleado, payload, localStorage.getItem('token'));
          Swal.fire('Actualizado', 'Empleado actualizado correctamente', 'success');
        } else {
          await createEmpleado(payload, localStorage.getItem('token'));
          Swal.fire('Creado', 'Empleado creado correctamente', 'success');
        }
  
        fetchEmpleados();
        setOpen(false);
      } catch (error) {
        Swal.fire('Error', 'No se pudo guardar el empleado', 'error');
      }
    };
  
    return (
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>
            {empleado ? 'Editar Empleado' : 'Nuevo Empleado'}
          </Typography>
  
          <TextField
            fullWidth
            label="Nombre del Empleado"
            name="nombre_empleado"
            value={form.nombre_empleado}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
  
          <TextField
            fullWidth
            label="Cargo"
            name="cargo"
            value={form.cargo}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
  
          <TextField
            fullWidth
            label="ID Usuario (opcional)"
            name="id_usuario"
            value={form.id_usuario}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
  
          <FormControlLabel
            control={
              <Switch
                checked={form.activo}
                onChange={handleChange}
                name="activo"
              />
            }
            label="Activo"
          />
  
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
            Guardar
          </Button>
        </Box>
      </Modal>
    );
  };
  
  export default EmpleadoModal;
  