import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton,
  Box, Typography, Avatar, Tooltip, Zoom, Stack,
  Chip
} from '@mui/material';

import {
  EditTwoTone,
  DeleteTwoTone,
  FiberManualRecord,
  FingerprintTwoTone,
  BadgeTwoTone,
  ContactMailTwoTone
} from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext';

const ClientesTable = ({ clientes, onEdit, onDelete }) => {

  /* ============================
     🔑 AUTENTICACIÓN / PERMISOS
     ============================ */
  const { usuario } = useAuth();
  const user = usuario?.user ?? usuario;

  const isAdmin = user?.roles?.some(r => r.slug === 'admin');

  const canEdit =
    isAdmin || user?.permissions?.some(p => p.slug === 'clientes.edit');

  const canDelete =
    isAdmin || user?.permissions?.some(p => p.slug === 'clientes.delete');

  /* ============================
     🎨 UTILIDAD COLOR AVATAR
     ============================ */
  const stringToColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 50) + 40;
    const lightness = Math.floor(Math.random() * 40) + 30;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        boxShadow:
          '0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.01)',
        overflow: 'hidden'
      }}
    >
      <Table sx={{ minWidth: 1000 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: '#0f172a' }}>
            <TableCell sx={{ color: '#f8fafc', fontWeight: 800 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <FingerprintTwoTone fontSize="small" />
                <span>CÓDIGO</span>
              </Stack>
            </TableCell>

            <TableCell sx={{ color: '#f8fafc', fontWeight: 800 }}>
              CLIENTE
            </TableCell>

            <TableCell sx={{ color: '#f8fafc', fontWeight: 800 }}>
              DOCUMENTO
            </TableCell>

            <TableCell align="center" sx={{ color: '#f8fafc', fontWeight: 800 }}>
              ESTADO
            </TableCell>

            <TableCell align="right" sx={{ color: '#f8fafc', fontWeight: 800, pr: 4 }}>
              GESTIÓN
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {clientes.map((cli) => (
            <TableRow
              key={cli.id_cliente}
              sx={{
                borderBottom: '1px solid #f1f5f9',
                '&:hover': { bgcolor: '#f8faff' }
              }}
            >

              {/* CÓDIGO */}
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
                  {cli.codigo_cliente}
                </Typography>
              </TableCell>

              {/* CLIENTE */}
              <TableCell>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: stringToColor(cli.nombre),
                      fontWeight: 800
                    }}
                  >
                    {cli.nombre?.substring(0, 2).toUpperCase()}
                  </Avatar>

                  <Box>
                    <Typography sx={{ fontWeight: 800 }}>
                      {cli.nombre}
                    </Typography>

                    {cli.email && (
                      <Typography
                        variant="caption"
                        sx={{ color: '#64748b', display: 'block' }}
                      >
                        {cli.email}
                      </Typography>
                    )}

                    {cli.telefono && (
                      <Typography
                        variant="caption"
                        sx={{ color: '#94a3b8', display: 'block' }}
                      >
                        {cli.telefono}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </TableCell>

              {/* DOCUMENTO */}
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BadgeTwoTone sx={{ fontSize: 18, color: '#6366f1' }} />
                  <Typography sx={{ fontWeight: 700 }}>
                    {cli.tipo_documento} - {cli.numero_documento}
                  </Typography>
                </Stack>
              </TableCell>

              {/* ESTADO */}
              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                  <FiberManualRecord
                    sx={{
                      fontSize: 10,
                      color: cli.estado ? '#22c55e' : '#ef4444'
                    }}
                  />
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 900 }}>
                    {cli.estado ? 'ACTIVO' : 'INACTIVO'}
                  </Typography>
                </Stack>
              </TableCell>

              {/* ACCIONES */}
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  {canEdit && (
                    <Tooltip title="Editar Cliente" TransitionComponent={Zoom} arrow>
                      <IconButton
                        onClick={() => onEdit(cli)}
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
                    <Tooltip title="Eliminar Cliente" TransitionComponent={Zoom} arrow>
                      <IconButton
                        onClick={() => onDelete(cli.id_cliente)}
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

export default ClientesTable;