import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Alert,
  InputAdornment, IconButton, Stack, Grid, Grow
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import KeyTwoToneIcon from '@mui/icons-material/KeyTwoTone';
import AlternateEmailTwoToneIcon from '@mui/icons-material/AlternateEmailTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import PrecisionManufacturingTwoToneIcon from '@mui/icons-material/PrecisionManufacturingTwoTone';

function PaginaLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false); // Nuevo: estado visual de carga

  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setCargando(true);

    try {
      // Intentamos iniciar sesión. 
      // Si el backend responde con role_id y permisos, AuthContext los procesará.
      await iniciarSesion(email, password);
      // Nota: No necesitamos navigate aquí porque AuthContext ya lo hace al final de iniciarSesion
    } catch (err) {
      console.error("Error en el login componente:", err);
      setError(err.response?.data?.message || 'Error de conexión con el protocolo de seguridad.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#050505', overflow: 'hidden' }}>
      <Grid container>
        {/* --- LADO IZQUIERDO: BRANDING --- */}
        <Grid item xs={12} md={7} sx={{ 
            position: 'relative', 
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            p: 8,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #0f172a 0%, #000 100%)',
            '&::after': {
                content: '""', position: 'absolute', width: '150%', height: '100%',
                top: 0, left: '80%', bgcolor: '#050505', transform: 'skewX(-15deg)', zIndex: 1
            }
        }}>
          <Grow in timeout={1000}>
            <Box sx={{ zIndex: 2 }}>
              <PrecisionManufacturingTwoToneIcon sx={{ fontSize: 80, color: '#6366f1', mb: 2 }} />
              <Typography variant="h1" sx={{ 
                fontWeight: 900, color: '#fff', fontSize: '5rem', lineHeight: 1, letterSpacing: '-4px', mb: 2
              }}>
                CONTROL <br /> <span style={{ color: '#6366f1' }}>INDUSTRIAL</span>
              </Typography>
              <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 300, maxWidth: '500px' }}>
                Sistema de gestión de producción de alta precisión. Controle cada engranaje de su operación.
              </Typography>
            </Box>
          </Grow>
          <Box sx={{ 
            position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px', 
            bgcolor: 'rgba(99, 102, 241, 0.15)', borderRadius: '50%', filter: 'blur(100px)' 
          }} />
        </Grid>

        {/* --- LADO DERECHO: FORMULARIO --- */}
        <Grid item xs={12} md={5} sx={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            p: { xs: 3, md: 8 }, zIndex: 5, bgcolor: '#050505' 
        }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: '400px' }}>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mb: 1 }}>
                Login de Acceso
              </Typography>
              <Box sx={{ width: '40px', height: '4px', bgcolor: '#6366f1', borderRadius: '2px' }} />
            </Box>

            {error && (
              <Alert severity="error" variant="filled" sx={{ mb: 3, bgcolor: '#ef4444', borderRadius: '8px' }}>
                {error}
              </Alert>
            )}

            <Stack spacing={3}>
              <TextField
                fullWidth
                label="ID de Usuario / Email"
                variant="filled"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlternateEmailTwoToneIcon sx={{ color: '#6366f1' }} />
                    </InputAdornment>
                  ),
                  sx: { 
                    bgcolor: 'rgba(255,255,255,0.03)', color: '#fff', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.07)' },
                    '&.Mui-focused': { border: '1px solid #6366f1' }
                  }
                }}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.4)', '&.Mui-focused': { color: '#6366f1' } } }}
              />

              <TextField
                fullWidth
                label="Token de Seguridad"
                type={showPassword ? 'text' : 'password'}
                variant="filled"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyTwoToneIcon sx={{ color: '#6366f1' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: 'rgba(255,255,255,0.3)' }}>
                      {showPassword ? <VisibilityOffTwoToneIcon /> : <VisibilityTwoToneIcon />}
                    </IconButton>
                  ),
                  sx: { 
                    bgcolor: 'rgba(255,255,255,0.03)', color: '#fff', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.07)' },
                    '&.Mui-focused': { border: '1px solid #6366f1' }
                  }
                }}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.4)', '&.Mui-focused': { color: '#6366f1' } } }}
              />

              <Button
                type="submit"
                fullWidth
                disabled={cargando}
                sx={{
                  py: 2,
                  mt: 2,
                  bgcolor: '#6366f1',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1rem',
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                  transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  '&:hover': {
                    bgcolor: '#4f46e5',
                    transform: 'scale(1.02)',
                    boxShadow: '0 12px 30px rgba(99, 102, 241, 0.6)',
                  },
                  '&:disabled': { bgcolor: 'rgba(99, 102, 241, 0.3)', color: 'rgba(255,255,255,0.3)' }
                }}
              >
                {cargando ? 'VALIDANDO...' : 'AUTENTICAR SISTEMA'}
              </Button>
            </Stack>

            <Box sx={{ position: 'relative', py: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.1)' }} />
              <Typography variant="caption" sx={{ px: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.65rem' }}>
                Protocolo Externo
              </Typography>
              <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.1)' }} />
            </Box>

            <Button
              fullWidth
              onClick={() => navigate('/registro')}
              sx={{
                py: 1.5,
                bgcolor: 'transparent',
                color: '#00f2fe',
                fontWeight: 700,
                fontSize: '0.85rem',
                borderRadius: '12px',
                textTransform: 'none',
                border: '1px dashed rgba(0, 242, 254, 0.5)',
                transition: '0.3s',
                '&:hover': {
                  bgcolor: 'rgba(0, 242, 254, 0.05)',
                  borderColor: '#00f2fe',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              SOLICITAR NUEVO ACCESO (REGISTRO)
            </Button>

            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', mt: 10, letterSpacing: '2px', fontSize: '0.7rem' }}>
              DERECHOS RESERVADOS // 2026
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PaginaLogin;