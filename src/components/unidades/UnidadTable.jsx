import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const UnidadTable = ({ unidades, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre Unidad</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {unidades.map((unidad) => (
            <TableRow key={unidad.id_unidad}>
              <TableCell>{unidad.id_unidad}</TableCell>
              <TableCell>{unidad.nombre_unidad}</TableCell>
              <TableCell align="right">
                <IconButton color="primary" onClick={() => onEdit(unidad)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(unidad.id_unidad)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UnidadTable;
