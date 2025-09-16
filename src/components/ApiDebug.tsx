import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Stack,
  Divider,
} from '@mui/material';
import SonarQubeApiService from '../services/sonarqubeApi';

const ApiDebug: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [token, setToken] = useState('5c43d3ab6fdd3bee3e0b85e38b79044420490c17');

  const testApiCall = async (callName: string, apiCall: () => Promise<any>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Testing ${callName}...`);
      const result = await apiCall();
      console.log(`${callName} result:`, result);
      setResults(prev => ({ ...prev, [callName]: result }));
    } catch (err) {
      console.error(`${callName} error:`, err);
      setError(`${callName} failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testProjects = () => {
    const service = new SonarQubeApiService(token);
    testApiCall('getProjects', () => service.getProjects(5));
  };

  const testProjectDetails = () => {
    const service = new SonarQubeApiService(token);
    testApiCall('getProject', () => service.getProject('sonar-brettmiller_sonarqube-analytics'));
  };

  const testIssues = () => {
    const service = new SonarQubeApiService(token);
    testApiCall('getIssues', () => service.getIssues(undefined, 10));
  };

  const testQualityGate = () => {
    const service = new SonarQubeApiService(token);
    testApiCall('getQualityGateStatus', () => service.getQualityGateStatus('sonar-brettmiller_sonarqube-analytics'));
  };

  const testReportData = () => {
    const service = new SonarQubeApiService(token);
    testApiCall('getReportData', () => service.getReportData());
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        API Debug Console
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Token Configuration
          </Typography>
          <TextField
            fullWidth
            label="SonarQube Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            API Test Calls
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Button
              variant="contained"
              onClick={testProjects}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : null}
            >
              Test Projects
            </Button>
            <Button
              variant="contained"
              onClick={testProjectDetails}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : null}
            >
              Test Project Details
            </Button>
            <Button
              variant="contained"
              onClick={testIssues}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : null}
            >
              Test Issues
            </Button>
            <Button
              variant="contained"
              onClick={testQualityGate}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : null}
            >
              Test Quality Gate
            </Button>
            <Button
              variant="contained"
              onClick={testReportData}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : null}
            >
              Test Report Data
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              API Results
            </Typography>
            {Object.entries(results).map(([key, value]) => (
              <Box key={key} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {key}
                </Typography>
                <Box
                  sx={{
                    backgroundColor: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    overflow: 'auto',
                    maxHeight: 300,
                  }}
                >
                  <pre>{JSON.stringify(value, null, 2)}</pre>
                </Box>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ApiDebug;
