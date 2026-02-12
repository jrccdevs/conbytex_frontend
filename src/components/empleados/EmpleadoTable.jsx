import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip,
  Box, Typography, Avatar, Tooltip, Zoom, Stack
} from '@mui/material';
import {
  EditTwoTone,
  DeleteTwoTone,
  WorkTwoTone,
  AccountCircleTwoTone,
  FiberManualRecord,
  FingerprintTwoTone
} from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext';

const EmpleadoTable = ({ empleados, onEdit, onDelete }) => {

  /* ============================
     🔑 AUTENTICACIÓN / PERMISOS
     ============================ */
  const { usuario } = useAuth();
  const user = usuario?.user ?? usuario;

  const isAdmin = user?.roles?.some(r => r.slug === 'admin');

  const canEdit =
    isAdmin || user?.permissions?.some(p => p.slug === 'empleados.edit');

  const canDelete =
    isAdmin || user?.permissions?.some(p => p.slug === 'empleados.delete');

  // Debug (puedes quitar luego)
  console.log('👤 Usuario en EmpleadoTable:', user);
  console.log('🛡️ Roles:', user?.roles);
  console.log('🔐 Permisos:', user?.permissions);
  console.log('✏️ canEdit:', canEdit, '🗑️ canDelete:', canDelete);

  /* ============================
     🎨 UTILIDADES VISUALES
     ============================ */
  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 50%)`;
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.01)',
        overflow: 'hidden'
      }}
    >
      <Table sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: '#0f172a' }}>
            <TableCell sx={{ color: '#f8fafc', fontWeight: 800 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <FingerprintTwoTone fontSize="small" />
                <span>IDENTIFICACIÓN</span>
              </Stack>
            </TableCell>
            <TableCell sx={{ color: '#f8fafc', fontWeight: 800 }}>EMPLEADO</TableCell>
            <TableCell sx={{ color: '#f8fafc', fontWeight: 800 }}>CARGO / ROL</TableCell>
            <TableCell sx={{ color: '#f8fafc', fontWeight: 800 }}>SISTEMA</TableCell>
            <TableCell align="center" sx={{ color: '#f8fafc', fontWeight: 800 }}>ESTADO</TableCell>
            <TableCell align="right" sx={{ color: '#f8fafc', fontWeight: 800, pr: 4 }}>
              GESTIÓN
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {empleados.map((emp) => (
            <TableRow
              key={emp.id_empleado}
              sx={{
                borderBottom: '1px solid #f1f5f9',
                '&:hover': { bgcolor: '#f8faff' }
              }}
            >
              {/* ID */}
              <TableCell>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontFamily: 'monospace',
                    bgcolor: '#f1f5f9',
                    px: 1,
                    py: 0.5,
                    borderRadius: '6px',
                    fontSize: '0.8rem'
                  }}
                >
                  #{emp.id_empleado.toString().padStart(3, '0')}
                </Typography>
              </TableCell>

              {/* EMPLEADO */}
              <TableCell>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: stringToColor(emp.nombre_empleado),
                      fontWeight: 800
                    }}
                  >
                    {emp.nombre_empleado.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 800 }}>
                      {emp.nombre_empleado}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      Miembro verificado
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>

              {/* CARGO */}
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <WorkTwoTone sx={{ fontSize: 16, color: '#3b82f6' }} />
                  <Typography sx={{ fontWeight: 700 }}>
                    {emp.cargo}
                  </Typography>
                </Stack>
              </TableCell>

              {/* USUARIO */}
              <TableCell>
                <Chip
                  label={emp.id_usuario ? `User: ${emp.id_usuario}` : 'Sin Cuenta'}
                  size="small"
                  icon={<AccountCircleTwoTone />}
                  sx={{
                    fontWeight: 800,
                    bgcolor: emp.id_usuario ? '#f0fdf4' : '#fafafa'
                  }}
                />
              </TableCell>

              {/* ESTADO */}
              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                  <FiberManualRecord
                    sx={{
                      fontSize: 10,
                      color: emp.activo ? '#22c55e' : '#ef4444'
                    }}
                  />
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 900 }}>
                    {emp.activo ? 'ACTIVO' : 'INACTIVO'}
                  </Typography>
                </Stack>
              </TableCell>

              {/* ACCIONES */}
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  {canEdit && (
                    <Tooltip title="Editar Empleado" TransitionComponent={Zoom} arrow>
                      <IconButton
                        onClick={() => onEdit(emp)}
                        sx={{
                          bgcolor: '#f1f5f9',
                          '&:hover': { bgcolor: '#6366f1', color: '#fff' }
                        }}
                      >
                        <EditTwoTone fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}

                  {canDelete && (
                    <Tooltip title="Eliminar Empleado" TransitionComponent={Zoom} arrow>
                      <IconButton
                        onClick={() => onDelete(emp.id_empleado)}
                        sx={{
                          bgcolor: '#fff1f2',
                          color: '#e11d48',
                          '&:hover': { bgcolor: '#e11d48', color: '#fff' }
                        }}
                      >
                        <DeleteTwoTone fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmpleadoTable;
