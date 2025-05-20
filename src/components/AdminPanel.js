import React, { useEffect, useState } from 'react';
import { promotionService } from '../services/promotionService';
import { generateKeywords } from '../utils/helpers';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ImageIcon from '@mui/icons-material/Image';

const initialPlan = { name: '', description: '', listPrice: '', monthlyDiscount: '', finalPrice: '' };
const initialBenefit = { title: '', description: '', duration: '' };
const initialState = {
  title: '',
  description: '',
  imageUrl: '',
  plans: [],
  benefits: [],
};

export default function AdminPanel({ user }) {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState(initialState);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  // Para planes y beneficios temporales
  const [plan, setPlan] = useState(initialPlan);
  const [benefit, setBenefit] = useState(initialBenefit);
  const [editPlanIdx, setEditPlanIdx] = useState(null);
  const [editBenefitIdx, setEditBenefitIdx] = useState(null);

  const fetchPromos = async () => {
    if (!user || !user.uid) return;
    setLoading(true);
    try {
      const data = await promotionService.getPromotions();
      setPromos(data.promotions || []);
    } catch (e) {
      setSnackbar({ open: true, message: 'Error al cargar promociones.', severity: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && user.uid) {
      fetchPromos();
    }
  }, [user]);

  const validateForm = () => {
    if (!form.title.trim()) return 'El título es obligatorio.';
    if (!form.description.trim()) return 'La descripción es obligatoria.';
    if (form.plans.length === 0) return 'Debes agregar al menos un plan.';
    return '';
  };

  const existsDuplicate = () => {
    return promos.some(p => p.title.trim().toLowerCase() === form.title.trim().toLowerCase() && p.id !== editing);
  };

  const handleSave = async () => {
    setError('');
    setSnackbar({ open: false, message: '', severity: 'success' });
    const validation = validateForm();
    if (validation) {
      setError(validation);
      return;
    }
    if (existsDuplicate()) {
      setError('Ya existe una promoción con ese título.');
      return;
    }
    setLoading(true);
    try {
      const keywords = generateKeywords(form.title + ' ' + form.description);
      const data = { ...form, plans: form.plans.map(p => ({ ...p, listPrice: Number(p.listPrice), monthlyDiscount: Number(p.monthlyDiscount), finalPrice: Number(p.finalPrice) })), keywords };
      if (editing) {
        await promotionService.updatePromotion(editing, data);
        setSnackbar({ open: true, message: '¡Promoción actualizada!', severity: 'success' });
      } else {
        await promotionService.addPromotion(data);
        setSnackbar({ open: true, message: '¡Promoción agregada!', severity: 'success' });
      }
      setForm(initialState);
      setEditing(null);
      fetchPromos();
    } catch (e) {
      setSnackbar({ open: true, message: 'Error al guardar la promoción.', severity: 'error' });
    }
    setLoading(false);
  };

  const handleEdit = promo => {
    setForm({ ...promo });
    setEditing(promo.id);
    setError('');
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  const handleDelete = async id => {
    setError('');
    setSnackbar({ open: false, message: '', severity: 'success' });
    setLoading(true);
    try {
      await promotionService.deletePromotion(id);
      setSnackbar({ open: true, message: '¡Promoción eliminada!', severity: 'success' });
      fetchPromos();
    } catch (e) {
      setSnackbar({ open: true, message: 'Error al eliminar la promoción.', severity: 'error' });
    }
    setLoading(false);
    setConfirmDelete(null);
  };

  // Planes
  const handleAddPlan = () => {
    if (!plan.name.trim() || !plan.listPrice || !plan.finalPrice) return;
    const newPlans = [...form.plans];
    if (editPlanIdx !== null) {
      newPlans[editPlanIdx] = plan;
    } else {
      newPlans.push(plan);
    }
    setForm({ ...form, plans: newPlans });
    setPlan(initialPlan);
    setEditPlanIdx(null);
  };
  const handleEditPlan = idx => {
    setPlan(form.plans[idx]);
    setEditPlanIdx(idx);
  };
  const handleDeletePlan = idx => {
    setForm({ ...form, plans: form.plans.filter((_, i) => i !== idx) });
    setEditPlanIdx(null);
    setPlan(initialPlan);
  };

  // Beneficios
  const handleAddBenefit = () => {
    if (!benefit.title.trim()) return;
    const newBenefits = [...form.benefits];
    if (editBenefitIdx !== null) {
      newBenefits[editBenefitIdx] = benefit;
    } else {
      newBenefits.push(benefit);
    }
    setForm({ ...form, benefits: newBenefits });
    setBenefit(initialBenefit);
    setEditBenefitIdx(null);
  };
  const handleEditBenefit = idx => {
    setBenefit(form.benefits[idx]);
    setEditBenefitIdx(idx);
  };
  const handleDeleteBenefit = idx => {
    setForm({ ...form, benefits: form.benefits.filter((_, i) => i !== idx) });
    setEditBenefitIdx(null);
    setBenefit(initialBenefit);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h4" color="primary" gutterBottom>Panel de administración</Typography>
      <Card sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 1 }}>
        <Stack spacing={2}>
          <TextField
            name="title"
            label="Título de la promoción"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            fullWidth
            disabled={loading}
          />
          <TextField
            name="description"
            label="Descripción"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            fullWidth
            disabled={loading}
          />
          <TextField
            name="imageUrl"
            label="URL de la imagen (opcional)"
            value={form.imageUrl}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            fullWidth
            disabled={loading}
            InputProps={{ startAdornment: <ImageIcon color="info" sx={{ mr: 1 }} /> }}
          />
          {/* Planes */}
          <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, mb: 2 }}>
            <Typography variant="h6" color="secondary.main">Planes</Typography>
            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
              <TextField label="Nombre" value={plan.name} onChange={e => setPlan({ ...plan, name: e.target.value })} size="small" sx={{ width: 120 }} />
              <TextField label="Descripción" value={plan.description} onChange={e => setPlan({ ...plan, description: e.target.value })} size="small" sx={{ width: 180 }} />
              <TextField label="Precio de lista" type="number" value={plan.listPrice} onChange={e => setPlan({ ...plan, listPrice: e.target.value })} size="small" sx={{ width: 120 }} />
              <TextField label="Bono descuento" type="number" value={plan.monthlyDiscount} onChange={e => setPlan({ ...plan, monthlyDiscount: e.target.value })} size="small" sx={{ width: 120 }} />
              <TextField label="Precio final" type="number" value={plan.finalPrice} onChange={e => setPlan({ ...plan, finalPrice: e.target.value })} size="small" sx={{ width: 120 }} />
              <Button variant="contained" color={editPlanIdx !== null ? 'secondary' : 'primary'} onClick={handleAddPlan} sx={{ minWidth: 40 }}>{editPlanIdx !== null ? 'Actualizar' : 'Agregar'}</Button>
              {editPlanIdx !== null && <Button onClick={() => { setEditPlanIdx(null); setPlan(initialPlan); }}>Cancelar</Button>}
            </Stack>
            <Stack spacing={1}>
              {form.plans.map((p, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper', p: 1, borderRadius: 1 }}>
                  <Typography variant="body1" sx={{ minWidth: 80 }}>{p.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>{p.description}</Typography>
                  <Typography variant="body2">Lista: ${p.listPrice}</Typography>
                  <Typography variant="body2" color="info.main">Bono: ${p.monthlyDiscount}</Typography>
                  <Typography variant="body2" color="success.main">Final: ${p.finalPrice}</Typography>
                  <Button size="small" color="info" onClick={() => handleEditPlan(idx)} startIcon={<EditIcon />}>Editar</Button>
                  <Button size="small" color="error" onClick={() => handleDeletePlan(idx)} startIcon={<DeleteIcon />}>Eliminar</Button>
                </Box>
              ))}
            </Stack>
          </Box>
          {/* Beneficios */}
          <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, mb: 2 }}>
            <Typography variant="h6" color="secondary.main">Beneficios</Typography>
            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
              <TextField label="Título" value={benefit.title} onChange={e => setBenefit({ ...benefit, title: e.target.value })} size="small" sx={{ width: 160 }} />
              <TextField label="Descripción" value={benefit.description} onChange={e => setBenefit({ ...benefit, description: e.target.value })} size="small" sx={{ width: 220 }} />
              <TextField label="Duración" value={benefit.duration} onChange={e => setBenefit({ ...benefit, duration: e.target.value })} size="small" sx={{ width: 120 }} />
              <Button variant="contained" color={editBenefitIdx !== null ? 'secondary' : 'primary'} onClick={handleAddBenefit} sx={{ minWidth: 40 }}>{editBenefitIdx !== null ? 'Actualizar' : 'Agregar'}</Button>
              {editBenefitIdx !== null && <Button onClick={() => { setEditBenefitIdx(null); setBenefit(initialBenefit); }}>Cancelar</Button>}
            </Stack>
            <Stack spacing={1}>
              {form.benefits.map((b, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper', p: 1, borderRadius: 1 }}>
                  <Typography variant="body1" sx={{ minWidth: 120 }}>{b.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 180 }}>{b.description}</Typography>
                  <Typography variant="body2" color="info.main">{b.duration}</Typography>
                  <Button size="small" color="info" onClick={() => handleEditBenefit(idx)} startIcon={<EditIcon />}>Editar</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteBenefit(idx)} startIcon={<DeleteIcon />}>Eliminar</Button>
                </Box>
              ))}
            </Stack>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color={editing ? 'secondary' : 'primary'}
              startIcon={<AddCircleIcon />}
              onClick={handleSave}
              disabled={loading}
            >
              {editing ? 'Actualizar' : 'Agregar'} promoción
            </Button>
            {editing && (
              <Button
                variant="outlined"
                color="info"
                onClick={() => { setEditing(null); setForm(initialState); setError(''); setSnackbar({ open: false, message: '', severity: 'success' }); setPlan(initialPlan); setBenefit(initialBenefit); setEditPlanIdx(null); setEditBenefitIdx(null); }}
                disabled={loading}
              >
                Cancelar
              </Button>
            )}
          </Stack>
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </Card>
      <Stack spacing={2}>
        {promos.map(promo => (
          <Card key={promo.id} sx={{ borderRadius: 3, boxShadow: 1, bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h6" color="secondary.main">{promo.title}</Typography>
              <Typography variant="body2" color="text.secondary">{promo.description}</Typography>
              {promo.imageUrl && (
                <Box sx={{ mt: 1 }}>
                  <img src={promo.imageUrl} alt={promo.title} style={{ maxWidth: 180, borderRadius: 8 }} />
                </Box>
              )}
              <Typography variant="subtitle1" color="primary" sx={{ mt: 2 }}>Planes:</Typography>
              <Stack spacing={1}>
                {promo.plans && promo.plans.map((p, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.default', p: 1, borderRadius: 1 }}>
                    <Typography variant="body1" sx={{ minWidth: 80 }}>{p.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>{p.description}</Typography>
                    <Typography variant="body2">Lista: ${p.listPrice}</Typography>
                    <Typography variant="body2" color="info.main">Bono: ${p.monthlyDiscount}</Typography>
                    <Typography variant="body2" color="success.main">Final: ${p.finalPrice}</Typography>
                  </Box>
                ))}
              </Stack>
              <Typography variant="subtitle1" color="primary" sx={{ mt: 2 }}>Beneficios:</Typography>
              <Stack spacing={1}>
                {promo.benefits && promo.benefits.map((b, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.default', p: 1, borderRadius: 1 }}>
                    <Typography variant="body1" sx={{ minWidth: 120 }}>{b.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 180 }}>{b.description}</Typography>
                    <Typography variant="body2" color="info.main">{b.duration}</Typography>
                  </Box>
                ))}
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="info"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(promo)}
                  disabled={loading}
                >
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setConfirmDelete(promo.id)}
                  disabled={loading}
                >
                  Eliminar
                </Button>
                {confirmDelete === promo.id && (
                  <Box sx={{ ml: 2 }}>
                    <Button color="error" onClick={() => handleDelete(promo.id)} size="small">¿Seguro?</Button>
                    <Button onClick={() => setConfirmDelete(null)} size="small">No</Button>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
} 