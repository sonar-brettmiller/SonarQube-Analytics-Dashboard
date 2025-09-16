import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';

import {
  CheckCircle,
  Warning,
  Error,
  Security,
  BugReport,
} from '@mui/icons-material';
import type { ProjectSummary } from '../types/sonarqube';

interface ProjectListProps {
  projects: ProjectSummary[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const getQualityGateIcon = (status: string) => {
    switch (status) {
      case 'OK':
        return <CheckCircle color="success" />;
      case 'WARN':
        return <Warning color="warning" />;
      case 'ERROR':
        return <Error color="error" />;
      default:
        return <Warning color="disabled" />;
    }
  };

  const getQualityGateColor = (status: string) => {
    switch (status) {
      case 'OK':
        return 'success';
      case 'WARN':
        return 'warning';
      case 'ERROR':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return '#4caf50';
    if (coverage >= 60) return '#ff9800';
    return '#f44336';
  };


  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Projects Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {projects.length} projects
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={project.project.key}>
              <Card
                sx={{
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease-in-out',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 500, flex: 1 }}>
                      {project.project.name}
                    </Typography>
                    <Tooltip title={`Quality Gate: ${project.qualityGate.status}`}>
                      <IconButton size="small">
                        {getQualityGateIcon(project.qualityGate.status)}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {project.project.key}
                  </Typography>

                  {/* Coverage */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Code Coverage
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {project.metrics.coverage.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={project.metrics.coverage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getCoverageColor(project.metrics.coverage),
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>

                  {/* Metrics Grid */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Box sx={{ flex: 1, textAlign: 'center', p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                        <BugReport sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {project.metrics.bugs}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Bugs
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, textAlign: 'center', p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                        <Security sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {project.metrics.vulnerabilities}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Vulnerabilities
                      </Typography>
                    </Box>
                  </Box>

                  {/* Quality Gate Status */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip
                      label={`Quality Gate: ${project.qualityGate.status}`}
                      color={getQualityGateColor(project.qualityGate.status) as any}
                      size="small"
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(project.lastAnalysis).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {projects.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No projects found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connect to SonarQube Cloud to view your projects
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectList;
