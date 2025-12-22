import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const InventarioTablaMP = ({ stock = [] }) => {
    return (
        <TableContainer component={Paper} elevation={3}>
            <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#e3f2fd' }}> {/* Color azul claro para MP */}
                        <TableCell><strong>ID MP</strong></TableCell>
                        <TableCell><strong>Materia Prima</strong></TableCell>
                        <TableCell align="right"><strong>Stock Actual</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stock.length > 0 ? (
                        stock.map((item) => (
                            <TableRow key={item.id_producto} hover>
                                <TableCell>{item.id_producto}</TableCell>
                                <TableCell>{item.nombre_producto}</TableCell>
                                <TableCell align="right">
                                    <Typography 
                                        fontWeight="bold" 
                                        color={Number(item.stock_actual) < 0 ? 'error.main' : 'primary.main'}
                                    >
                                        {item.stock_actual}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                No hay materias primas en este almacén
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default InventarioTablaMP;