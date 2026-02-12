import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip } from '@mui/material';

const InventarioTablaMP = ({ stock = [] }) => {
    return (
        <TableContainer component={Paper} elevation={3}>
            <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                        <TableCell><strong>ID</strong></TableCell>
                        <TableCell><strong>Materia Prima</strong></TableCell>
                        <TableCell align="right"><strong>Stock Físico</strong></TableCell>
                        <TableCell align="right"><strong>Reservado</strong></TableCell>
                        <TableCell align="right"><strong>Disponible</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stock.length > 0 ? (
                        stock.map((item) => {
                            const stockFisico = parseFloat(item.stock_fisico ?? 0);
const stockReservado = parseFloat(item.stock_reservado ?? 0);

const stockDisponible = parseFloat(
    item.stock_disponible ?? (stockFisico - stockReservado)
);
                            return (
                                <TableRow key={item.id_producto} hover>
                                    <TableCell>{item.id_producto}</TableCell>
                                    <TableCell>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
        
        {/* Línea lateral sutil */}
        <Box
            sx={{
                width: 4,
                height: 40,
                borderRadius: 1,
                bgcolor: 'primary.light',
                mr: 1.5,
                opacity: 0.6
            }}
        />

        {/* Contenido */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            
            <Typography
                variant="body1"
                sx={{ fontWeight: 600 }}
            >
                {item.nombre_producto}
            </Typography>

            {(item.nombre_material || item.nombre_color) && (
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        mt: 0.2
                    }}
                >
                    {[item.nombre_material, item.nombre_color]
                        .filter(Boolean)
                        .join(' • ')}
                </Typography>
            )}

        </Box>
    </Box>
</TableCell>

                                    
                                    {/* Stock Físico */}
                                    <TableCell align="right">
                                        <Typography variant="body2">{stockFisico.toFixed(2)}</Typography>
                                    </TableCell>

                                    {/* Stock Reservado */}
                                    <TableCell align="right">
                                        <Typography variant="body2" color="warning.main">
                                            {stockReservado > 0 ? `-${stockReservado.toFixed(2)}` : '0.00'}
                                        </Typography>
                                    </TableCell>

                                    {/* Stock Disponible */}
                                    <TableCell align="right">
                                        <Chip 
                                            label={stockDisponible.toFixed(2)} 
                                            color={stockDisponible <= 0 ? "error" : "success"}
                                            variant="filled"
                                            size="small"
                                            sx={{ fontWeight: 'bold', minWidth: '60px' }}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                No hay materias primas registradas
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default InventarioTablaMP;
