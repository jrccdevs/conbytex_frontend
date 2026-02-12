import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip,
  Box, Typography, Avatar, Tooltip, Zoom
} from '@mui/material';
import {
  EditTwoTone,
  DeleteTwoTone,
  Inventory2TwoTone,
  StyleTwoTone,
  StraightenTwoTone,
  PaletteTwoTone,
  LayersTwoTone,
  CheckCircleTwoTone,
  CancelTwoTone,
  SettingsSuggestTwoTone
} from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext';

const ProductoTable = ({ productos, onEdit, onDelete }) => {

  const { usuario } = useAuth();
  const user = usuario?.user ?? usuario;

  const isAdmin = user?.roles?.some(r => r.slug === 'admin');

  const canEdit =
    isAdmin || user?.permissions?.some(p => p.slug === 'productos.edit');

  const canDelete =
    isAdmin || user?.permissions?.some(p => p.slug === 'productos.delete');

  // Debug (puedes quitar luego)
  console.log('👤 Usuario en EmpleadoTable:', user);
  console.log('🛡️ Roles:', user?.roles);
  console.log('🔐 Permisos:', user?.permissions);
  console.log('✏️ canEdit:', canEdit, '🗑️ canDelete:', canDelete);



  return (
    <TableContainer 
      component={Paper} 
      elevation={0}
      sx={{ 
        borderRadius: '24px', 
        border: '1px solid #e2e8f0',
        background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}
    >
      <Table sx={{ minWidth: 1000 }}>
        <TableHead sx={{ bgcolor: '#0f172a' }}>
          <TableRow>
            <TableCell sx={{ color: '#f8fafc', fontWeight: 700, py: 3 }}>PRODUCTO</TableCell>
            <TableCell sx={{ color: '#f8fafc', fontWeight: 700 }}>ESPECIFICACIONES</TableCell>
            <TableCell sx={{ color: '#f8fafc', fontWeight: 700 }}>ATRIBUTOS</TableCell>
            <TableCell sx={{ color: '#f8fafc', fontWeight: 700 }}>ESTADO</TableCell>
            <TableCell align="right" sx={{ color: '#f8fafc', fontWeight: 700, pr: 4 }}>GESTIÓN</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {productos.map((p) => (
            <TableRow 
              key={p.id_producto}
              sx={{ 
                '&:hover': { bgcolor: 'rgba(241, 245, 249, 0.7)', transition: '0.3s' },
                borderBottom: '1px solid #f1f5f9'
              }}
            >
              {/* Columna Principal: Info Producto */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    variant="rounded" 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      bgcolor: p.activo ? '#eff6ff' : '#f1f5f9',
                      color: p.activo ? '#3b82f6' : '#94a3b8',
                      borderRadius: '14px',
                      border: '1px solid' + (p.activo ? '#dbeafe' : '#e2e8f0')
                    }}
                  >
                    <Inventory2TwoTone />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem', lineHeight: 1 }}>
                      {p.nombre_producto}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      ID: #{p.id_producto.toString().padStart(5, '0')}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              {/* Columna: Clasificación Técnica */}
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StyleTwoTone sx={{ fontSize: 16, color: '#6366f1' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                      {p.tipo_producto}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LayersTwoTone sx={{ fontSize: 16, color: '#8b5cf6' }} />
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                      {p.nombre_material}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              {/* Columna: Variantes (Talla/Color) */}
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Talla" TransitionComponent={Zoom}>
                    <Chip 
                      icon={<StraightenTwoTone sx={{ fontSize: '14px !important' }} />}
                      label={p.nombre_talla || 'N/A'} 
                      size="small"
                      sx={{ borderRadius: '8px', fontWeight: 700, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}
                    />
                  </Tooltip>
                  <Tooltip title="Color" TransitionComponent={Zoom}>
                    <Chip 
                      icon={<PaletteTwoTone sx={{ fontSize: '14px !important' }} />}
                      label={p.nombre_color || 'N/A'} 
                      size="small"
                      sx={{ borderRadius: '8px', fontWeight: 700, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}
                    />
                  </Tooltip>
                </Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', mt: 1, display: 'block', fontWeight: 600 }}>
                  Unidad: {p.nombre_unidad}
                </Typography>
              </TableCell>

              {/* Columna: Estado con Pulso Visual */}
              <TableCell>
                <Chip
                  label={p.activo ? 'OPERATIVO' : 'SUSPENDIDO'}
                  icon={p.activo ? <CheckCircleTwoTone /> : <CancelTwoTone />}
                  sx={{
                    fontWeight: 900,
                    fontSize: '0.65rem',
                    letterSpacing: '0.5px',
                    bgcolor: p.activo ? '#dcfce7' : '#fee2e2',
                    color: p.activo ? '#15803d' : '#b91c1c',
                    border: '1px solid',
                    borderColor: p.activo ? '#86efac' : '#fecaca',
                    '& .MuiChip-icon': { color: 'inherit' }
                  }}
                />
              </TableCell>

              {/* Acciones de Control */}
              <TableCell align="right">
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, pr: 2 }}>
                {canEdit && (
                  <IconButton 
                    onClick={() => onEdit(p)}
                    sx={{ 
                      bgcolor: '#f1f5f9', color: '#0f172a',
                      '&:hover': { bgcolor: '#0f172a', color: '#fff' },
                      transition: '0.3s', borderRadius: '12px'
                    }}
                  >
                    <EditTwoTone fontSize="small" />
                  </IconButton>
                  )}
                   {canDelete && (
                  <IconButton 
                    onClick={() => onDelete(p.id_producto)}
                    sx={{ 
                      bgcolor: '#fff1f2', color: '#e11d48',
                      '&:hover': { bgcolor: '#e11d48', color: '#fff' },
                      transition: '0.3s', borderRadius: '12px'
                    }}
                  >
                    <DeleteTwoTone fontSize="small" />
                  </IconButton>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {productos.length === 0 && (
        <Box sx={{ p: 10, textAlign: 'center' }}>
          <SettingsSuggestTwoTone sx={{ fontSize: 60, color: '#e2e8f0', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 700 }}>
            Sin productos en el radar
          </Typography>
          <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
            Comienza registrando un nuevo activo en tu catálogo.
          </Typography>
        </Box>
      )}
    </TableContainer>
  );
};

export default ProductoTable;