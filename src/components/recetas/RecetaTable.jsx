import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Box,
    Typography
  } from '@mui/material';
  import { useNavigate } from 'react-router-dom';
  import VisibilityIcon from '@mui/icons-material/Visibility';
  import DeleteIcon from '@mui/icons-material/Delete';
  import EditIcon from '@mui/icons-material/Edit';
  // Asegúrate de tener este hook si usas roles para las acciones
  import { useAuth } from '../../context/AuthContext'; 
  
  // Recibimos onDelete como prop para manejar la eliminación en el componente padre (RecetasList)
  const RecetaTable = ({ recetas, onDelete }) => {
    const navigate = useNavigate();
    const { usuario } = useAuth(); // Asumo que tienes este hook disponible
  
    // 1. Obtener lista única de productos terminados, extrayendo la unidad de medida
    const productosUnicos = [];
    const mapProductos = new Map();
    recetas.forEach((r) => {
      if (!mapProductos.has(r.id_producto)) {
        mapProductos.set(r.id_producto, true);
        productosUnicos.push({
          id_producto: r.id_producto,
          // Usamos el campo que ya trae la concatenación (Nombre | Color | Material)
          producto_terminado: r.producto_terminado, 
          // 🔹 ASUMIMOS que este campo existe en el objeto receta para el P.T.
          unidad_medida: r.nombre_unidad_medida_producto_terminado || 'UNIDAD', 
        });
      }
    });
  
    const handleView = (id_producto) => {
      // Navega a la vista de detalle para ver la receta específica (y editar si es admin)
      navigate(`/recetas/${id_producto}`);
    };
    
    const handleDeleteClick = (id_producto) => {
      if (onDelete) {
          onDelete(id_producto);
      }
    };
  
    return (
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Producto Terminado (Color | Material)</TableCell>
              {/* 🔹 NUEVA COLUMNA */}
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '15%' }} align="center">Unidad de Medida</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '20%' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productosUnicos.map((p) => (
              <TableRow key={p.id_producto} hover>
                
                {/* 🔹 COLUMNA CON NOMBRE COMPLETO */}
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="medium">
                      {p.producto_terminado}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                      ID: {p.id_producto}
                  </Typography>
                </TableCell>
                
                {/* 🔹 COLUMNA UNIDAD DE MEDIDA */}
                <TableCell align="center">
                  <Typography variant="body2" sx={{ backgroundColor: '#e0e0e0', borderRadius: 1, p: 0.5, display: 'inline-block' }}>
                      {p.unidad_medida}
                  </Typography>
                </TableCell>
  
                {/* COLUMNA ACCIONES */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    
                    <Tooltip title="Ver Receta / Editar">
                      <IconButton color="primary" onClick={() => handleView(p.id_producto)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
  
                    {/* Acciones de Admin (Editar y Eliminar) */}
                    {usuario?.role === 'admin' && (
                      <>
                        <Tooltip title="Editar Receta">
                          <IconButton color="warning" onClick={() => handleView(p.id_producto)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
  
                        <Tooltip title="Eliminar Receta Completa">
                          <IconButton color="error" onClick={() => handleDeleteClick(p.id_producto)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  export default RecetaTable;