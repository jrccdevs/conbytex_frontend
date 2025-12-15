import {
    Table, TableBody, TableCell,
    TableHead, TableRow, IconButton
  } from '@mui/material';
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';
  
  const AlmacenTable = ({ almacenes, onEdit, onDelete }) => {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {almacenes.map(a => (
            <TableRow key={a.id_almacen}>
              <TableCell>{a.id_almacen}</TableCell>
              <TableCell>{a.nombre_almacen}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(a)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(a)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  export default AlmacenTable;
  