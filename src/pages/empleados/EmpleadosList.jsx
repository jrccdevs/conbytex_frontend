import { useEffect, useState } from 'react';
import { 
  Box, Button, Typography, CircularProgress, TextField, 
  InputAdornment, Stack, Paper, Fade, Avatar 
} from '@mui/material';
import Swal from 'sweetalert2';
import { getEmpleados, deleteEmpleado } from '../../api/empleadosApi';
import { useAuth } from '../../context/AuthContext';
import EmpleadoTable from '../../components/empleados/EmpleadoTable';
import EmpleadoModal from '../../components/empleados/EmpleadoModal';

// Iconos
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';

const EmpleadosList = () => {
  const [empleados, setEmpleados] = useState([]);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [search, setSearch] = useState('');

  const { usuario } = useAuth();

  /* ============================
     🔑 NORMALIZAR USUARIO
     ============================ */
  const user = usuario?.user ?? usuario;

  const isAdmin = user?.roles?.some(r => r.slug === 'admin');
  const hasPermission = (perm) =>
    user?.permissions?.some(p => p.slug === perm);

  // Colores
  const colors = {
    primary: '#0f172a',
    accent: '#6366f1',
    error: '#ef4444'
  };

  const fetchEmpleados = async () => {
    setLoading(true);
    try {
      const data = await getEmpleados();
      setEmpleados(data);
      setFilteredEmpleados(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

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

  const customAlert = (title, text, icon, confirmText = 'OK', showCancel = false) => {
    return Swal.fire({
      title: `<span style="font-weight:800;color:${colors.primary}">${title}</span>`,
      html: `<span style="color:#64748b">${text}</span>`,
      icon,
      showCancelButton: showCancel,
      confirmButtonText: confirmText,
      cancelButtonText: 'CANCELAR',
      buttonsStyling: false
    });
  };

  const handleDelete = async (id) => {
    const result = await customAlert(
      '¿Eliminar empleado?',
      'Esta acción no se puede deshacer.',
      'warning',
      'SÍ, ELIMINAR',
      true
    );

    if (!result.isConfirmed) return;

    try {
      await deleteEmpleado(id, localStorage.getItem('token'));
      fetchEmpleados();
      customAlert('Eliminado', 'Registro eliminado.', 'success');
    } catch {
      customAlert('Error', 'No se pudo eliminar.', 'error');
    }
  };
  //console.log('📊 Empleados state:', empleados);
  //console.log('📊 Filtrados:', filteredEmpleados);
  //console.log('⏳ Loading:', loading);
  
  return (
    <Fade in timeout={800}>
      <Box sx={{ p: { xs: 2, md: 4 } }}>

        {/* HEADER */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 4,
            gap: 2
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: colors.primary, width: 56, height: 56 }}>
              <PeopleAltTwoToneIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                Empleados
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Gestiona el personal
              </Typography>
            </Box>
          </Stack>

          {/* ✅ BOTÓN CORREGIDO */}
          {(isAdmin || hasPermission('empleados.create')) && (
            <Button
              variant="contained"
              startIcon={<AddCircleTwoToneIcon />}
              onClick={() => {
                setSelectedEmpleado(null);
                setOpenModal(true);
              }}
              sx={{
                bgcolor: colors.primary,
                py: 1.5,
                px: 3,
                borderRadius: '14px',
                fontWeight: 800,
                textTransform: 'none',
                '&:hover': { bgcolor: colors.accent }
              }}
            >
              Nuevo Empleado
            </Button>
          )}
        </Box>

        {/* BUSCADOR */}
        <Paper sx={{ p: 1, mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Buscar empleado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchTwoToneIcon />
                </InputAdornment>
              )
            }}
          />
        </Paper>

        {/* TABLA */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <EmpleadoTable
            empleados={filteredEmpleados}
            onEdit={(e) => {
              setSelectedEmpleado(e);
              setOpenModal(true);
            }}
            onDelete={handleDelete}
          />
        )}

        {/* MODAL */}
        {openModal && (
          <EmpleadoModal
            open={openModal}
            setOpen={setOpenModal}
            fetchEmpleados={fetchEmpleados}
            empleado={selectedEmpleado}
          />
        )}
      </Box>
    </Fade>
  );
};

export default EmpleadosList;
