import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Slide from '@mui/material/Slide';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const tabConfig = [
  { label: 'Buscador', value: 'search', icon: <EmojiObjectsIcon /> },
  { label: 'Notas', value: 'notes', icon: <NoteAltIcon /> },
  { label: 'Presupuesto', value: 'budget', icon: <ShoppingCartIcon /> },
];

export default function Layout({ user, isAdmin, current, setCurrent, children, onLogout, budgetCount = 0 }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      <HideOnScroll>
        <AppBar position="fixed" color="primary" elevation={2} sx={{ zIndex: 1300 }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ fontWeight: 700, fontSize: 24, letterSpacing: 1, color: 'white', mr: 3 }}>
                CallCenter PRO
              </Box>
              <Tabs
                value={current}
                onChange={(_, v) => setCurrent(v)}
                textColor="inherit"
                indicatorColor="secondary"
                sx={{ minHeight: 48 }}
              >
                {tabConfig.map(tab => (
                  <Tab
                    key={tab.value}
                    value={tab.value}
                    icon={tab.value === 'budget' ? (
                      <Badge badgeContent={budgetCount} color="error">
                        {tab.icon}
                      </Badge>
                    ) : tab.icon}
                    label={tab.label}
                    sx={{ minHeight: 48, fontWeight: 600 }}
                  />
                ))}
                {isAdmin && (
                  <Tab
                    value="admin"
                    icon={<AdminPanelSettingsIcon />}
                    label="Admin"
                    sx={{ minHeight: 48, fontWeight: 600 }}
                  />
                )}
              </Tabs>
            </Box>
            {/* Usuario y menú */}
            {user && (
              <Box sx={{ ml: 2 }}>
                <Tooltip title={user.displayName || user.email}>
                  <IconButton onClick={handleMenu} size="small" sx={{ ml: 2 }}>
                    <Avatar src={user.photoURL || undefined} alt={user.displayName || user.email} />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      minWidth: 220,
                    },
                  }}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1" color="primary.main" fontWeight={700}>
                      {user.displayName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <MenuItem onClick={onLogout} sx={{ color: 'error.main', fontWeight: 600 }}>Cerrar sesión</MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 12, p: 2 }}>{children}</Box>
    </Box>
  );
} 