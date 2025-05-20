import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';
import { authService } from '../services/authService';
import './Login.css';

export default function Login({ onLogin }) {
  const [error, setError] = useState('');

  useEffect(() => {
    setError(''); // Limpiar error al montar el componente
  }, []);

  const handleLogin = async () => {
    try {
      const user = await authService.loginWithGoogle();
      onLogin(user);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Box className="login-landing-bg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', p: 2 }}>
      <Box className="login-landing-card" sx={{ bgcolor: 'background.paper', borderRadius: 4, boxShadow: 6, p: 5, maxWidth: 420, textAlign: 'center', mb: 6, animation: 'fadeInUp 1s' }}>
        <Typography variant="h3" color="primary" fontWeight={800} gutterBottom sx={{ letterSpacing: 2 }}>
          CallCenter PRO
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Optimiza tu gestión de llamadas, promociones y presupuestos.<br />
          <span style={{ color: '#009688', fontWeight: 700 }}>Rápido, seguro y profesional.</span>
        </Typography>
        <ul style={{ textAlign: 'left', margin: '0 auto 24px', maxWidth: 320, color: '#333', fontSize: 17, lineHeight: 1.6 }}>
          <li>🔎 Buscador dinámico de promociones</li>
          <li>📝 Notas personales persistentes</li>
          <li>🛒 Armador de presupuestos tipo carrito</li>
          <li>🔒 Acceso seguro solo para usuarios autorizados</li>
        </ul>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<GoogleIcon />}
          onClick={handleLogin}
          sx={{ fontWeight: 700, fontSize: 18, borderRadius: 3, boxShadow: 3, py: 1.5, px: 4, mt: 2, transition: 'transform 0.2s', ':hover': { transform: 'scale(1.04)' } }}
        >
          Ingresar con Google
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 2, fontWeight: 600 }}>
            {error}
          </Typography>
        )}
      </Box>
      <Typography variant="body2" color="white" sx={{ opacity: 0.8, letterSpacing: 1, animation: 'fadeIn 2s' }}>
        © {new Date().getFullYear()} CallCenter PRO. Todos los derechos reservados.
      </Typography>
    </Box>
  );
} 