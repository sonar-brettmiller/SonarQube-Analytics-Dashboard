import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as ReportsIcon,
  IntegrationInstructions as OnboardingIcon,
  Refresh as RefreshIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material';
import { useSonarQube } from '../contexts/SonarQubeContext';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isConnected, isLoading, refreshData, projects } = useSonarQube();

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path === '/reports') return 1;
    if (path === '/onboarding') return 2;
    return 0;
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/reports');
        break;
      case 2:
        navigate('/onboarding');
        break;
    }
  };

  const handleRefresh = () => {
    refreshData();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <CloudIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            SonarQube Analytics
          </Typography>
          
          {isConnected && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={`${projects.length} Projects`}
                color="primary"
                variant="outlined"
                size="small"
              />
              
              <Tooltip title="Refresh Data">
                <IconButton
                  onClick={handleRefresh}
                  disabled={isLoading}
                  color="primary"
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'white' }}>
        <Tabs
          value={getCurrentTab()}
          onChange={handleTabChange}
          aria-label="navigation tabs"
          sx={{ px: 2 }}
        >
          <Tab
            icon={<DashboardIcon />}
            label="Dashboard"
            iconPosition="start"
            sx={{ textTransform: 'none', fontWeight: 500 }}
          />
          <Tab
            icon={<ReportsIcon />}
            label="Reports"
            iconPosition="start"
            sx={{ textTransform: 'none', fontWeight: 500 }}
          />
          <Tab
            icon={<OnboardingIcon />}
            label="Repository Onboarding"
            iconPosition="start"
            sx={{ textTransform: 'none', fontWeight: 500 }}
          />
        </Tabs>
      </Box>

      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
