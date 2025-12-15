import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ColorTable = ({ colors, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre Color</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {colors.map((color) => (
            <TableRow key={color.id_color}>
              <TableCell>{color.id_color}</TableCell>
              <TableCell>{color.nombre_color}</TableCell>
              <TableCell align="right">
                <IconButton color="primary" onClick={() => onEdit(color)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(color.id_color)}>
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

export default ColorTable;
