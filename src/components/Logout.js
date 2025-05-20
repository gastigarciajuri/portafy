import React from 'react';
import { authService } from '../services/authService';

export default function Logout({ user, onLogout }) {
  const handleLogout = async () => {
    await authService.logout();
    onLogout();
  };

  return (
    <div style={{ padding: 16, textAlign: 'right' }}>
      <span style={{ marginRight: 16 }}>
        {user.displayName} ({user.email})
      </span>
      <button onClick={handleLogout} style={{ fontSize: 14, padding: '6px 16px' }}>
        Cerrar sesión
      </button>
    </div>
  );
} 