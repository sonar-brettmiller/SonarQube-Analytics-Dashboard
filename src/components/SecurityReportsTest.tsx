import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Security,
  ExpandMore,
  BugReport,
  Assessment,
  Refresh
} from '@mui/icons-material';
import { useSonarQube } from '../contexts/SonarQubeContext';

const SecurityReportsTest: React.FC = () => {
  const { apiService } = useSonarQube();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [securityReports, setSecurityReports] = useState<any>(null);
  const [portfolioReports, setPortfolioReports] = useState<any>(null);
  const [breakdownReports, setBreakdownReports] = useState<any>(null);

  const loadSecurityReports = async () => {
    if (!apiService) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [security, portfolio, breakdown] = await Promise.all([
        apiService.getSecurityReports(),
        apiService.getPortfolioSecurityReports(),
        apiService.getPortfolioSecurityReportsBreakdown()
      ]);
      
      setSecurityReports(security);
      setPortfolioReports(portfolio);
      setBreakdownReports(breakdown);
    } catch (err) {
      setError('Failed to load security reports');
      console.error('Error loading security reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityReports();
  }, [apiService]);

  const renderSecurityReports = () => {
    if (!securityReports) {
      return <Alert severity="info">No security reports data available</Alert>;
    }

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Security Reports
          </Typography>
          <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '400px' }}>
            {JSON.stringify(securityReports, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  };

  const renderPortfolioReports = () => {
    if (!portfolioReports) {
      return <Alert severity="info">No portfolio reports data available</Alert>;
    }

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Portfolio Security Reports
          </Typography>
          <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '400px' }}>
            {JSON.stringify(portfolioReports, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  };

  const renderBreakdownReports = () => {
    if (!breakdownReports) {
      return <Alert severity="info">No breakdown reports data available</Alert>;
    }

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Portfolio Security Reports Breakdown
          </Typography>
          <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '400px' }}>
            {JSON.stringify(breakdownReports, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Security color="primary" />
        <Typography variant="h4">
          Security Reports API Test
        </Typography>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={loadSecurityReports}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" gap={1}>
                <Security color="primary" />
                <Typography variant="h6">Security Reports</Typography>
                <Chip 
                  label={securityReports ? 'Available' : 'Not Available'} 
                  color={securityReports ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {renderSecurityReports()}
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" gap={1}>
                <Assessment color="primary" />
                <Typography variant="h6">Portfolio Security Reports</Typography>
                <Chip 
                  label={portfolioReports ? 'Available' : 'Not Available'} 
                  color={portfolioReports ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {renderPortfolioReports()}
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" gap={1}>
                <BugReport color="primary" />
                <Typography variant="h6">Portfolio Security Reports Breakdown</Typography>
                <Chip 
                  label={breakdownReports ? 'Available' : 'Not Available'} 
                  color={breakdownReports ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {renderBreakdownReports()}
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SecurityReportsTest;
