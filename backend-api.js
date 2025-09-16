import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// SonarQube Cloud API base URL
const SONARQUBE_API_BASE = 'https://sonarcloud.io/api';

// Proxy all SonarQube API requests
app.use('/api', async (req, res) => {
  try {
    console.log(`Proxying ${req.method} ${req.path} to SonarQube Cloud`);
    
    const url = `${SONARQUBE_API_BASE}${req.path}`;
    const config = {
      method: req.method,
      url: url,
      params: req.query,
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json',
      },
      data: req.body
    };

    console.log('Full URL:', url);
    console.log('Headers:', config.headers);
    
    const response = await axios(config);
    
    console.log('Response status:', response.status);
    console.log('Response data type:', typeof response.data);
    
    res.json(response.data);
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API server running on http://localhost:${PORT}`);
  console.log('Proxying SonarQube Cloud API requests...');
});
