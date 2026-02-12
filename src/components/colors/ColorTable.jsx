import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, 
  Box, Typography, Tooltip, Avatar 
} from '@mui/material';
import {
  EditTwoTone,
  DeleteTwoTone,
  PaletteTwoTone,
  FingerprintTwoTone
} from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext';

const ColorTable = ({ colors, onEdit, onDelete }) => {

  const { usuario } = useAuth();
  const user = usuario?.user ?? usuario;

  const isAdmin = user?.roles?.some(r => r.slug === 'admin');

  const canEdit =
    isAdmin || user?.permissions?.some(p => p.slug === 'color.edit');

  const canDelete =
    isAdmin || user?.permissions?.some(p => p.slug === 'color.delete');


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
                <FingerprintTwoTone sx={{ fontSize: 18, color: '#3b82f6' }} /> ID
              </Box>
            </TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaletteTwoTone sx={{ fontSize: 18, color: '#3b82f6' }} /> MUESTRA Y NOMBRE
              </Box>
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem', pr: 4 }}>
              ACCIONES
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {colors.map((color) => (
            <TableRow 
              key={color.id_color}
              sx={{ 
                '&:hover': { bgcolor: '#f1f5f9', transition: '0.3s' },
                '&:last-child td, &:last-child th': { border: 0 }
              }}
            >
              {/* ID con estilo de código */}
              <TableCell sx={{ py: 2 }}>
                <Typography variant="body2" sx={{ 
                  fontFamily: 'monospace', 
                  color: '#64748b', 
                  fontWeight: 600,
                  bgcolor: '#f8fafc',
                  display: 'inline-block',
                  px: 1,
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  #{color.id_color}
                </Typography>
              </TableCell>

              {/* Muestra Visual + Nombre */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      bgcolor: '#cbd5e1', // Color por defecto si no hay data
                      border: '2px solid #ffffff',
                      boxShadow: '0 0 0 1px #e2e8f0'
                    }} 
                  />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {color.nombre_color}
                  </Typography>
                </Box>
              </TableCell>

              {/* Acciones con Tooltips */}
              <TableCell align="right" sx={{ pr: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                {canEdit && (
                  <Tooltip title="Editar Color" arrow>
                    <IconButton 
                      onClick={() => onEdit(color)}
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
                  <Tooltip title="Eliminar Registro" arrow>
                    <IconButton 
                      onClick={() => onDelete(color.id_color)}
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
      
      {colors.length === 0 && (
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
            No se han definido colores en el catálogo.
          </Typography>
        </Box>
      )}
    </TableContainer>
  );
};

export default ColorTable;