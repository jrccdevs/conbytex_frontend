import { useEffect, useState } from 'react';
import { 
  Box, Button, Typography, CircularProgress, TextField, 
  InputAdornment, Stack, Paper, Fade, Avatar, IconButton, Tooltip 
} from '@mui/material';
import Swal from 'sweetalert2';

import { getClientes, deleteCliente } from '../../api/clientes';
import { useAuth } from '../../context/AuthContext';
import ClientesTable from '../../components/clientes/ClientesTable';
import ClientesForm from '../../components/clientes/ClientesForm';

// Iconos
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import GroupsTwoToneIcon from '@mui/icons-material/GroupsTwoTone';
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [search, setSearch] = useState('');

  const { usuario } = useAuth();

  /* ============================
     🔑 NORMALIZAR USUARIO
     ============================ */
  const user = usuario?.user ?? usuario;
  const isAdmin = user?.roles?.some(r => r.slug === 'admin');
  const hasPermission = (perm) => user?.permissions?.some(p => p.slug === perm);

  const colors = {
    primary: '#0f172a',
    accent: '#6366f1',
    error: '#ef4444',
    bg: '#f8fafc',
    border: '#e2e8f0'
  };

  /* ============================
     📥 OBTENER CLIENTES
     ============================ */
  const fetchClientes = async () => {
    setLoading(true);
    try {
      const data = await getClientes();
      setClientes(data);
      setFilteredClientes(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  /* ============================
     🔎 FILTRO BUSCADOR
     ============================ */
  useEffect(() => {
    if (!search) {
      setFilteredClientes(clientes);
    } else {
      const filtered = clientes.filter(cli =>
        cli.nombre.toLowerCase().includes(search.toLowerCase()) ||
        cli.numero_documento.toLowerCase().includes(search.toLowerCase()) ||
        cli.codigo_cliente.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredClientes(filtered);
    }
  }, [search, clientes]);

  /* ============================
     🔔 ALERT PERSONALIZADO
     ============================ */
  const customAlert = (title, text, icon, confirmText = 'OK', showCancel = false) => {
    return Swal.fire({
      title: `<span style="font-weight:800;color:${colors.primary}">${title}</span>`,
      html: `<span style="color:#64748b">${text}</span>`,
      icon,
      showCancelButton: showCancel,
      confirmButtonText: confirmText,
      cancelButtonText: 'CANCELAR',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      }
    });
  };

  /* ============================
     🗑️ ELIMINAR CLIENTE
     ============================ */
  const handleDelete = async (id) => {
    const result = await customAlert(
      '¿Eliminar cliente?',
      'Esta acción no se puede deshacer.',
      'warning',
      'SÍ, ELIMINAR',
      true
    );

    if (!result.isConfirmed) return;

    try {
      await deleteCliente(id, localStorage.getItem('token'));
      fetchClientes();
      customAlert('Eliminado', 'Cliente eliminado correctamente.', 'success');
    } catch {
      customAlert('Error', 'No se pudo eliminar el cliente.', 'error');
    }
  };

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: { xs: 1, md: 3 }, bgcolor: colors.bg, minHeight: '100vh' }}>

        {/* HEADER COMPACTO */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 3,
            gap: 2
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar variant="rounded" sx={{ bgcolor: colors.primary, width: 48, height: 48, boxShadow: 3 }}>
              <GroupsTwoToneIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: colors.primary, letterSpacing: '-0.5px' }}>
                Gestión de Clientes
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                {filteredClientes.length} registros encontrados
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Actualizar">
              <IconButton onClick={fetchClientes} sx={{ border: `1px solid ${colors.border}`, bgcolor: 'white' }}>
                <RefreshTwoToneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {(isAdmin || hasPermission('clientes.create')) && (
              <Button
                variant="contained"
                disableElevation
                startIcon={<AddCircleTwoToneIcon />}
                onClick={() => {
                  setSelectedCliente(null);
                  setOpenModal(true);
                }}
                sx={{
                  bgcolor: colors.accent,
                  borderRadius: '8px',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 3,
                  '&:hover': { bgcolor: colors.primary }
                }}
              >
                Nuevo Cliente
              </Button>
            )}
          </Stack>
        </Box>

        {/* BUSCADOR INTEGRADO */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: '4px 12px', 
            mb: 2, 
            display: 'flex', 
            alignItems: 'center', 
            border: `1px solid ${colors.border}`,
            borderRadius: '10px'
          }}
        >
          <InputAdornment position="start">
            <SearchTwoToneIcon sx={{ color: colors.accent, mr: 1 }} />
          </InputAdornment>
          <TextField
            fullWidth
            placeholder="Filtrar por nombre, NIT o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="standard"
            InputProps={{ disableUnderline: true, sx: { fontSize: '0.9rem', py: 1 } }}
          />
        </Paper>

        {/* TABLA DE ALTA DENSIDAD */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: '12px', 
            border: `1px solid ${colors.border}`, 
            bgcolor: 'white',
            width: '100%',
            overflow: 'hidden'
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 10, gap: 2 }}>
              <CircularProgress thickness={5} size={40} sx={{ color: colors.accent }} />
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>Cargando datos...</Typography>
            </Box>
          ) : (
            <Box sx={{ 
                width: '100%', 
                overflowX: 'auto',
                '&::-webkit-scrollbar': { height: '6px' },
                '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: '10px' },
                // ESTILOS FORZADOS PARA MAXIMIZAR ESPACIO
                '& .MuiTableCell-root': {
                    px: 1.5,
                    py: 1.2,
                    fontSize: '0.82rem',
                    whiteSpace: 'nowrap',
                    borderBottom: `1px solid ${colors.border}`
                },
                '& .MuiTableHead-root .MuiTableCell-root': {
                    bgcolor: '#f8fafc',
                    color: '#475569',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    fontSize: '0.72rem'
                }
            }}>
              <Box sx={{ minWidth: 'max-content' }}>
                <ClientesTable
                  clientes={filteredClientes}
                  onEdit={(cliente) => {
                    setSelectedCliente(cliente);
                    setOpenModal(true);
                  }}
                  onDelete={handleDelete}
                />
              </Box>
            </Box>
          )}
        </Paper>

        {/* MODAL */}
        {openModal && (
          <ClientesForm
            open={openModal}
            setOpen={setOpenModal}
            fetchClientes={fetchClientes}
            cliente={selectedCliente}
          />
        )}

        {/* ESTILOS GLOBALES REUTILIZABLES */}
        <style>
          {`
            .swal-confirm-btn {
              background-color: ${colors.primary} !important;
              color: white !important;
              padding: 10px 20px !important;
              border-radius: 8px !important;
              font-weight: 700 !important;
              margin: 5px !important;
              cursor: pointer;
              border: none;
              font-family: sans-serif;
            }
            .swal-cancel-btn {
              background-color: #f1f5f9 !important;
              color: #64748b !important;
              padding: 10px 20px !important;
              border-radius: 8px !important;
              font-weight: 700 !important;
              margin: 5px !important;
              cursor: pointer;
              border: none;
              font-family: sans-serif;
            }
          `}
        </style>
      </Box>
    </Fade>
  );
};

export default ClientesList;