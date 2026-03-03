import { useEffect, useState } from "react";
import {
  Box, Typography, Paper, CircularProgress, Stack, Avatar, 
  Divider, LinearProgress, Table, TableBody, TableCell, TableRow
} from "@mui/material";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, BarChart, Bar, Legend
} from "recharts";

// Iconos para contexto rápido
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GroupIcon from '@mui/icons-material/Group';

import { getDashboardData } from "../api/dashboardApi";

const COLORS = ["#0061ff", "#60efff", "#00ff87", "#ffb800", "#ff5f6d"];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboardData();
        setData(response);
      } catch (error) {
        console.error("❌ Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', height: '100vh', bgcolor: '#f8fafc' }}>
      <CircularProgress thickness={5} sx={{ color: '#0061ff' }} />
    </Box>
  );

  if (!data) return null;

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#f1f5f9", p: 0 }}>
      
      {/* 1. HEADER ESTRATÉGICO (ANCHO TOTAL) */}
      <Box sx={{ bgcolor: '#fff', px: 4, py: 3, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight="900" sx={{ color: '#0f172a', letterSpacing: '-1.5px' }}>
            DATOS ESTADISTICOS
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight="500">
            Resumen ejecutivo de inventario y comercialización • {new Date().toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={3}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" fontWeight="bold" color="text.secondary">ESTADO DE RED</Typography>
            <Typography variant="body2" fontWeight="800" color="#10b981">● SISTEMA ONLINE</Typography>
          </Box>
        </Stack>
      </Box>

      {/* 2. FILA DE INDICADORES (KPI STREAM) */}
      <Box sx={{ px: 4, py: 3 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} justifyContent="space-between" alignItems="center">
            {[
              { label: "INGRESOS TOTALES", val: data.resumen.ingresos, icon: <TrendingUpIcon />, col: "#10b981" },
              { label: "SALIDAS TOTALES", val: data.resumen.salidas, icon: <AssessmentIcon />, col: "#ef4444" },
              { label: "VALOR EN VENTAS", val: `$${Number(data.resumen.ventas).toLocaleString()}`, icon: <StorefrontIcon />, col: "#0061ff" },
              { label: "CARTERA CLIENTES", val: data.topClientes.length, icon: <GroupIcon />, col: "#f59e0b" }
            ].map((kpi, i) => (
              <Box key={i} sx={{ px: 4, flex: 1, textAlign: 'center' }}>
                <Typography variant="overline" fontWeight="bold" color="text.secondary">{kpi.label}</Typography>
                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
                  <Box sx={{ color: kpi.col }}>{kpi.icon}</Box>
                  <Typography variant="h4" fontWeight="900" sx={{ color: '#1e293b' }}>{kpi.val}</Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* 3. FILA DE TENDENCIAS (BAR CHART - CAMBIADO) */}
      <Box sx={{ px: 4, mb: 3 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
          <Typography variant="h6" fontWeight="800" sx={{ mb: 4, color: '#334155' }}>ESTADÍSTICAS DE MOVIMIENTOS MENSUAL</Typography>
          <Box sx={{ height: 350, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.movimientosMes} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="mes" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 13, fontWeight: 'bold'}} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                <Bar 
                  name="Entradas" 
                  dataKey="ingresos" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]} 
                  barSize={30}
                />
                <Bar 
                  name="Salidas" 
                  dataKey="salidas" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]} 
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>

      {/* 4. SECCIÓN DE RANKING (FULL WIDTH ROWS) */}
      <Box sx={{ px: 4, pb: 5 }}>
        <Stack spacing={3}>
          {/* PRODUCTOS */}
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" fontWeight="800" sx={{ mb: 3 }}>RENDIMIENTO DE PRODUCTOS TOP</Typography>
            <Stack spacing={2}>
              {data.topProductos.map((prod, index) => (
                <Box key={index} sx={{ 
                  p: 2.5, bgcolor: '#f8fafc', borderRadius: 2, 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  border: '1px solid #f1f5f9', transition: 'all 0.3s',
                  '&:hover': { transform: 'scale(1.005)', bgcolor: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }
                }}>
                  <Stack direction="row" spacing={3} alignItems="center" sx={{ width: '40%' }}>
                    <Typography variant="h6" fontWeight="900" color="#cbd5e1">{index + 1}</Typography>
                    <Avatar sx={{ bgcolor: COLORS[index % COLORS.length], width: 50, height: 50, fontWeight: 'bold' }}>
                      {prod.nombre_producto.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="800">{prod.nombre_producto}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">LÍNEA DE PRODUCCIÓN ACTIVA</Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ width: '30%', px: 4 }}>
                    <Typography variant="caption" fontWeight="bold">CUOTA DE MERCADO</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(prod.total_vendido / data.topProductos[0].total_vendido) * 100} 
                      sx={{ height: 8, borderRadius: 5, bgcolor: '#e2e8f0', mt: 1, '& .MuiLinearProgress-bar': { bgcolor: COLORS[index % COLORS.length] } }}
                    />
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">TOTAL VENDIDO</Typography>
                    <Typography variant="h5" fontWeight="900" color="#0f172a">{prod.total_vendido} Unid.</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* CLIENTES */}
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" fontWeight="800" sx={{ mb: 3 }}>RANKING ESTRATÉGICO DE CLIENTES</Typography>
            <Table>
              <TableBody>
                {data.topClientes.map((cliente, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ width: 60 }}>
                      <Box sx={{ width: 35, height: 35, bgcolor: '#0f172a', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 1.5, fontWeight: 'bold' }}>
                        {index + 1}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: '700', fontSize: '1.1rem' }}>{cliente.nombre}</TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" fontWeight="bold" display="block" color="text.secondary">VOLUMEN DE COMPRA</Typography>
                      <Typography variant="h6" fontWeight="900" color="#0061ff">
                        ${Number(cliente.total_comprado).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};

export default Dashboard;