import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const InventarioTablaPT = ({ stock = [] }) => {
    return (
        <TableContainer component={Paper} elevation={3}>
            <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#f1f8e9' }}> {/* Color verde claro para PT */}
                        <TableCell><strong>ID PT</strong></TableCell>
                        <TableCell><strong>Producto Terminado</strong></TableCell>
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
                                        color={Number(item.stock_actual) < 0 ? 'error.main' : 'success.main'}
                                    >
                                        {item.stock_actual}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                No hay productos terminados en este almacén
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default InventarioTablaPT;