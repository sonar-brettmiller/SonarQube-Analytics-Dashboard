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
  Alert,
} from '@mui/material';
import {
  BugReport,
  Security,
  Code,
  Assessment,
} from '@mui/icons-material';
import { useSonarQube } from '../contexts/SonarQubeContext';

const Dashboard: React.FC = () => {
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          SonarQube Analytics Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Real-time insights into your code quality metrics and project health
        </Typography>
      </Box>

      {/* Enhanced Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Coverage Card */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
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
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BugReport sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Bugs</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'error.main', mb: 1 }}>
                {overallMetrics.bugs}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
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
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Vulnerabilities</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'error.main', mb: 1 }}>
                {overallMetrics.vulnerabilities}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
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
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Code sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Code Smells</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                {overallMetrics.codeSmells}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
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
      <Card sx={{ mb: 5, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Assessment sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Quality Gate Status
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h2" component="div" sx={{ fontWeight: 700, color: 'white' }}>
              {qualityGateStatus.passed}/{qualityGateStatus.total}
            </Typography>
            <Typography variant="h6" color="rgba(255,255,255,0.8)">
              Projects passing quality gates
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(qualityGateStatus.passed / qualityGateStatus.total) * 100}
            sx={{ 
              height: 16, 
              borderRadius: 8, 
              mb: 3,
              backgroundColor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: qualityGateStatus.passed === qualityGateStatus.total ? '#4caf50' : '#ff9800',
                borderRadius: 8,
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="rgba(255,255,255,0.9)">
              Success Rate: {((qualityGateStatus.passed / qualityGateStatus.total) * 100).toFixed(1)}%
            </Typography>
            <Chip
              label={qualityGateStatus.passed === qualityGateStatus.total ? 'All Good' : 'Needs Attention'}
              sx={{
                backgroundColor: qualityGateStatus.passed === qualityGateStatus.total ? '#4caf50' : '#ff9800',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}
              size="medium"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Projects Overview */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Code sx={{ mr: 2, fontSize: 28, color: 'primary.main' }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Projects Overview
            </Typography>
            <Chip 
              label={`${projects?.length || 0} projects`} 
              color="primary" 
              size="small" 
              sx={{ ml: 2, fontWeight: 600 }}
            />
          </Box>
          {projects?.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No projects found. This could mean projects haven't been analyzed yet or there are permission issues.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {projects?.map((project) => (
                <Grid key={project.project.key} size={{ xs: 12, md: 6 }}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {project.project.name}
                        </Typography>
                        <Chip
                          label={project.qualityGate.status}
                          color={project.qualityGate.status === 'OK' ? 'success' : 'error'}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontFamily: 'monospace' }}>
                        {project.project.key}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'primary.light', borderRadius: 2, mb: 1 }}>
                            <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                              {project.metrics.coverage.toFixed(1)}%
                            </Typography>
                            <Typography variant="caption" color="primary.dark" sx={{ fontWeight: 600 }}>
                              Coverage
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'error.light', borderRadius: 2, mb: 1 }}>
                            <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: 'error.dark' }}>
                              {project.metrics.bugs}
                            </Typography>
                            <Typography variant="caption" color="error.dark" sx={{ fontWeight: 600 }}>
                              Bugs
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'error.light', borderRadius: 2, mb: 1 }}>
                            <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: 'error.dark' }}>
                              {project.metrics.vulnerabilities}
                            </Typography>
                            <Typography variant="caption" color="error.dark" sx={{ fontWeight: 600 }}>
                              Vulnerabilities
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'warning.light', borderRadius: 2, mb: 1 }}>
                            <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                              {project.metrics.codeSmells}
                            </Typography>
                            <Typography variant="caption" color="warning.dark" sx={{ fontWeight: 600 }}>
                              Code Smells
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;
