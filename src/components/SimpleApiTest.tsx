import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';

const SimpleApiTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  const testApi = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Testing API directly...');
      
      // Test 1: Projects API
      const projectsResponse = await fetch('/api/projects/search?organization=sonar-brettmiller&ps=5', {
        headers: {
          'Authorization': 'Bearer 5c43d3ab6fdd3bee3e0b85e38b79044420490c17',
          'Content-Type': 'application/json',
        },
      });
      
      if (!projectsResponse.ok) {
        throw new Error(`Projects API failed: ${projectsResponse.status} ${projectsResponse.statusText}`);
      }
      
      const projectsData = await projectsResponse.json();
      console.log('Projects API result:', projectsData);
      
      // Test 2: Measures API for first project
      if (projectsData.components && projectsData.components.length > 0) {
        const firstProject = projectsData.components[0];
        console.log('Testing measures for project:', firstProject.key);
        
        const measuresResponse = await fetch(`/api/measures/component?component=${firstProject.key}&metricKeys=coverage,bugs,vulnerabilities,code_smells,security_hotspots`, {
          headers: {
            'Authorization': 'Bearer 5c43d3ab6fdd3bee3e0b85e38b79044420490c17',
            'Content-Type': 'application/json',
          },
        });
        
        if (!measuresResponse.ok) {
          throw new Error(`Measures API failed: ${measuresResponse.status} ${measuresResponse.statusText}`);
        }
        
        const measuresData = await measuresResponse.json();
        console.log('Measures API result:', measuresData);
        
        setResults({
          projects: projectsData,
          measures: measuresData,
          projectKey: firstProject.key,
          projectName: firstProject.name
        });
      }
      
    } catch (err) {
      console.error('API test failed:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Simple API Test
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Direct API Test
          </Typography>
          <Button
            variant="contained"
            onClick={testApi}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} /> : null}
          >
            {isLoading ? 'Testing...' : 'Test API'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Projects API Result
              </Typography>
              <Typography variant="body2">
                Found {results.projects.components?.length || 0} projects
              </Typography>
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                <pre>{JSON.stringify(results.projects, null, 2)}</pre>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Measures API Result for {results.projectName}
              </Typography>
              <Typography variant="body2">
                Project Key: {results.projectKey}
              </Typography>
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                <pre>{JSON.stringify(results.measures, null, 2)}</pre>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      )}
    </Box>
  );
};

export default SimpleApiTest;
