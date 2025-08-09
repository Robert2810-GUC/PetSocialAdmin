import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Grow
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

const authApi='/api/auth'
const gold = '#ae8625';
const brown = '#7a5c27';
const offWhite = '#fffbe6';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    const msg = localStorage.getItem('authMessage');
    if (msg) {
      setInfoMessage(msg);
      localStorage.removeItem('authMessage');
    }
  }, []);

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email address';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      const res = await api.post(`${authApi}/login`, { email, password });
      const token = res.data?.data?.token || res.data?.token;
      if (token) {
        onLogin(token);
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        } else {
          navigate('/dashboardpage');
        }
      } else {
        setServerError('Unexpected response from server');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed';
      setServerError(msg);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        bgcolor: offWhite,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Grow in timeout={600}>
        <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <PetsIcon sx={{ fontSize: 40, color: gold }} />
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 700, color: brown }}>
              Admin Login
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              error={Boolean(errors.password)}
              helperText={errors.password}
            />
            {(serverError || infoMessage) && (
              <Typography color="error" sx={{ mb: 2 }}>
                {serverError || infoMessage}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                bgcolor: gold,
                color: '#fff',
                fontWeight: 700,
                '&:hover': { bgcolor: brown }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Box>
        </Paper>
      </Grow>
    </Box>
  );
}
