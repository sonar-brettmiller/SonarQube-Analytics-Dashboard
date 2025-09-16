import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  BugReport,
  Security,
  Code,
  Assessment,
} from '@mui/icons-material';
import { useSonarQube } from '../contexts/SonarQubeContext';
import MetricsCard from './MetricsCard';
import ProjectList from './ProjectList';
import QualityGateStatus from './QualityGateStatus';
import IssuesOverview from './IssuesOverview';
import CoverageChart from './CoverageChart';

const Dashboard: React.FC = () => {
  const { isConnected, isLoading, error, reportData, projects } = useSonarQube();

  if (!isConnected) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5" color="text.secondary">
          Please connect to SonarQube Cloud to view the dashboard
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading dashboard data...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!reportData) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  const { overallMetrics, qualityGateStatus } = reportData;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Code Quality Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time insights into your code quality metrics and project health
        </Typography>
      </Box>

      {/* Key Metrics Row */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 calc(25% - 12px)', minWidth: 250 }}>
          <MetricsCard
            title="Code Coverage"
            value={`${overallMetrics.coverage.toFixed(1)}%`}
            icon={<Assessment />}
            color="success"
            trend={overallMetrics.coverage > 80 ? 'up' : 'down'}
            subtitle="Lines covered by tests"
          />
        </Box>
        <Box sx={{ flex: '1 1 calc(25% - 12px)', minWidth: 250 }}>
          <MetricsCard
            title="Bugs"
            value={overallMetrics.bugs.toString()}
            icon={<BugReport />}
            color={overallMetrics.bugs > 0 ? 'error' : 'success'}
            trend="down"
            subtitle="Issues that need attention"
          />
        </Box>
        <Box sx={{ flex: '1 1 calc(25% - 12px)', minWidth: 250 }}>
          <MetricsCard
            title="Vulnerabilities"
            value={overallMetrics.vulnerabilities.toString()}
            icon={<Security />}
            color={overallMetrics.vulnerabilities > 0 ? 'error' : 'success'}
            trend="down"
            subtitle="Security issues found"
          />
        </Box>
        <Box sx={{ flex: '1 1 calc(25% - 12px)', minWidth: 250 }}>
          <MetricsCard
            title="Code Smells"
            value={overallMetrics.codeSmells.toString()}
            icon={<Code />}
            color={overallMetrics.codeSmells > 100 ? 'warning' : 'success'}
            trend="down"
            subtitle="Maintainability issues"
          />
        </Box>
      </Box>

      {/* Quality Gate Status */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 300 }}>
          <QualityGateStatus
            passed={qualityGateStatus.passed}
            failed={qualityGateStatus.failed}
            total={qualityGateStatus.total}
          />
        </Box>
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 300 }}>
          <CoverageChart projects={projects} />
        </Box>
      </Box>

      {/* Issues Overview */}
      <Box sx={{ mb: 4 }}>
        <IssuesOverview projects={projects} />
      </Box>

      {/* Projects List */}
      <Box>
        <ProjectList projects={projects} />
      </Box>
    </Box>
  );
};

export default Dashboard;
