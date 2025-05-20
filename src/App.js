import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Layout from './components/Layout';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Notes from './components/Notes';
import BudgetBuilder from './components/BudgetBuilder';
import AdminPanel from './components/AdminPanel';
import { promotionService } from './services/promotionService';
import { authService } from './services/authService';
import { auth } from './config/firebase';

const ADMIN_EMAIL = 'gastongarciajuri@gmail.com';

function App() {
  const [user, setUser] = useState(null);
  const [current, setCurrent] = useState('search');
  const [allPromos, setAllPromos] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [budgetItems, setBudgetItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Persistencia de login
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Persistencia de presupuesto en localStorage
  useEffect(() => {
    const saved = localStorage.getItem('budgetItems');
    if (saved) {
      try {
        setBudgetItems(JSON.parse(saved));
      } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('budgetItems', JSON.stringify(budgetItems));
  }, [budgetItems]);

  // Cargar todas las promociones al inicio
  useEffect(() => {
    if (!user) return; // Solo cargar promociones si hay usuario autenticado
    const fetchPromos = async () => {
      setLoading(true);
      const { promotions } = await promotionService.getPromotions();
      setAllPromos(promotions);
      setResults(promotions);
      setLoading(false);
    };
    fetchPromos();
  }, [user]);

  // Filtrar dinámicamente
  const handleSearch = async (query) => {
    setSearchQuery(query);
    setLoading(true);
    if (!query) {
      setResults(allPromos);
      setLoading(false);
      return;
    }
    // Buscar por keywords
    const { promotions: promos } = await promotionService.searchPromotions(query);
    // También buscar por coincidencia en título o descripción
    const filtered = allPromos.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
    // Unir y eliminar duplicados
    const ids = new Set(promos.map(p => p.id));
    const merged = [...promos, ...filtered.filter(p => !ids.has(p.id))];
    setResults(merged);
    setLoading(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  // Agregar plan al presupuesto (sin redirigir)
  const handleAddToBudget = (promo, plan) => {
    setBudgetItems(prev => [
      ...prev,
      {
        name: `${promo.title} - ${plan.name}`,
        price: plan.finalPrice,
        quantity: 1,
        promoId: promo.id,
        planName: plan.name
      }
    ]);
    // No redirigir
  };

  // Eliminar ítem del presupuesto
  const handleRemoveBudgetItem = (idx) => {
    setBudgetItems(items => items.filter((_, i) => i !== idx));
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const isAdmin = user.email === ADMIN_EMAIL;

  return (
    <Layout
      user={user}
      isAdmin={isAdmin}
      current={current}
      setCurrent={setCurrent}
      onLogout={handleLogout}
      budgetCount={budgetItems.length}
    >
      {current === 'search' && (
        <>
          <SearchBar onSearch={handleSearch} />
          {loading ? <p>Buscando...</p> : <SearchResults results={results} onAddToBudget={handleAddToBudget} />}
        </>
      )}
      {current === 'notes' && <Notes user={user} />}
      {current === 'budget' && <BudgetBuilder user={user} items={budgetItems} onRemoveItem={handleRemoveBudgetItem} />}
      {current === 'admin' && isAdmin && <AdminPanel user={user} />}
      {current === 'admin' && !isAdmin && <p>No tienes permisos para acceder a esta sección.</p>}
    </Layout>
  );
}

export default App; 