import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  Chip,
  LinearProgress,
  Stack,
  Alert,
} from '@mui/material';
import {
  BugReport,
  Security,
  Code,
  Assessment,
} from '@mui/icons-material';
import { useSonarQube } from '../contexts/SonarQubeContext';

const EnhancedDashboard: React.FC = () => {
  const { isConnected, isLoading, error, reportData } = useSonarQube();

  if (!isConnected) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">
          Please connect to SonarQube Cloud to view the enhanced dashboard.
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">Loading enhanced dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!reportData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">No data available for enhanced dashboard.</Alert>
      </Container>
    );
  }

  const { overallMetrics, qualityGateStatus, projects } = reportData;


  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Enhanced SonarQube Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Advanced insights and detailed metrics for your code quality
        </Typography>
      </Box>

      {/* Enhanced Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Coverage Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
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
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Target: 80%
                </Typography>
                <Chip
                  label={overallMetrics.coverage >= 80 ? 'Good' : 'Needs Improvement'}
                  color={overallMetrics.coverage >= 80 ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Bugs Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BugReport sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Bugs</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'error.main', mb: 1 }}>
                {overallMetrics.bugs}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Critical Issues
                </Typography>
                <Chip
                  label={overallMetrics.bugs === 0 ? 'None' : 'Action Required'}
                  color={overallMetrics.bugs === 0 ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Vulnerabilities Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Vulnerabilities</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'error.main', mb: 1 }}>
                {overallMetrics.vulnerabilities}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Security Issues
                </Typography>
                <Chip
                  label={overallMetrics.vulnerabilities === 0 ? 'Secure' : 'High Priority'}
                  color={overallMetrics.vulnerabilities === 0 ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Code Smells Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Code sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Code Smells</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                {overallMetrics.codeSmells}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Maintainability
                </Typography>
                <Chip
                  label={overallMetrics.codeSmells < 50 ? 'Clean' : 'Refactor Needed'}
                  color={overallMetrics.codeSmells < 50 ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
            sx={{ height: 12, borderRadius: 6, mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Success Rate: {((qualityGateStatus.passed / qualityGateStatus.total) * 100).toFixed(1)}%
            </Typography>
            <Chip
              label={qualityGateStatus.passed === qualityGateStatus.total ? 'All Good' : 'Needs Attention'}
              color={qualityGateStatus.passed === qualityGateStatus.total ? 'success' : 'warning'}
              size="small"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Projects Overview */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Projects Overview ({projects?.length || 0} projects)
          </Typography>
          {projects?.length === 0 ? (
            <Alert severity="info">
              No projects found. This could mean projects haven't been analyzed yet or there are permission issues.
            </Alert>
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
                      Key: {project.project.key}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                            {project.metrics.coverage.toFixed(1)}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Coverage
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                            {project.metrics.bugs}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Bugs
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                            {project.metrics.vulnerabilities}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Vulnerabilities
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                            {project.metrics.codeSmells}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Code Smells
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
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

export default EnhancedDashboard;
