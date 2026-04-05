import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StorageIcon from '@mui/icons-material/Storage';

import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import MasterData from './pages/MasterData';

// Set the color theme for the whole app
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  },
  shape: { borderRadius: 8 }
});

// Top navigation bar shown on every page
function Navbar() {
  const location = useLocation();

  return (
    <AppBar position="static" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* App name on the left */}
          <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
            LogiEdge Billing
          </Typography>

          {/* Navigation buttons on the right */}
          <Box sx={{ display: 'flex', gap: 1 }}>

            <Button
              component={Link}
              to="/"
              color="inherit"
              startIcon={<DashboardIcon />}
              variant={location.pathname === '/' ? 'contained' : 'text'}
            >
              Dashboard
            </Button>

            <Button
              component={Link}
              to="/billing"
              color="inherit"
              startIcon={<ReceiptIcon />}
              variant={location.pathname === '/billing' ? 'contained' : 'text'}
            >
              Create Invoice
            </Button>

            <Button
              component={Link}
              to="/masterdata"
              color="inherit"
              startIcon={<StorageIcon />}
              variant={location.pathname === '/masterdata' ? 'contained' : 'text'}
            >
              Master Data
            </Button>

          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

// Main App — wraps everything with theme and routing
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.50', py: 2 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/masterdata" element={<MasterData />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
