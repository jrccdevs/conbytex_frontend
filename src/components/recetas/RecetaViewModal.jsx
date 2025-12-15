import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
  } from '@mui/material';
  
  const RecetaViewModal = ({ open, setOpen, receta }) => {
    return (
      <Dialog open={open} maxWidth="md" fullWidth>
        <DialogTitle>Receta: {receta?.producto_terminado}</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Materia Prima</TableCell>
                <TableCell>Cantidad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receta?.items.map((item) => (
                <TableRow key={item.id_receta}>
                  <TableCell>{item.materia_prima}</TableCell>
                  <TableCell>{item.cantidad}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default RecetaViewModal;
  