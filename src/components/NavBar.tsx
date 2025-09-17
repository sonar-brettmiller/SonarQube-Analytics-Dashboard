import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Dashboard,
  BugReport,
  Code,
  Assessment,
  Security,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const NavBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const location = useLocation();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <Assessment sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            SonarQube Analytics
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<Dashboard />}
            color="inherit"
            sx={{
              bgcolor: isActive('/') ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Dashboard
          </Button>

          <Button
            component={Link}
            to="/cwe-analysis"
            startIcon={<Security />}
            color="inherit"
            sx={{
              bgcolor: isActive('/cwe-analysis') ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            CWE Analysis
          </Button>

          <Button
            component={Link}
            to="/cwe-browser"
            startIcon={<BugReport />}
            color="inherit"
            sx={{
              bgcolor: isActive('/cwe-browser') ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            CWE/CVE Browser
          </Button>

          <Button
            component={Link}
            to="/test"
            startIcon={<BugReport />}
            color="inherit"
            sx={{
              bgcolor: isActive('/test') ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Test Connection
          </Button>

          <Button
            component={Link}
            to="/debug"
            startIcon={<Code />}
            color="inherit"
            sx={{
              bgcolor: isActive('/debug') ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Debug Projects
          </Button>

          <Button
            component={Link}
            to="/api-debug"
            startIcon={<Code />}
            color="inherit"
            sx={{
              bgcolor: isActive('/api-debug') ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            API Debug
          </Button>

          <Button
            component={Link}
            to="/simple-test"
            startIcon={<BugReport />}
            color="inherit"
            sx={{
              bgcolor: isActive('/simple-test') ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Simple Test
          </Button>

          <Button
            component={Link}
            to="/security-reports"
            startIcon={<Security />}
            color="inherit"
            sx={{
              bgcolor: isActive('/security-reports') ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Security Reports
          </Button>
        </Box>

        {/* Mobile menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem component={Link} to="/" onClick={handleMenuClose}>
              <Dashboard sx={{ mr: 1 }} />
              Dashboard
            </MenuItem>
            <MenuItem component={Link} to="/cwe-analysis" onClick={handleMenuClose}>
              <Security sx={{ mr: 1 }} />
              CWE Analysis
            </MenuItem>
            <MenuItem component={Link} to="/cwe-browser" onClick={handleMenuClose}>
              <BugReport sx={{ mr: 1 }} />
              CWE/CVE Browser
            </MenuItem>
            <MenuItem component={Link} to="/test" onClick={handleMenuClose}>
              <BugReport sx={{ mr: 1 }} />
              Test Connection
            </MenuItem>
            <MenuItem component={Link} to="/debug" onClick={handleMenuClose}>
              <Code sx={{ mr: 1 }} />
              Debug Projects
            </MenuItem>
            <MenuItem component={Link} to="/api-debug" onClick={handleMenuClose}>
              <Code sx={{ mr: 1 }} />
              API Debug
            </MenuItem>
            <MenuItem component={Link} to="/simple-test" onClick={handleMenuClose}>
              <BugReport sx={{ mr: 1 }} />
              Simple Test
            </MenuItem>
            <MenuItem component={Link} to="/security-reports" onClick={handleMenuClose}>
              <Security sx={{ mr: 1 }} />
              Security Reports
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
