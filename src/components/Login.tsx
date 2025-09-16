import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from '@mui/material';
import { useSonarQube } from '../contexts/SonarQubeContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [token, setToken] = useState('');
  const { connect, isLoading, error, isConnected } = useSonarQube();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isConnected) {
      navigate('/');
    }
  }, [isConnected, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      await connect(token.trim());
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            SonarQube Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Connect to your SonarQube Cloud organization to get started
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="SonarQube Cloud API Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your SonarQube Cloud API token"
                margin="normal"
                variant="outlined"
                required
                disabled={isLoading}
                helperText="You can generate an API token in your SonarQube Cloud user account settings"
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading || !token.trim()}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Connect to SonarQube Cloud'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            How to get your API token:
          </Typography>
          <ol>
            <li>Log in to your SonarQube Cloud account</li>
            <li>Go to your account settings</li>
            <li>Navigate to the "Security" tab</li>
            <li>Generate a new token with appropriate permissions</li>
            <li>Copy the token and paste it above</li>
          </ol>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
