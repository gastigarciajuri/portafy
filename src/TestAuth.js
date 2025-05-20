import React, { useState } from 'react';
import { authService } from './services/authService';

export default function TestAuth() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const userData = await authService.loginWithGoogle();
      setUser(userData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Test de Autenticación</h2>
      {user ? (
        <div>
          <p>Bienvenido, {user.displayName} ({user.email})</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Iniciar sesión con Google</button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
