import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  List,
  ListItem,
  Chip,
} from '@mui/material';
import SonarQubeApiService from '../services/sonarqubeApi';

const ProjectDebug: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = '5c43d3ab6fdd3bee3e0b85e38b79044420490c17';
      const apiService = new SonarQubeApiService(token);
      
      console.log('Testing projects API...');
      const projectsResponse = await apiService.getProjects(10);
      console.log('Projects response:', projectsResponse);
      
      setProjects(projectsResponse.components || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const testProjectMetrics = async (projectKey: string) => {
    try {
      const token = '5c43d3ab6fdd3bee3e0b85e38b79044420490c17';
      const apiService = new SonarQubeApiService(token);
      
      console.log(`Testing metrics for project: ${projectKey}`);
      const metrics = await apiService.getDashboardMetrics(projectKey);
      console.log(`Metrics for ${projectKey}:`, metrics);
      
      if (metrics) {
        alert(`Metrics loaded for ${projectKey}: ${JSON.stringify(metrics, null, 2)}`);
      } else {
        alert(`No metrics available for ${projectKey}`);
      }
    } catch (err) {
      console.error(`Error fetching metrics for ${projectKey}:`, err);
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    testProjects();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Project Debug Tool
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={testProjects}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          {loading ? <CircularProgress size={20} /> : 'Refresh Projects'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Projects Found ({projects.length})
          </Typography>
          
          {projects.length === 0 ? (
            <Box>
              <Typography color="text.secondary" gutterBottom>
                No projects found. This could mean:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" variant="body2" color="text.secondary">
                  No projects in the organization
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  API token doesn't have access
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Organization key is incorrect
                </Typography>
              </Box>
            </Box>
          ) : (
            <List>
              {projects.map((project) => (
                <ListItem key={project.key} divider>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Key: {project.key}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Last Analysis: {project.lastAnalysisDate || 'Never'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Qualifier: {project.qualifier || 'Unknown'}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label="Test Metrics"
                        size="small"
                        onClick={() => testProjectMetrics(project.key)}
                        sx={{ mr: 1, cursor: 'pointer' }}
                      />
                      <Chip
                        label={project.lastAnalysisDate ? 'Analyzed' : 'Not Analyzed'}
                        color={project.lastAnalysisDate ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProjectDebug;
