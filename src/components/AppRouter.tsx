import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SimpleDashboard from './SimpleDashboard';
import TestConnection from './TestConnection';
import ProjectDebug from './ProjectDebug';
import ApiDebug from './ApiDebug';
import SimpleApiTest from './SimpleApiTest';
import Login from './Login';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<SimpleDashboard />} />
        <Route path="/test" element={<TestConnection />} />
        <Route path="/debug" element={<ProjectDebug />} />
        <Route path="/api-debug" element={<ApiDebug />} />
        <Route path="/simple-test" element={<SimpleApiTest />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
