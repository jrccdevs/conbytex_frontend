// src/pages/materials/MaterialsList.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, CircularProgress, 
  TextField, MenuItem, Stack, InputAdornment, 
  Fade, Chip, Tooltip, Paper
} from '@mui/material';
import { 
  Search, Add, Layers, 
  FilterAlt, SortByAlpha, 
  Inventory2TwoTone 
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { getMaterials, deleteMaterial } from '../../api/materialsApi';
import MaterialTable from '../../components/materials/MaterialTable';
import MaterialModal from '../../components/materials/MaterialModal';

const MaterialsList = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [search, setSearch] = useState('');
  const [filterLetter, setFilterLetter] = useState('');

  const { usuario } = useAuth();
  const user = usuario?.user ?? usuario;

  const isAdmin = user?.roles?.some(r => r.slug === 'admin');

  const canCreate =
    isAdmin || user?.permissions?.some(p => p.slug === 'material.create');


  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const data = await getMaterials();
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de Carga',
        text: 'No se pudieron recuperar los materiales del servidor.',
        confirmButtonColor: '#6366f1'
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch = m.nombre_material.toLowerCase().includes(search.toLowerCase());
    const matchesLetter = filterLetter
      ? m.nombre_material.charAt(0).toLowerCase() === filterLetter.toLowerCase()
      : true;
    return matchesSearch && matchesLetter;
  });

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '<span style="color: #0f172a; font-weight: 900;">¿Eliminar material?</span>',
      html: '<p style="color: #64748b;">Esta acción removerá el material permanentemente de la base de datos.</p>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#f1f5f9',
      reverseButtons: true,
      borderRadius: '20px'
    });

    if (!result.isConfirmed) return;

    try {
      await deleteMaterial(id, localStorage.getItem('token'));
      fetchMaterials();
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        timer: 1500,
        showConfirmButton: false,
        borderRadius: '20px'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el material. Es posible que esté en uso.',
        confirmButtonColor: '#0f172a'
      });
    }
  };

  const handleCreate = () => {
    setSelectedMaterial(null);
    setOpenModal(true);
  };

  const letters = Array.from(new Set(materials.map((m) => m.nombre_material.charAt(0).toUpperCase()))).sort();

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HEADER SECTION */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4, 
          flexWrap: 'wrap',
          gap: 2 
        }}>
          <Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ 
                bgcolor: '#eef2ff', 
                p: 1.5, 
                borderRadius: '16px', 
                display: 'flex',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.12)' 
              }}>
                <Inventory2TwoTone sx={{ color: '#6366f1', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
                  Materiales
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Gestión de materias primas y texturas.
                </Typography>
              </Box>
            </Stack>
          </Box>

          {canCreate && (
            <Button 
              variant="contained" 
              onClick={handleCreate}
              startIcon={<Add />}
              sx={{ 
                bgcolor: '#6366f1', 
                borderRadius: '14px', 
                px: 3, 
                py: 1.2,
                textTransform: 'none',
                fontWeight: 700,
                '&:hover': { bgcolor: '#4f46e5' },
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.25)'
              }}
            >
              Nuevo Material
            </Button>
          )}
        </Box>

        {/* FILTERS TOOLBAR */}
        <Paper elevation={0} sx={{ 
          p: 2, 
          borderRadius: '20px', 
          mb: 4, 
          border: '1px solid #e2e8f0',
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <TextField
            placeholder="Buscar material por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ 
              flex: 1, 
              minWidth: '250px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: '#f8fafc'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            label="Inicial"
            value={filterLetter}
            onChange={(e) => setFilterLetter(e.target.value)}
            sx={{ 
              width: 140,
              '& .MuiOutlinedInput-root': { borderRadius: '12px' }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SortByAlpha sx={{ color: '#94a3b8', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">Todas</MenuItem>
            {letters.map((letter) => (
              <MenuItem key={letter} value={letter} sx={{ fontWeight: 700 }}>
                {letter}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ ml: 'auto', display: { xs: 'none', md: 'block' } }}>
            <Tooltip title="Filtros Activos">
              <Chip 
                label={`${filteredMaterials.length} Encontrados`}
                icon={<FilterAlt sx={{ fontSize: '16px !important' }} />}
                sx={{ bgcolor: '#0f172a', color: 'white', fontWeight: 700, p: 0.5 }}
              />
            </Tooltip>
          </Box>
        </Paper>

        {/* TABLE SECTION */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
            <CircularProgress thickness={5} size={45} sx={{ color: '#6366f1' }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              Sincronizando materiales...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ animation: 'fadeInUp 0.5s ease-out' }}>
            <MaterialTable
              materials={filteredMaterials}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Box>
        )}

        {/* MODAL */}
        <MaterialModal
          open={openModal}
          setOpen={setOpenModal}
          fetchMaterials={fetchMaterials}
          material={selectedMaterial}
        />

        <style>
          {`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(15px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
      </Box>
    </Fade>
  );
};

export default MaterialsList;