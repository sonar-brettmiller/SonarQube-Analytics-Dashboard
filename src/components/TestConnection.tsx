import React, { useState } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';

const TestConnection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testConnection = async () => {
    setIsLoading(true);
    setResult('Testing connection...');
    
    try {
      const token = '5c43d3ab6fdd3bee3e0b85e38b79044420490c17';
      const response = await fetch('/api/projects/search?ps=1&organization=sonar-brettmiller', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(`✅ Connection successful! Found ${data.paging.total} projects.`);
        console.log('API Response:', data);
      } else {
        const errorText = await response.text();
        setResult(`❌ Connection failed: ${response.status} - ${errorText}`);
        console.error('API Error:', errorText);
      }
    } catch (error) {
      setResult(`❌ Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Test SonarQube Cloud Connection
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={testConnection}
        disabled={isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading ? <CircularProgress size={20} /> : 'Test Connection'}
      </Button>
      
      {result && (
        <Alert severity={result.includes('✅') ? 'success' : 'error'} sx={{ mt: 2 }}>
          {result}
        </Alert>
      )}
    </Box>
  );
};

export default TestConnection;
