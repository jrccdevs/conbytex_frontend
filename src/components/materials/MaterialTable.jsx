import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, 
  Box, Typography, Tooltip, Avatar 
} from '@mui/material';
import {
  EditTwoTone,
  DeleteTwoTone,
  LayersTwoTone,
  CategoryTwoTone,
  NumbersTwoTone // Usaremos este en lugar del que dio error
} from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext';

const MaterialTable = ({ materials, onEdit, onDelete }) => {

  const { usuario } = useAuth();
  const user = usuario?.user ?? usuario;

  const isAdmin = user?.roles?.some(r => r.slug === 'admin');

  const canEdit =
    isAdmin || user?.permissions?.some(p => p.slug === 'material.edit');

  const canDelete =
    isAdmin || user?.permissions?.some(p => p.slug === 'material.delete');

  return (
    <TableContainer 
      component={Paper} 
      elevation={0} 
      sx={{ 
        borderRadius: '20px', 
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ py: 2.5, fontWeight: 800, color: '#475569', fontSize: '0.85rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NumbersTwoTone sx={{ fontSize: 18, color: '#6366f1' }} /> ID
              </Box>
            </TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LayersTwoTone sx={{ fontSize: 18, color: '#6366f1' }} /> NOMBRE DEL MATERIAL
              </Box>
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem', pr: 4 }}>
              ACCIONES
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {materials.map((material) => (
            <TableRow 
              key={material.id_material}
              sx={{ 
                '&:hover': { bgcolor: '#f1f5f9', transition: '0.3s' },
                '&:last-child td, &:last-child th': { border: 0 }
              }}
            >
              <TableCell sx={{ py: 2 }}>
                <Typography variant="body2" sx={{ 
                  fontFamily: 'monospace', 
                  color: '#64748b', 
                  fontWeight: 700,
                  fontSize: '0.75rem'
                }}>
                  MAT-{material.id_material.toString().padStart(4, '0')}
                </Typography>
              </TableCell>

              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    variant="rounded"
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: '#f5f3ff', 
                      color: '#8b5cf6',
                      borderRadius: '8px'
                    }}
                  >
                    <CategoryTwoTone sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', textTransform: 'uppercase' }}>
                    {material.nombre_material}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell align="right" sx={{ pr: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                {canEdit && (
                  <Tooltip title="Editar Composición" arrow>
                    <IconButton 
                      onClick={() => onEdit(material)}
                      sx={{ 
                        color: '#6366f1',
                        bgcolor: '#eef2ff',
                        '&:hover': { bgcolor: '#6366f1', color: '#ffffff' },
                        borderRadius: '12px',
                        transition: '0.2s'
                      }}
                    >
                      <EditTwoTone fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {canDelete && (
                  <Tooltip title="Retirar Material" arrow>
                    <IconButton 
                      onClick={() => onDelete(material.id_material)}
                      sx={{ 
                        color: '#f43f5e',
                        bgcolor: '#fff1f2',
                        '&:hover': { bgcolor: '#f43f5e', color: '#ffffff' },
                        borderRadius: '12px',
                        transition: '0.2s'
                      }}
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
    </TableContainer>
  );
};

export default MaterialTable;