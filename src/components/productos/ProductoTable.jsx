import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Chip
  } from '@mui/material';
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';
  
  const ProductoTable = ({ productos, onEdit, onDelete }) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Producto</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Material</TableCell>
            <TableCell>Talla</TableCell>
            <TableCell>Color</TableCell>
            <TableCell>Unidad</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productos.map((p) => (
            <TableRow key={p.id_producto}>
              <TableCell>{p.id_producto}</TableCell>
              <TableCell>{p.nombre_producto}</TableCell>
              <TableCell>{p.tipo_producto}</TableCell>
              <TableCell>{p.nombre_material}</TableCell>
              <TableCell>{p.nombre_talla || '-'}</TableCell>
              <TableCell>{p.nombre_color || '-'}</TableCell>
              <TableCell>{p.nombre_unidad}</TableCell>
              <TableCell>
                <Chip
                  label={p.activo ? 'Activo' : 'Inactivo'}
                  color={p.activo ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <IconButton color="primary" onClick={() => onEdit(p)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(p.id_producto)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
  
  export default ProductoTable;
  