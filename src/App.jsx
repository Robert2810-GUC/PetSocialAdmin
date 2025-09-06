import * as React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CssBaseline, Box, Drawer, AppBar, Toolbar, Typography, IconButton, List,
  ListItem, ListItemIcon, ListItemText, Divider, useTheme, useMediaQuery, Button,
  ListItemButton, Fade
} from '@mui/material';
import {
  Pets, Category, Palette, Group, Fastfood, Menu as MenuIcon, Dashboard, People
} from '@mui/icons-material';

import ServerDown from "./pages/ServerDown";
import DashboardPage from './pages/DashboardPage';
import PetTypes from './pages/PetTypes';
import Breeds from './pages/Breeds';
import Colors from './pages/Colors';
import PetFoods from './pages/PetFoods';
import UserTypes from './pages/UserTypes';
import PetOwners from './pages/PetOwners';
import Login from './pages/Login';
import logo from './assets/nobg_logo.png';

const drawerWidth = 220;

const navItems = [
  { label: 'Dashboard', path: '/dashboardpage', icon: <Dashboard /> },
  { label: 'Pet Types', path: '/pet-types', icon: <Category /> },
  { label: 'Breeds', path: '/breeds', icon: <Pets /> },
  { label: 'Colors', path: '/colors', icon: <Palette /> },
  { label: 'Pet Foods', path: '/pet-foods', icon: <Fastfood /> },
  { label: 'User Types', path: '/user-types', icon: <Group /> },
  { label: 'Pet Owners', path: '/pet-owners', icon: <People /> },
];

function Layout({ children, onLogout }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const drawer = (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 1 }}>
        <img
          src={logo}
          alt="Pet Social"
          style={{ width: 32  , marginRight: 12, marginLeft: 12 }}
        />
        <Typography variant="h6" fontWeight={700} color="#654321">Pet Social</Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem disablePadding key={item.label}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{ mx: 1, my: 0.5 }}
              onClick={() => setMobileOpen(false)}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fcf7f1' }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#ae8625',
          boxShadow: '0 2px 8px #0003'
        }}
        elevation={0}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" color="#fff" noWrap component="div">
            Admin Panel
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="inherit"
            onClick={() => {
              onLogout();
              navigate('/');
            }}
            sx={{ textTransform: 'none' }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box', width: drawerWidth
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box', width: drawerWidth
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 0, sm: 1 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8 // AppBar height
        }}
      >
        <Fade in key={location.pathname} timeout={600}>
          <Box sx={{ height: '100%' }}>{children}</Box>
        </Fade>
      </Box>
    </Box>
  );
}

export default function App() {
  const [token, setToken] = React.useState(() => localStorage.getItem('token'));

  const handleLogin = (tok) => {
    localStorage.setItem('token', tok);
    setToken(tok);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <BrowserRouter>
      {!token ? (
        <Routes>
          <Route path="/server-down" element={<ServerDown />} />
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      ) : (
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/dashboardpage" element={<DashboardPage />} />
            <Route path="/pet-types" element={<PetTypes />} />
            <Route path="/breeds" element={<Breeds />} />
            <Route path="/colors" element={<Colors />} />
            <Route path="/pet-foods" element={<PetFoods />} />
            <Route path="/user-types" element={<UserTypes />} />
            <Route path="/pet-owners" element={<PetOwners />} />
            <Route path="/server-down" element={<ServerDown />} />
          </Routes>
        </Layout>
      )}
    </BrowserRouter>
  );
}
