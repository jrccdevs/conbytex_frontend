import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton
  } from '@mui/material';
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';
  
  const EmpleadoTable = ({ empleados, onEdit, onDelete }) => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Empleado</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell align="center">Activo</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
  
          <TableBody>
            {empleados.map(emp => (
              <TableRow key={emp.id_empleado}>
                <TableCell>{emp.id_empleado}</TableCell>
                <TableCell>{emp.nombre_empleado}</TableCell>
                <TableCell>{emp.cargo}</TableCell>
                <TableCell>{emp.id_usuario ?? '—'}</TableCell>
                <TableCell align="center">
                  {emp.activo ? '✔️' : '❌'}
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => onEdit(emp)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDelete(emp.id_empleado)}>
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
  
  export default EmpleadoTable;
  