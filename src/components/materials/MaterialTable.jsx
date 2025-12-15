import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const MaterialTable = ({ materials, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Material</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id_material}>
              <TableCell>{material.id_material}</TableCell>
              <TableCell>{material.nombre_material}</TableCell>
              <TableCell align="right">
                <IconButton color="primary" onClick={() => onEdit(material)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(material.id_material)}>
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

export default MaterialTable;
