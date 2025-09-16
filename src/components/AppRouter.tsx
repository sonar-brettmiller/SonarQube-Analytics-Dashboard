import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import SimpleDashboard from './SimpleDashboard';
import EnhancedDashboard from './EnhancedDashboard';
import TestConnection from './TestConnection';
import ProjectDebug from './ProjectDebug';
import ApiDebug from './ApiDebug';
import SimpleApiTest from './SimpleApiTest';
import Login from './Login';
import NavBar from './NavBar';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Box>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<SimpleDashboard />} />
          <Route path="/enhanced" element={<EnhancedDashboard />} />
          <Route path="/test" element={<TestConnection />} />
          <Route path="/debug" element={<ProjectDebug />} />
          <Route path="/api-debug" element={<ApiDebug />} />
          <Route path="/simple-test" element={<SimpleApiTest />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default AppRouter;
