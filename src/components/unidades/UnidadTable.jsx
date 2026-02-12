import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, 
  Box, Typography, Tooltip, Chip, Avatar 
} from '@mui/material';
import {
  EditTwoTone,
  DeleteTwoTone,
  StraightenTwoTone,
  TagTwoTone,
  MoreHoriz
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const UnidadTable = ({ unidades, onEdit, onDelete }) => {

  const { usuario } = useAuth();
  const user = usuario?.user ?? usuario;

  const isAdmin = user?.roles?.some(r => r.slug === 'admin');

  const canEdit =
    isAdmin || user?.permissions?.some(p => p.slug === 'unidad.edit');

  const canDelete =
    isAdmin || user?.permissions?.some(p => p.slug === 'unidad.delete');

  return (
    <TableContainer 
      component={Paper} 
      elevation={0} 
      sx={{ 
        borderRadius: '16px', 
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        background: '#ffffff'
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ py: 2.5, fontWeight: 800, color: '#475569', fontSize: '0.85rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TagTwoTone sx={{ fontSize: 18, color: '#3b82f6' }} /> ID
              </Box>
            </TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StraightenTwoTone sx={{ fontSize: 18, color: '#3b82f6' }} /> NOMBRE DE LA UNIDAD
              </Box>
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem' }}>
              ESTADO
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem', pr: 4 }}>
              GESTIÓN
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {unidades.map((unidad) => (
            <TableRow 
              key={unidad.id_unidad}
              sx={{ 
                '&:hover': { bgcolor: '#f1f5f9', transition: '0.3s' },
                '&:last-child td, &:last-child th': { border: 0 }
              }}
            >
              {/* ID con estilo de badge */}
              <TableCell sx={{ py: 2 }}>
                <Typography variant="body2" sx={{ 
                  fontFamily: 'monospace', 
                  color: '#64748b', 
                  fontWeight: 600,
                  bgcolor: '#f8fafc',
                  display: 'inline-block',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  {unidad.id_unidad}
                </Typography>
              </TableCell>

              {/* Nombre con icono descriptivo */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: '#eff6ff', 
                    color: '#3b82f6', 
                    width: 32, 
                    height: 32,
                    fontSize: '0.85rem',
                    fontWeight: 800
                  }}>
                    {unidad.nombre_unidad.substring(0, 2).toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {unidad.nombre_unidad}
                  </Typography>
                </Box>
              </TableCell>

              {/* Estado visual */}
              <TableCell align="center">
                <Chip 
                  label="Sistema" 
                  size="small" 
                  sx={{ 
                    bgcolor: '#f1f5f9', 
                    color: '#475569', 
                    fontWeight: 700, 
                    fontSize: '0.7rem',
                    borderRadius: '6px'
                  }} 
                />
              </TableCell>

              {/* Acciones */}
              <TableCell align="right" sx={{ pr: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                {canEdit && (
                  <Tooltip title="Editar Medida" arrow>
                    <IconButton 
                      onClick={() => onEdit(unidad)}
                      sx={{ 
                        color: '#3b82f6',
                        bgcolor: '#eff6ff',
                        '&:hover': { bgcolor: '#3b82f6', color: '#ffffff' },
                        borderRadius: '10px',
                        transition: '0.2s'
                      }}
                      size="small"
                    >
                      <EditTwoTone fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                 {canDelete && (
                  <Tooltip title="Eliminar Unidad" arrow>
                    <IconButton 
                      onClick={() => onDelete(unidad.id_unidad)}
                      sx={{ 
                        color: '#ef4444',
                        bgcolor: '#fef2f2',
                        '&:hover': { bgcolor: '#ef4444', color: '#ffffff' },
                        borderRadius: '10px',
                        transition: '0.2s'
                      }}
                      size="small"
                    >
                      <DeleteTwoTone fontSize="small" />
                    </IconButton>
                  </Tooltip>
                 )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {unidades.length === 0 && (
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
            No se han configurado unidades de medida.
          </Typography>
        </Box>
      )}
    </TableContainer>
  );
};

export default UnidadTable;