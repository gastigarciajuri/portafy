import React from 'react';
import ResultItem from './ResultItem';
import { copyToClipboard, classifyResults } from '../utils/helpers';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function SearchResults({ results, onAddToBudget }) {
  const handleCopy = (item) => {
    let text = '';
    if (item.type === 'price') {
      text = `${item.title}: $${item.price}`;
    } else if (item.type === 'image') {
      text = `${item.title}: ${item.imageUrl}`;
    } else {
      text = item.content || item.title;
    }
    copyToClipboard(text);
  };

  const classified = classifyResults(results);

  return (
    <Box>
      {Object.keys(classified).length === 0 && <Typography color="text.secondary">No hay resultados.</Typography>}
      {Object.entries(classified).map(([type, items]) => (
        <Box key={type} sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ textTransform: 'capitalize', color: 'secondary.main', mb: 2 }}>
            {type === 'text' ? 'Textos' : type === 'image' ? 'Imágenes' : 'Precios'}
          </Typography>
          {items.map(item => (
            <ResultItem key={item.id} item={item} onCopy={handleCopy} onAddToBudget={onAddToBudget} />
          ))}
        </Box>
      ))}
    </Box>
  );
} 