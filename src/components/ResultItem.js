import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatPrice } from '../utils/helpers';

export default function ResultItem({ item, onCopy, onAddToBudget }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  // Copiar nombre de plan, precio final y beneficios
  const handleCopyResumen = (e) => {
    e.stopPropagation();
    let resumen = '';
    if (item.plans && item.plans.length > 0) {
      resumen += item.plans.map(plan => `${plan.name}: ${formatPrice(plan.finalPrice)}`).join('\n');
    }
    if (item.benefits && item.benefits.length > 0) {
      resumen += '\n\nBeneficios:\n';
      resumen += item.benefits.map(b => `- ${b.title}${b.description ? ': ' + b.description : ''}${b.duration ? ' (' + b.duration + ')' : ''}`).join('\n');
    }
    if (resumen) {
      navigator.clipboard.writeText(resumen);
    } else {
      onCopy(item);
    }
  };

  return (
    <Card sx={{ mb: 2, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 2 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleExpandClick}>
        {item.imageUrl && (
          <CardMedia
            component="img"
            image={item.imageUrl}
            alt={item.title}
            sx={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 2, mr: 2 }}
          />
        )}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" color="primary" gutterBottom>{item.title}</Typography>
          <Typography variant="body2" color="text.secondary">{item.description}</Typography>
        </Box>
        <IconButton onClick={handleExpandClick} aria-expanded={expanded} aria-label="Mostrar más">
          <ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />
        </IconButton>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/* Beneficios */}
          {item.benefits && item.benefits.length > 0 && (
            <>
              <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>Beneficios destacados:</Typography>
              <Stack spacing={1} direction="row" flexWrap="wrap" sx={{ mb: 2 }}>
                {item.benefits.map((b, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#eafff0', p: 1.2, borderRadius: 2, minWidth: 180, boxShadow: 1, mb: 1 }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 22 }} />
                    <Box>
                      <Typography variant="body2" color="success.main" fontWeight={700}>{b.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{b.description}</Typography>
                      <Typography variant="caption" color="info.main">{b.duration}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </>
          )}
          {/* Planes */}
          {item.plans && item.plans.length > 0 && (
            <>
              <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>Planes disponibles:</Typography>
              <Stack spacing={2}>
                {item.plans.map((plan, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: selectedPlan === plan ? 'info.light' : 'background.default', p: 2, borderRadius: 2, boxShadow: selectedPlan === plan ? 2 : 0 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main', fontSize: 18 }}>{plan.name}</Typography>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Lista:</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{formatPrice(plan.listPrice)}</Typography>
                        <Typography variant="body2" sx={{ color: '#FF9800', fontWeight: 700 }}>Bono:</Typography>
                        <Typography variant="body2" sx={{ color: '#FF9800', fontWeight: 700 }}>{formatPrice(plan.monthlyDiscount)}</Typography>
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 700, fontSize: 20, ml: 2 }}>Final: {formatPrice(plan.finalPrice)}</Typography>
                      </Stack>
                      {plan.description && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{plan.description}</Typography>}
                    </Box>
                    <Button
                      variant={selectedPlan === plan ? 'contained' : 'outlined'}
                      color="primary"
                      size="medium"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={e => { e.stopPropagation(); handleSelectPlan(plan); }}
                      sx={{ fontWeight: 700 }}
                    >
                      {selectedPlan === plan ? 'Seleccionado' : 'Elegir'}
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      size="medium"
                      sx={{ ml: 1, fontWeight: 700, boxShadow: 2 }}
                      startIcon={<CheckCircleIcon />}
                      onClick={e => { e.stopPropagation(); onAddToBudget && onAddToBudget(item, plan); }}
                    >
                      Agregar al presupuesto
                    </Button>
                  </Box>
                ))}
              </Stack>
            </>
          )}
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<FileCopyIcon />}
              onClick={handleCopyResumen}
            >
              Copiar resumen
            </Button>
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
} 