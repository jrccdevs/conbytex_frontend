import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Paper, 
  Typography, Box, Tooltip, Avatar, Chip
} from '@mui/material';
import {
  EditTwoTone,
  DeleteTwoTone,
  WarehouseTwoTone,
  Fingerprint,
  MoreVert
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const AlmacenTable = ({ almacenes, onEdit, onDelete }) => {

  const { usuario } = useAuth();
  const user = usuario?.user ?? usuario;

  const isAdmin = user?.roles?.some(r => r.slug === 'admin');

  const canEdit =
    isAdmin || user?.permissions?.some(p => p.slug === 'almacen.edit');

  const canDelete =
    isAdmin || user?.permissions?.some(p => p.slug === 'almacen.delete');


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
                <Fingerprint sx={{ fontSize: 18, color: '#3b82f6' }} /> ID
              </Box>
            </TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarehouseTwoTone sx={{ fontSize: 18, color: '#3b82f6' }} /> NOMBRE DEL ALMACÉN
              </Box>
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem' }}>
              ESTADO
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem', pr: 4 }}>
              ACCIONES
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {almacenes.map((a) => (
            <TableRow 
              key={a.id_almacen}
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
                  #{a.id_almacen}
                </Typography>
              </TableCell>

              {/* Nombre con Avatar visual */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: '#eff6ff', 
                    color: '#3b82f6', 
                    width: 36, 
                    height: 36,
                    fontSize: '1rem',
                    fontWeight: 700
                  }}>
                    {a.nombre_almacen.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {a.nombre_almacen}
                  </Typography>
                </Box>
              </TableCell>

              {/* Chip de estado decorativo */}
              <TableCell align="center">
                <Chip 
                  label="Activo" 
                  size="small" 
                  sx={{ 
                    bgcolor: '#dcfce7', 
                    color: '#166534', 
                    fontWeight: 800, 
                    fontSize: '0.7rem',
                    borderRadius: '8px'
                  }} 
                />
              </TableCell>

              {/* Acciones con Tooltips */}
              <TableCell align="right" sx={{ pr: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                {canEdit && (
                  <Tooltip title="Editar Almacén" arrow>
                    <IconButton 
                      onClick={() => onEdit(a)}
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
                      onClick={() => onDelete(a)}
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
      
      {almacenes.length === 0 && (
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
            No se encontraron almacenes registrados.
          </Typography>
        </Box>
      )}
    </TableContainer>
  );
};

export default AlmacenTable;