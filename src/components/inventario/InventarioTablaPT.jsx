import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography } from '@mui/material';

const InventarioTablaPT = ({ stock = [] }) => {
    return (
        <TableContainer component={Paper} elevation={3}>
            <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#f1f8e9' }}> {/* Color verde claro para PT */}
                        <TableCell><strong>Codigo</strong></TableCell>
                        <TableCell><strong>Producto Terminado</strong></TableCell>
                        <TableCell align="right"><strong>Stock Actual</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stock.length > 0 ? (
                        stock.map((item) => (
                            <TableRow key={item.id_producto} hover>
                                <TableCell>{item.codigo}</TableCell>
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

            {(item.nombre_material || item.nombre_color || item.nombre_talla) && (
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        mt: 0.2
                    }}
                >
                    {[item.nombre_material, item.nombre_color,  item.nombre_talla]
                        .filter(Boolean)
                        .join(' • ')}
                </Typography>
            )}

        </Box>
    </Box>
</TableCell>
                                <TableCell align="right">
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 0.5 }}>
    <Typography variant="body1" fontWeight="700">
      {Number(item.stock_fisico ?? 0).toFixed(2)}
    </Typography>
    <Typography 
      variant="caption" 
      color="text.secondary" 
      sx={{ textTransform: 'lowercase' }}
    >
      {item.nombre_unidad || 'uds.'}
    </Typography>
  </Box>
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