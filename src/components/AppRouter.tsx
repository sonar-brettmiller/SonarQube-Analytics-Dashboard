import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Dashboard from './Dashboard';
import EnhancedCweAnalysis from './EnhancedCweAnalysis';
import CweCveBrowser from './CweCveBrowser';
import SecurityReportsTest from './SecurityReportsTest';
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
              <Route path="/" element={<Dashboard />} />
              <Route path="/cwe-analysis" element={<EnhancedCweAnalysis />} />
              <Route path="/cwe-browser" element={<CweCveBrowser />} />
              <Route path="/security-reports" element={<SecurityReportsTest />} />
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
