import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Container,
  Stack,
  Button,
} from '@mui/material';
import {
  BugReport,
  Security,
  Code,
  Assessment,
} from '@mui/icons-material';
import { useSonarQube } from '../contexts/SonarQubeContext';

const SimpleDashboard: React.FC = () => {
  const { isConnected, isLoading, error, reportData, connect } = useSonarQube();

  const handleConnect = () => {
    const token = '5c43d3ab6fdd3bee3e0b85e38b79044420490c17';
    connect(token);
  };

  if (!isConnected) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
            Please connect to SonarQube Cloud to view the dashboard
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={handleConnect}
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            {isLoading ? 'Connecting...' : 'Connect to SonarQube Cloud'}
          </Button>
          
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Debug: isConnected={isConnected.toString()}, isLoading={isLoading.toString()}
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
              {error}
            </Alert>
          )}
          
                 <Box sx={{ mt: 2 }}>
                   <Typography variant="body2" color="text.secondary">
                     <a href="/test" target="_blank" rel="noopener noreferrer">
                       Test API Connection Directly
                     </a>
                     {' | '}
                     <a href="/debug" target="_blank" rel="noopener noreferrer">
                       Debug Projects
                     </a>
                     {' | '}
                     <a href="/api-debug" target="_blank" rel="noopener noreferrer">
                       API Debug Console
                     </a>
                     {' | '}
                     <a href="/simple-test" target="_blank" rel="noopener noreferrer">
                       Simple API Test
                     </a>
                   </Typography>
                 </Box>
        </Box>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading dashboard data...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!reportData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary">
            No data available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Debug: reportData is null
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => connect('5c43d3ab6fdd3bee3e0b85e38b79044420490c17')}
            sx={{ mt: 2 }}
          >
            Retry Connection
          </Button>
        </Box>
      </Container>
    );
  }

         const { overallMetrics, qualityGateStatus, projects } = reportData;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          SonarQube Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time insights into your code quality metrics and project health
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Code Coverage</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                {overallMetrics.coverage.toFixed(1)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={overallMetrics.coverage}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BugReport sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Bugs</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'error.main', mb: 1 }}>
                {overallMetrics.bugs}
              </Typography>
              <Chip
                label={overallMetrics.bugs === 0 ? 'No Issues' : 'Issues Found'}
                color={overallMetrics.bugs === 0 ? 'success' : 'error'}
                size="small"
              />
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Vulnerabilities</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'error.main', mb: 1 }}>
                {overallMetrics.vulnerabilities}
              </Typography>
              <Chip
                label={overallMetrics.vulnerabilities === 0 ? 'Secure' : 'Security Issues'}
                color={overallMetrics.vulnerabilities === 0 ? 'success' : 'error'}
                size="small"
              />
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Code sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Code Smells</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                {overallMetrics.codeSmells}
              </Typography>
              <Chip
                label={overallMetrics.codeSmells < 50 ? 'Clean' : 'Needs Refactoring'}
                color={overallMetrics.codeSmells < 50 ? 'success' : 'warning'}
                size="small"
              />
            </CardContent>
          </Card>
        </Box>
      </Stack>

      {/* Quality Gate Status */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quality Gate Status
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {qualityGateStatus.passed}/{qualityGateStatus.total}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Projects passing quality gates
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(qualityGateStatus.passed / qualityGateStatus.total) * 100}
            sx={{ height: 12, borderRadius: 6 }}
          />
        </CardContent>
      </Card>


      {/* Projects List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Projects Overview ({projects?.length || 0} projects)
          </Typography>
          {projects?.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No projects found. This could mean:
              <ul>
                <li>Projects haven't been analyzed yet</li>
                <li>Projects are in a different organization</li>
                <li>API permissions are insufficient</li>
              </ul>
            </Typography>
          ) : (
            <Stack spacing={2}>
              {projects?.map((project) => (
              <Card key={project.project.key} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {project.project.name}
                    </Typography>
                    <Chip
                      label={project.qualityGate.status}
                      color={project.qualityGate.status === 'OK' ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.project.key}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                        {project.metrics.coverage.toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Coverage
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                        {project.metrics.bugs}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Bugs
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                        {project.metrics.vulnerabilities}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Vulnerabilities
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                        {project.metrics.codeSmells}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Code Smells
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

    </Container>
  );
};

export default SimpleDashboard;
