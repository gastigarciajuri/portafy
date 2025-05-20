import React, { useState } from 'react';
import { promotionService } from './services/promotionService';

export default function TestFirestore() {
  const [promos, setPromos] = useState([]);
  const [error, setError] = useState('');

  const fetchPromos = async () => {
    setError('');
    try {
      const data = await promotionService.getPromotions();
      setPromos(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Test de Firestore</h2>
      <button onClick={fetchPromos}>Cargar promociones</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {promos.map(p => (
          <li key={p.id}>{p.title || p.id}</li>
        ))}
      </ul>
    </div>
  );
} 