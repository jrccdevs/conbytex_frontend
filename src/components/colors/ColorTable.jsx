import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, 
  Box, Typography, Tooltip, Avatar 
} from '@mui/material';
import {
  EditTwoTone,
  DeleteTwoTone,
  PaletteTwoTone,
  FingerprintTwoTone
} from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext';

const ColorTable = ({ colors, onEdit, onDelete }) => {

  const { usuario } = useAuth();
  const user = usuario?.user ?? usuario;

  const isAdmin = user?.roles?.some(r => r.slug === 'admin');

  const canEdit =
    isAdmin || user?.permissions?.some(p => p.slug === 'color.edit');

  const canDelete =
    isAdmin || user?.permissions?.some(p => p.slug === 'color.delete');
    const colores = {

      // 🔴 ROJOS
      rojo: "#ef4444",
      rojo_claro: "#fca5a5",
      rojo_oscuro: "#b91c1c",
      rojo_intenso: "#dc2626",
      rojo_vino: "#881337",
      rojo_carmesi: "#9f1239",
      bordo: "#7f1d1d",
      granate: "#7f1d1d",
      vino: "#881337",
      escarlata: "#dc2626",
    
      // 🔵 AZULES
      azul: "#3b82f6",
      azul_claro: "#93c5fd",
      azul_oscuro: "#1e3a8a",
      azul_marino: "#0f172a",
      azul_rey: "#1d4ed8",
      azul_cielo: "#0ea5e9",
      celeste: "#38bdf8",
      turquesa: "#06b6d4",
      aguamarina: "#14b8a6",
      cyan: "#06b6d4",
    
      // 🟢 VERDES
      verde: "#22c55e",
      verde_claro: "#86efac",
      verde_oscuro: "#166534",
      verde_limon: "#84cc16",
      verde_oliva: "#4d7c0f",
      verde_militar: "#3f6212",
      esmeralda: "#10b981",
      menta: "#6ee7b7",
    
      // 🟡 AMARILLOS
      amarillo: "#eab308",
      amarillo_claro: "#fde047",
      amarillo_oscuro: "#ca8a04",
      mostaza: "#ca8a04",
      dorado: "#facc15",
      oro: "#f59e0b",
    
      // 🟣 MORADOS
      morado: "#8b5cf6",
      morado_claro: "#c084fc",
      morado_oscuro: "#5b21b6",
      violeta: "#7c3aed",
      lila: "#c084fc",
      purpura: "#6d28d9",
    
      // 🌸 ROSADOS
      rosado: "#ec4899",
      rosado_claro: "#f9a8d4",
      rosado_oscuro: "#be185d",
      fucsia: "#d946ef",
      magenta: "#db2777",
    
      // 🟠 NARANJAS
      naranja: "#f97316",
      naranja_claro: "#fb923c",
      naranja_oscuro: "#c2410c",
      coral: "#fb7185",
      salmon: "#fda4af",
    
      // 🟤 MARRONES
      marron: "#92400e",
      marron_claro: "#d97706",
      marron_oscuro: "#78350f",
      cafe: "#78350f",
      chocolate: "#5a3825",
      arena: "#f4a460",
      burrito: "#c19a6b",

    
      // ⚫ GRISES Y NEUTROS
      negro: "#000000",
      gris: "#6b7280",
      gris_claro: "#d1d5db",
      gris_oscuro: "#374151",
      gris_plomo: "#4b5563",
      plata: "#9ca3af",
      ceniza: "#9ca3af",
    
      // ⚪ BLANCOS Y CREMAS
      blanco: "#ffffff",
      blanco_hueso: "#f8fafc",
      marfil: "#fffff0",
      crema: "#fef3c7",
      beige: "#f5f5dc",
    
      // 🎨 OTROS COMUNES
      lavanda: "#e9d5ff",
      indigo: "#4f46e5",
      oliva: "#808000",
      cobre: "#b45309",
      terracota: "#e76f51"
    };
    
      const getColorValue = (nombre) => {
        if (!nombre) return "#cbd5e1";
      
        const texto = nombre.toLowerCase().trim();
      
        // 1️⃣ Normalizar espacios a _
        const claveNormalizada = texto.replace(/\s+/g, "_");
      
        // 2️⃣ Coincidencia exacta
        if (colores[claveNormalizada]) {
          return colores[claveNormalizada];
        }
      
        // 3️⃣ Coincidencia parcial (si contiene alguna palabra clave)
        for (const clave in colores) {
          if (texto.includes(clave.replace(/_/g, " "))) {
            return colores[clave];
          }
        }
      
        // 4️⃣ Color por defecto elegante
        return "#cbd5e1";
      };
  return (
    <TableContainer 
      component={Paper} 
      elevation={0} 
      sx={{ 
        borderRadius: '16px', 
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        background: '#ffffff'
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ py: 2.5, fontWeight: 800, color: '#475569', fontSize: '0.85rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FingerprintTwoTone sx={{ fontSize: 18, color: '#3b82f6' }} /> ID
              </Box>
            </TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaletteTwoTone sx={{ fontSize: 18, color: '#3b82f6' }} /> MUESTRA Y NOMBRE
              </Box>
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem', pr: 4 }}>
              ACCIONES
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {colors.map((color) => (
            <TableRow 
              key={color.id_color}
              sx={{ 
                '&:hover': { bgcolor: '#f1f5f9', transition: '0.3s' },
                '&:last-child td, &:last-child th': { border: 0 }
              }}
            >
              {/* ID con estilo de código */}
              <TableCell sx={{ py: 2 }}>
                <Typography variant="body2" sx={{ 
                  fontFamily: 'monospace', 
                  color: '#64748b', 
                  fontWeight: 600,
                  bgcolor: '#f8fafc',
                  display: 'inline-block',
                  px: 1,
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  #{color.id_color}
                </Typography>
              </TableCell>

              {/* Muestra Visual + Nombre */}
              <TableCell>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box 
      sx={{ 
        width: 24, 
        height: 24, 
        borderRadius: '50%', 
        bgcolor: getColorValue(color.nombre_color),
        border: '2px solid #ffffff',
        boxShadow: '0 0 0 1px #e2e8f0'
      }} 
    />
    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
      {color.nombre_color}
    </Typography>
  </Box>
</TableCell>

              {/* Acciones con Tooltips */}
              <TableCell align="right" sx={{ pr: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                {canEdit && (
                  <Tooltip title="Editar Color" arrow>
                    <IconButton 
                      onClick={() => onEdit(color)}
                      sx={{ 
                        color: '#3b82f6',
                        bgcolor: '#eff6ff',
                        '&:hover': { bgcolor: '#3b82f6', color: '#ffffff' },
                        borderRadius: '10px',
                        transition: '0.2s'
                      }}
                      size="small"
                    >
                      <EditTwoTone fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                 {canDelete && (
                  <Tooltip title="Eliminar Registro" arrow>
                    <IconButton 
                      onClick={() => onDelete(color.id_color)}
                      sx={{ 
                        color: '#ef4444',
                        bgcolor: '#fef2f2',
                        '&:hover': { bgcolor: '#ef4444', color: '#ffffff' },
                        borderRadius: '10px',
                        transition: '0.2s'
                      }}
                      size="small"
                    >
                      <DeleteTwoTone fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {colors.length === 0 && (
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
            No se han definido colores en el catálogo.
          </Typography>
        </Box>
      )}
    </TableContainer>
  );
};

export default ColorTable;