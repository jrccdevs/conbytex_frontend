import { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import { getEmpleados, deleteEmpleado } from '../../api/empleadosApi';
import { useAuth } from '../../context/AuthContext';
import EmpleadoTable from '../../components/empleados/EmpleadoTable';
import EmpleadoModal from '../../components/empleados/EmpleadoModal';

const EmpleadosList = () => {
  const [empleados, setEmpleados] = useState([]);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [search, setSearch] = useState('');

  const { usuario } = useAuth();

  const fetchEmpleados = async () => {
    setLoading(true);
    try {
      const data = await getEmpleados();
      setEmpleados(data);
      setFilteredEmpleados(data); // Inicialmente todo
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  // Filtrado por búsqueda
  useEffect(() => {
    if (!search) {
      setFilteredEmpleados(empleados);
    } else {
      const filtered = empleados.filter(emp =>
        emp.nombre_empleado.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredEmpleados(filtered);
    }
  }, [search, empleados]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar empleado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar'
    });

    if (!result.isConfirmed) return;

    try {
      await deleteEmpleado(id, localStorage.getItem('token'));
      fetchEmpleados();
      Swal.fire('Eliminado', 'Empleado eliminado correctamente', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo eliminar el empleado', 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Empleados</Typography>
        {usuario?.role === 'admin' && (
          <Button
            variant="contained"
            onClick={() => {
              setSelectedEmpleado(null);
              setOpenModal(true);
            }}
          >
            Nuevo Empleado
          </Button>
        )}
      </Box>

      {/* Buscador */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Buscar empleado"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <EmpleadoTable
          empleados={filteredEmpleados}
          onEdit={(e) => { setSelectedEmpleado(e); setOpenModal(true); }}
          onDelete={handleDelete}
        />
      )}

      {openModal && (
        <EmpleadoModal
          open={openModal}
          setOpen={setOpenModal}
          fetchEmpleados={fetchEmpleados}
          empleado={selectedEmpleado}
        />
      )}
    </Box>
  );
};

export default EmpleadosList;
