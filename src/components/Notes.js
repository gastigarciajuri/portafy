import React, { useEffect, useState, useCallback } from 'react';
import { notesService } from '../services/notesService';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export default function Notes({ user }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loadingStates, setLoadingStates] = useState({
    initial: false,
    saving: false,
    deleting: false,
    loadingMore: false
  });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  const [previewNote, setPreviewNote] = useState(null);
  const NOTES_PER_PAGE = 3;

  const resetAndFetchNotes = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, initial: true }));
    setCurrentPage(0);
    setLastDoc(null);
    setHasMore(true);
    try {
      const data = await notesService.getUserNotes(user.uid, 20, null, searchTerm, sortBy);
      setNotes(data.notes);
      setLastDoc(data.lastDoc);
      setHasMore(data.notes.length === 20);
    } catch (e) {
      setSnackbar({ open: true, message: 'Error al cargar notas.', severity: 'error' });
    }
    setLoadingStates(prev => ({ ...prev, initial: false }));
  }, [user, searchTerm, sortBy]);

  useEffect(() => {
    if (user && user.uid) {
      resetAndFetchNotes();
    }
  }, [user, searchTerm, sortBy, resetAndFetchNotes]);

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
    setLastDoc(null);
  }, []);

  const handleSort = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(0);
    setLastDoc(null);
    setSortMenuAnchor(null);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * NOTES_PER_PAGE < notes.length) {
      setCurrentPage(prev => prev + 1);
    } else if (hasMore) {
      resetAndFetchNotes();
      setCurrentPage(prev => prev + 1);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date.seconds * 1000);
    return format(dateObj, "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es });
  };

  const validateForm = () => {
    if (!title.trim()) return 'El título es obligatorio.';
    if (!content.trim()) return 'El contenido es obligatorio.';
    return '';
  };

  const handleSave = async () => {
    setError('');
    setFeedback('');
    const validation = validateForm();
    if (validation) {
      setError(validation);
      return;
    }
    
    setLoadingStates(prev => ({ ...prev, saving: true }));
    
    try {
      if (editing) {
        await notesService.updateNote(editing, { title, content }, user.uid);
        setSnackbar({ open: true, message: '¡Nota actualizada!', severity: 'success' });
      } else {
        await notesService.addNote(user.uid, { title, content });
        setSnackbar({ open: true, message: '¡Nota agregada!', severity: 'success' });
      }
      setTitle('');
      setContent('');
      setEditing(null);
      resetAndFetchNotes();
    } catch (e) {
      console.error(e);
      setSnackbar({ open: true, message: 'Error al guardar la nota.', severity: 'error' });
    }
    
    setLoadingStates(prev => ({ ...prev, saving: false }));
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditing(note.id);
    setError('');
    setFeedback('');
  };

  const handleDelete = async (id) => {
    setError('');
    setFeedback('');
    setLoadingStates(prev => ({ ...prev, deleting: true }));
    
    try {
      await notesService.deleteNote(id, user.uid);
      setSnackbar({ open: true, message: '¡Nota eliminada!', severity: 'success' });
      resetAndFetchNotes();
    } catch (e) {
      setSnackbar({ open: true, message: 'Error al eliminar la nota.', severity: 'error' });
    }
    
    setLoadingStates(prev => ({ ...prev, deleting: false }));
    setConfirmDelete(null);
  };

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', px: 2 }}>
      <Typography variant="h4" color="primary" gutterBottom>Notas personales</Typography>
      
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Buscar notas..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ flex: 1 }}
        />
        <IconButton onClick={(e) => setSortMenuAnchor(e.currentTarget)}>
          <SortIcon />
        </IconButton>
        <Menu
          anchorEl={sortMenuAnchor}
          open={Boolean(sortMenuAnchor)}
          onClose={() => setSortMenuAnchor(null)}
        >
          <MenuItem onClick={() => handleSort('createdAt')}>Más recientes</MenuItem>
          <MenuItem onClick={() => handleSort('updatedAt')}>Última actualización</MenuItem>
          <MenuItem onClick={() => handleSort('title')}>Título A-Z</MenuItem>
        </Menu>
      </Stack>

      <Card sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 1 }}>
        <Stack spacing={2}>
          <TextField
            label="Título"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            disabled={loadingStates.saving}
            inputProps={{ maxLength: 100 }}
            helperText={`${title.length}/100 caracteres`}
          />
          <TextField
            label="Contenido"
            value={content}
            onChange={e => setContent(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            disabled={loadingStates.saving}
            inputProps={{ maxLength: 1000 }}
            helperText={`${content.length}/1000 caracteres`}
          />
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color={editing ? 'secondary' : 'primary'}
              startIcon={loadingStates.saving ? <CircularProgress size={20} color="inherit" /> : <NoteAddIcon />}
              onClick={handleSave}
              disabled={loadingStates.saving || !title}
            >
              {editing ? 'Actualizar' : 'Agregar'} nota
            </Button>
            {editing && (
              <Button
                variant="outlined"
                color="info"
                onClick={() => { setEditing(null); setTitle(''); setContent(''); setError(''); setFeedback(''); }}
                disabled={loadingStates.saving}
              >
                Cancelar
              </Button>
            )}
          </Stack>
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </Card>

      {loadingStates.initial ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ position: 'relative', width: '100%', maxWidth: 700, mx: 'auto', mt: 2 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'stretch',
                  gap: 3,
                  width: '100%',
                  minHeight: 320,
                  py: 1,
                }}
              >
                {notes
                  .slice(currentPage * NOTES_PER_PAGE, (currentPage + 1) * NOTES_PER_PAGE)
                  .map(note => (
                    <motion.div
                      key={note.id}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'flex', minWidth: 0, flex: 1, justifyContent: 'center' }}
                    >
                      <Card
                        sx={{
                          width: 210,
                          minWidth: 210,
                          maxWidth: 210,
                          height: 260,
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 3,
                          boxShadow: 3,
                          bgcolor: 'background.paper',
                          cursor: 'pointer',
                          mx: 'auto',
                          alignItems: 'center',
                        }}
                        onClick={() => setPreviewNote(note)}
                      >
                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', p: 2 }}>
                          <Typography variant="h6" color="secondary.main" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
                            {note.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mb: 1, textAlign: 'center' }}
                          >
                            {formatDate(note.createdAt)}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{
                              mb: 2,
                              minHeight: '60px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                              flex: 1,
                              textAlign: 'center',
                            }}
                          >
                            {note.content}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'center' }}>
                            <Button
                              variant="outlined"
                              color="info"
                              startIcon={<EditIcon />}
                              onClick={e => {
                                e.stopPropagation();
                                handleEdit(note);
                              }}
                              disabled={loadingStates.saving || loadingStates.deleting}
                              size="small"
                            >
                              Editar
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={loadingStates.deleting && confirmDelete === note.id ? (
                                <CircularProgress size={20} color="inherit" />
                              ) : (
                                <DeleteIcon />
                              )}
                              onClick={e => {
                                e.stopPropagation();
                                setConfirmDelete(note.id);
                              }}
                              disabled={loadingStates.saving || loadingStates.deleting}
                              size="small"
                            >
                              Eliminar
                            </Button>
                          </Stack>
                          {confirmDelete === note.id && (
                            <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'center' }}>
                              <Button
                                color="error"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDelete(note.id);
                                }}
                                size="small"
                              >
                                Sí
                              </Button>
                              <Button
                                onClick={e => {
                                  e.stopPropagation();
                                  setConfirmDelete(null);
                                }}
                                size="small"
                              >
                                No
                              </Button>
                            </Stack>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </Box>
            </motion.div>
          </AnimatePresence>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            mt: 2,
            gap: 2
          }}>
            <IconButton 
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              color="primary"
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
            
            <Typography variant="body2" color="text.secondary">
              Página {currentPage + 1} de {Math.ceil(notes.length / NOTES_PER_PAGE)}
            </Typography>

            <IconButton 
              onClick={handleNextPage}
              disabled={!hasMore && (currentPage + 1) * NOTES_PER_PAGE >= notes.length}
              color="primary"
            >
              {loadingStates.loadingMore ? 
                <CircularProgress size={24} /> : 
                <KeyboardArrowRightIcon />
              }
            </IconButton>
          </Box>
        </Box>
      )}

      <Dialog
        open={Boolean(previewNote)}
        onClose={() => setPreviewNote(null)}
        maxWidth="md"
        fullWidth
      >
        {previewNote && (
          <>
            <DialogTitle>
              <Typography variant="h5" color="primary">
                {previewNote.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(previewNote.createdAt)}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {previewNote.content}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPreviewNote(null)}>Cerrar</Button>
              <Button 
                color="primary" 
                onClick={() => {
                  handleEdit(previewNote);
                  setPreviewNote(null);
                }}
              >
                Editar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

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