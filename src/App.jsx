import * as React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  CssBaseline, Box, Drawer, AppBar, Toolbar, Typography, IconButton, List,
  ListItem, ListItemIcon, ListItemText, Divider, useTheme, useMediaQuery
} from '@mui/material';
import {
  Pets, Category, Palette, Group, Menu as MenuIcon, Dashboard
} from '@mui/icons-material';

import ServerDown from "./pages/ServerDown";

import DashboardPage from './pages/DashboardPage';
import PetTypes from './pages/PetTypes';
import Breeds from './pages/Breeds';
import Colors from './pages/Colors';
// import UserTypes from './pages/UserTypes';

const drawerWidth = 220;

const navItems = [
  { label: 'Dashboard', path: '/', icon: <Dashboard /> },
  { label: 'Pet Types', path: '/pet-types', icon: <Category /> },
  { label: 'Breeds', path: '/breeds', icon: <Pets /> },
  { label: 'Colors', path: '/colors', icon: <Palette /> },
  { label: 'User Types', path: '/user-types', icon: <Group /> },
];

function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  const drawer = (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 1 }}>
        <img
          src="/logo.png"
          alt="PetCentral"
          style={{ width: 44, marginRight: 12 }}
        />
        <Typography variant="h6" fontWeight={700} color="#654321">PetCentral</Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            
            key={item.label}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': { background: '#f2e6da', color: '#ae8625' },
              borderRadius: 2,
              my: 0.5,
            }}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
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
          bgcolor: '#ae8625'
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
              boxSizing: 'border-box', width: drawerWidth, bgcolor: '#fffbe6'
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
              boxSizing: 'border-box', width: drawerWidth, bgcolor: '#fffbe6'
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
        {children}
      </Box>
    </Box>
  );
}

// Dummy pages for routes (replace as you build)

function UserTypes() { return <Typography variant="h4">User Types CRUD (TBDs)</Typography>; }

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/pet-types" element={<PetTypes />} />
          <Route path="/breeds" element={<Breeds />} />
          <Route path="/colors" element={<Colors />} />
          <Route path="/user-types" element={<UserTypes />} />
          <Route path="/server-down" element={<ServerDown />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
