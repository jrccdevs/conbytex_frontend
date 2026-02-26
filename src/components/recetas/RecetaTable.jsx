import { useState } from 'react'; // Importamos useState para el buscador
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Tooltip, Box, Typography,
  Avatar, Chip, Zoom, TextField, InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import RestaurantMenuTwoToneIcon from '@mui/icons-material/RestaurantMenuTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone'; // Icono para el buscador
import { useAuth } from '../../context/AuthContext';

const RecetaTable = ({ recetas, onDelete }) => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  const user = usuario?.user ?? usuario;
  const isAdmin = user?.roles?.some(r => r.slug === 'admin');
  const hasPermission = (perm) => user?.permissions?.some(p => p.slug === perm);

  const canCreate = isAdmin || hasPermission('recetas.create');
  const canEdit   = isAdmin || hasPermission('recetas.edit');
  const canDelete = isAdmin || hasPermission('recetas.delete');

  // LÓGICA INTACTA: Obtener lista única de productos terminados
  const productosUnicosRaw = [];
  const mapProductos = new Map();
  recetas.forEach((r) => {
    if (!mapProductos.has(r.id_producto)) {
      mapProductos.set(r.id_producto, true);
      productosUnicosRaw.push({
        id_producto: r.id_producto,
        codigo:r.codigo,
        producto_terminado: r.producto_terminado,
        unidad_medida: r.nombre_unidad_medida_producto_terminado || 'UNIDAD',
      });
    }
  });

  // Filtrado por nombre o código
  const productosUnicos = productosUnicosRaw.filter((p) => 
    p.producto_terminado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id_producto.toString().includes(searchTerm)
  );

  const handleView = (id_producto) => navigate(`/recetas/${id_producto}`);
  const handleDeleteClick = (id_producto) => onDelete && onDelete(id_producto);

  const colors = {
    header: '#0f172a',
    accent: '#6366f1',
    rowHover: '#f8fafc'
  };

  return (
    <Box>
      {/* Buscador agregado arriba de la tabla */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar por nombre de producto o código (ID)..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            backgroundColor: 'white',
            '& fieldset': { borderColor: '#e2e8f0' },
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchTwoToneIcon sx={{ color: colors.accent }} />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer 
        component={Paper} 
        elevation={0} 
        sx={{ 
          borderRadius: '24px', 
          border: '1px solid #e2e8f0', 
          overflow: 'hidden',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: colors.header }}>
            <TableCell sx={{ color: 'white', fontWeight: 800, py: 2.5 }}>
                Codigo Producto
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 800, py: 2.5 }}>
                Producto Terminado (Color | Material)
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 800, width: '20%' }} align="center">
                Unidad de Medida
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 800, width: '20%' }} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {productosUnicos.map((p) => (
              <TableRow 
                key={p.id_producto} 
                hover 
                sx={{ 
                  '&:hover': { backgroundColor: `${colors.rowHover} !important` },
                  transition: 'background-color 0.2s ease'
                }}
              >
                <TableCell align="center">
                  <Chip 
                    label={p.codigo} 
                    size="small"
                    sx={{ 
                      fontWeight: 800, 
                      fontSize: '0.7rem',
                      bgcolor: '#eef2ff', 
                      color: colors.accent,
                      borderRadius: '8px',
                      border: '1px solid #e0e7ff'
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#f1f5f9', 
                        color: colors.accent,
                        width: 44, height: 44,
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <RestaurantMenuTwoToneIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ fontWeight: 800, color: '#1e293b', lineHeight: 1.2 }}
                      >
                        {p.producto_terminado}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                        REFERENCIA ID: #{p.id_producto}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell align="center">
                  <Chip 
                    label={p.unidad_medida} 
                    size="small"
                    sx={{ 
                      fontWeight: 800, 
                      fontSize: '0.7rem',
                      bgcolor: '#eef2ff', 
                      color: colors.accent,
                      borderRadius: '8px',
                      border: '1px solid #e0e7ff'
                    }} 
                  />
                </TableCell>

                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title="Ver Detalle Completo" TransitionComponent={Zoom} arrow>
                      <IconButton 
                        size="small"
                        onClick={() => handleView(p.id_producto)}
                        sx={{ 
                          color: colors.accent, 
                          bgcolor: '#f5f3ff',
                          '&:hover': { bgcolor: colors.accent, color: 'white' }
                        }}
                      >
                        <VisibilityTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {canEdit && (
                        <Tooltip title="Editar Composición" TransitionComponent={Zoom} arrow>
                          <IconButton 
                            size="small"
                            onClick={() => handleView(p.id_producto)}
                            sx={{ 
                              color: '#f59e0b', 
                              bgcolor: '#fffbeb',
                              '&:hover': { bgcolor: '#f59e0b', color: 'white' }
                            }}
                          >
                            <EditTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                    )}
                    {canDelete && (
                        <Tooltip title="Eliminar Receta" TransitionComponent={Zoom} arrow>
                          <IconButton 
                            size="small"
                            onClick={() => handleDeleteClick(p.id_producto)}
                            sx={{ 
                              color: '#ef4444', 
                              bgcolor: '#fef2f2',
                              '&:hover': { bgcolor: '#ef4444', color: 'white' }
                            }}
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {productosUnicos.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
              {searchTerm ? 'No hay resultados para tu búsqueda.' : 'No se encontraron recetas configuradas actualmente.'}
            </Typography>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
};

export default RecetaTable;