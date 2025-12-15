// src/components/sizes/SizeTable.jsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const SizeTable = ({ sizes, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Talla</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sizes.map((size) => (
            <TableRow key={size.id_talla}>
              <TableCell>{size.id_talla}</TableCell>
              <TableCell>{size.nombre_talla}</TableCell>
              <TableCell align="right">
                <IconButton color="primary" onClick={() => onEdit(size)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(size.id_talla)}>
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

export default SizeTable;
