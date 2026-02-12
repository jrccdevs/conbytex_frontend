// src/components/sizes/SizeTable.jsx
import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, 
  Box, Typography, Tooltip, Chip 
} from '@mui/material';
import {
  EditTwoTone,
  DeleteTwoTone,
  AspectRatioTwoTone,
  NumbersTwoTone
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const SizeTable = ({ sizes, onEdit, onDelete }) => {

  const { usuario } = useAuth();
  const user = usuario?.user ?? usuario;

  const isAdmin = user?.roles?.some(r => r.slug === 'admin');

  const canEdit =
    isAdmin || user?.permissions?.some(p => p.slug === 'size.edit');

  const canDelete =
    isAdmin || user?.permissions?.some(p => p.slug === 'size.delete');


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
                <NumbersTwoTone sx={{ fontSize: 18, color: '#3b82f6' }} /> ID
              </Box>
            </TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AspectRatioTwoTone sx={{ fontSize: 18, color: '#3b82f6' }} /> VALOR / TALLA
              </Box>
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem', pr: 4 }}>
              ACCIONES
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sizes.map((size) => (
            <TableRow 
              key={size.id_talla}
              sx={{ 
                '&:hover': { bgcolor: '#f1f5f9', transition: '0.3s' },
                '&:last-child td, &:last-child th': { border: 0 }
              }}
            >
              {/* ID de la talla */}
              <TableCell sx={{ py: 2 }}>
                <Typography variant="body2" sx={{ 
                  fontFamily: 'monospace', 
                  color: '#94a3b8', 
                  fontWeight: 600 
                }}>
                  {size.id_talla.toString().padStart(3, '0')}
                </Typography>
              </TableCell>

              {/* Nombre de la talla resaltado */}
              <TableCell>
                <Chip 
                  label={size.nombre_talla} 
                  sx={{ 
                    bgcolor: '#0f172a', 
                    color: '#ffffff', 
                    fontWeight: 800,
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    minWidth: '45px',
                    height: '28px'
                  }} 
                />
              </TableCell>

              {/* Botones de acción */}
              <TableCell align="right" sx={{ pr: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                {canEdit && (
                  <Tooltip title="Editar Talla" arrow>
                    <IconButton 
                      onClick={() => onEdit(size)}
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
                  <Tooltip title="Eliminar Talla" arrow>
                    <IconButton 
                      onClick={() => onDelete(size.id_talla)}
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
      
      {sizes.length === 0 && (
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
            No hay tallas registradas en el catálogo.
          </Typography>
        </Box>
      )}
    </TableContainer>
  );
};

export default SizeTable;