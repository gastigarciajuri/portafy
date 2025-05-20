import React, { useState } from 'react';
import { budgetService } from '../services/budgetService';
import { copyToClipboard } from '../utils/helpers';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function BudgetBuilder({ user, items = [], onRemoveItem }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [localItems, setLocalItems] = useState([]);

  // Combinar items de props (agregados desde el buscador) y locales (agregados manualmente)
  const allItems = [...localItems, ...items];

  const validateForm = () => {
    if (!name.trim()) return 'El nombre es obligatorio.';
    if (!price || isNaN(price) || Number(price) <= 0) return 'El precio debe ser un número mayor a 0.';
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) return 'La cantidad debe ser un número mayor a 0.';
    return '';
  };

  const handleAdd = () => {
    setError('');
    setFeedback('');
    const validation = validateForm();
    if (validation) {
      setError(validation);
      return;
    }
    setLocalItems([...localItems, { name, price: Number(price), quantity: Number(quantity) }]);
    setName('');
    setPrice('');
    setQuantity(1);
    setFeedback('¡Producto agregado!');
    setSnackbar({ open: true, message: '¡Producto agregado!', severity: 'success' });
  };

  const handleRemove = (idx, isProp) => {
    if (isProp && onRemoveItem) {
      onRemoveItem(idx - localItems.length); // idx relativo a items de props
    } else {
      setLocalItems(localItems.filter((_, i) => i !== idx));
    }
    setConfirmDelete(null);
    setFeedback('¡Producto eliminado!');
    setSnackbar({ open: true, message: '¡Producto eliminado!', severity: 'success' });
  };

  const handleCopy = () => {
    setLoading(true);
    let text = '🛒 Presupuesto\n--------------------------\n';
    text += allItems.map(item => `${item.name} - ${item.quantity} x $${item.price} = $${item.price * item.quantity}`).join('\n');
    text += `\n\n💰 TOTAL: $${budgetService.calculateTotal(allItems)}`;
    copyToClipboard(text);
    setCopied(true);
    setFeedback('¡Presupuesto copiado!');
    setSnackbar({ open: true, message: '¡Presupuesto copiado!', severity: 'success' });
    setTimeout(() => {
      setCopied(false);
      setLoading(false);
    }, 1500);
  };

  const total = budgetService.calculateTotal(allItems);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" color="primary" gutterBottom>Armador de presupuesto</Typography>
      <Card sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 1 }}>
        <Stack direction="row" spacing={2} mb={2}>
          <TextField
            label="Producto/servicio"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Precio"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Cantidad"
            type="number"
            min={1}
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            fullWidth
            disabled={loading}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddShoppingCartIcon />}
            onClick={handleAdd}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            Agregar
          </Button>
        </Stack>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {feedback && <Alert severity="success" sx={{ mb: 2 }}>{feedback}</Alert>}
        <Stack spacing={2}>
          {allItems.map((item, idx) => (
            <Card key={idx} sx={{ borderRadius: 2, boxShadow: 1, bgcolor: 'background.default' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1">
                  {item.name} - {item.quantity} x ${item.price} = ${item.price * item.quantity}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setConfirmDelete(idx)}
                    disabled={loading}
                  >
                    Quitar
                  </Button>
                  {confirmDelete === idx && (
                    <Box sx={{ ml: 1 }}>
                      <Button color="error" onClick={() => handleRemove(idx, idx >= localItems.length)} size="small">¿Seguro?</Button>
                      <Button onClick={() => setConfirmDelete(null)} size="small">No</Button>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
        <Typography variant="h6" color="success.main" sx={{ mt: 3, fontWeight: 700 }}>
          Total: ${total}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopy}
          disabled={allItems.length === 0 || loading}
          sx={{ mt: 2, borderRadius: 2 }}
        >
          Copiar presupuesto
        </Button>
        {copied && <Typography color="success.main" sx={{ ml: 2, display: 'inline' }}>¡Copiado!</Typography>}
      </Card>
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