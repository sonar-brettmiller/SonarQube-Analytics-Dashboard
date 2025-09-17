import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search,
  ExpandMore,
  OpenInNew,
  Security,
  Warning,
  Error,
  Info,
  Link as LinkIcon,
  Refresh
} from '@mui/icons-material';
import cweCveService, { type CweData, type CweCveMapping } from '../services/cweCveService';


const CweCveBrowser: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cweData, setCweData] = useState<CweData[]>([]);
  const [filteredCweData, setFilteredCweData] = useState<CweData[]>([]);
  const [selectedCwe, setSelectedCwe] = useState<CweCveMapping | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCweData();
  }, []);

  useEffect(() => {
    filterCweData();
  }, [searchQuery, cweData]);

  const loadCweData = () => {
    try {
      const data = cweCveService.getAllCweData();
      setCweData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load CWE data');
      console.error('Error loading CWE data:', err);
    }
  };

  const filterCweData = () => {
    if (!searchQuery.trim()) {
      setFilteredCweData(cweData);
      return;
    }

    const filtered = cweCveService.searchCweData(searchQuery);
    setFilteredCweData(filtered);
  };

  const handleCweSelect = async (cweId: string) => {
    setLoading(true);
    try {
      const mapping = await cweCveService.getCweCveMapping(cweId);
      setSelectedCwe(mapping);
      setError(null);
    } catch (err) {
      setError(`Failed to load details for ${cweId}`);
      console.error('Error loading CWE details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return <Error color="error" />;
      case 'high': return <Error color="error" />;
      case 'medium': return <Warning color="warning" />;
      case 'low': return <Info color="info" />;
      default: return <Security />;
    }
  };

  const renderCweList = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          placeholder="Search CWE by ID, name, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          CWE Database ({filteredCweData.length} entries)
        </Typography>
        
        <List>
          {filteredCweData.map((cwe) => (
            <Card key={cwe.id} sx={{ mb: 1 }}>
              <ListItem
                onClick={() => handleCweSelect(cwe.id)}
                sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">{cwe.id}</Typography>
                      <Typography variant="body1">{cwe.name}</Typography>
                      {cwe.severity && (
                        <Chip
                          icon={getSeverityIcon(cwe.severity)}
                          label={cwe.severity}
                          color={getSeverityColor(cwe.severity) as any}
                          size="small"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        {cwe.description}
                      </Typography>
                      {cwe.category && (
                        <Chip label={cwe.category} size="small" variant="outlined" />
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(cwe.url, '_blank');
                    }}
                  >
                    <OpenInNew />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Card>
          ))}
        </List>
      </Grid>
    </Grid>
  );

  const renderCweDetails = () => {
    if (!selectedCwe) {
      return (
        <Alert severity="info">
          Select a CWE from the list to view detailed information including related CVEs.
        </Alert>
      );
    }

    if (loading) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {/* CWE Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="h4">{selectedCwe.cweData.id}</Typography>
                <Typography variant="h5">{selectedCwe.cweData.name}</Typography>
                {selectedCwe.cweData.severity && (
                  <Chip
                    icon={getSeverityIcon(selectedCwe.cweData.severity)}
                    label={selectedCwe.cweData.severity}
                    color={getSeverityColor(selectedCwe.cweData.severity) as any}
                    size="medium"
                  />
                )}
              </Box>
              
              <Typography variant="body1" paragraph>
                {selectedCwe.cweData.description}
              </Typography>
              
              <Box display="flex" gap={2} flexWrap="wrap">
                {selectedCwe.cweData.category && (
                  <Chip label={`Category: ${selectedCwe.cweData.category}`} />
                )}
                <Chip
                  icon={<LinkIcon />}
                  label="View on MITRE"
                  clickable
                  onClick={() => window.open(selectedCwe.cweData.url, '_blank')}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Related CVEs */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Related CVEs ({selectedCwe.cveData.length})
              </Typography>
              
              {selectedCwe.cveData.length > 0 ? (
                <List>
                  {selectedCwe.cveData.map((cve) => (
                    <Accordion key={cve.id}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box display="flex" alignItems="center" gap={2} width="100%">
                          <Typography variant="h6">{cve.id}</Typography>
                          <Chip
                            label={cve.severity}
                            color={getSeverityColor(cve.severity) as any}
                            size="small"
                          />
                          <Typography variant="body2" color="textSecondary">
                            Published: {new Date(cve.publishedDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box>
                          <Typography variant="body2" paragraph>
                            {cve.description}
                          </Typography>
                          <Box display="flex" gap={1} flexWrap="wrap">
                            <Chip
                              icon={<OpenInNew />}
                              label="View on NVD"
                              clickable
                              onClick={() => window.open(cve.url, '_blank')}
                            />
                            <Typography variant="caption" color="textSecondary">
                              Last Modified: {new Date(cve.lastModifiedDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  No related CVEs found for this CWE.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* SonarQube Issues */}
        {selectedCwe.sonarQubeIssues.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Related SonarQube Issues ({selectedCwe.sonarQubeIssues.length})
                </Typography>
                <List>
                  {selectedCwe.sonarQubeIssues.map((issueKey, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`Issue: ${issueKey}`}
                        secondary="Click to view in SonarQube"
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => {
                            // This would need to be passed from parent component
                            // or retrieved from context
                            const projectKey = 'sonar-brettmiller_demo-java-security';
                            const link = cweCveService.generateSonarQubeIssueLink(projectKey, issueKey);
                            window.open(link, '_blank');
                          }}
                        >
                          <OpenInNew />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    );
  };

  const renderStatistics = () => {
    const stats = cweCveService.getCweStatistics();
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total CWE Entries
              </Typography>
              <Typography variant="h2" color="primary">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                By Category
              </Typography>
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <Box key={category} display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">{category}</Typography>
                  <Chip label={count} size="small" />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                By Severity
              </Typography>
              {Object.entries(stats.bySeverity).map(([severity, count]) => (
                <Box key={severity} display="flex" justifyContent="space-between" mb={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getSeverityIcon(severity)}
                    <Typography variant="body2">{severity}</Typography>
                  </Box>
                  <Chip 
                    label={count} 
                    size="small" 
                    color={getSeverityColor(severity) as any}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Security color="primary" />
        <Typography variant="h4">
          CWE/CVE Browser
        </Typography>
        <IconButton onClick={loadCweData}>
          <Refresh />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={5} lg={4}>
          {renderCweList()}
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          {renderCweDetails()}
          <Divider sx={{ my: 3 }} />
          {renderStatistics()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CweCveBrowser;
