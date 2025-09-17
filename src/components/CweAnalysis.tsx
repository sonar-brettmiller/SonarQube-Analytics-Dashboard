import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack
} from '@mui/material';
import {
  Security,
  BugReport,
  Warning,
  Info,
  ExpandMore,
  ExpandLess,
  Search,
  Download
} from '@mui/icons-material';
import { useSonarQube } from '../contexts/SonarQubeContext';
import type { CweAnalysisData } from '../types/sonarqube';

interface TabPanelProps {
  readonly children?: React.ReactNode;
  readonly index: number;
  readonly value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cwe-tabpanel-${index}`}
      aria-labelledby={`cwe-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CweAnalysis: React.FC = () => {
  const { apiService } = useSonarQube();
  const [cweData, setCweData] = useState<CweAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [cweFilter] = useState<string>('all');
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCweData();
  }, [apiService]);

  const loadCweData = async () => {
    if (!apiService) {
      setError('SonarQube API service not available. Please connect first.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getEnhancedCweAnalysisData();
      setCweData(data);
    } catch (err) {
      setError('Failed to load CWE analysis data');
      console.error('Error loading CWE data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleIssueExpansion = (issueKey: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueKey)) {
      newExpanded.delete(issueKey);
    } else {
      newExpanded.add(issueKey);
    }
    setExpandedIssues(newExpanded);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'blocker':
      case 'critical':
        return 'error';
      case 'major':
        return 'warning';
      case 'minor':
        return 'info';
      default:
        return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'blocker':
      case 'critical':
        return <BugReport />;
      case 'major':
        return <Warning />;
      case 'minor':
        return <Info />;
      default:
        return <Info />;
    }
  };

  const filteredIssues = cweData?.issues.filter(issue => {
    const matchesSearch = issue.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.rule.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || issue.severity === severityFilter;
    const matchesType = typeFilter === 'all' || issue.type === typeFilter;
    const matchesCwe = cweFilter === 'all' || issue.cweNumbers.some(cwe => cwe.includes(cweFilter));
    
    return matchesSearch && matchesSeverity && matchesType && matchesCwe;
  }) || [];

  const renderStatistics = () => {
    if (!cweData) return null;

    const blockerIssues = cweData.issues.filter(i => i.severity === 'BLOCKER').length;
    const vulnerabilities = cweData.issues.filter(i => i.type === 'VULNERABILITY').length;
    const securityHotspots = (cweData.cweStatistics as any).securityHotspots || 0;
    const securityRules = (cweData.cweStatistics as any).securityRules || 0;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Issues
              </Typography>
              <Typography variant="h4">
                {cweData.totalIssues}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Issues with CWE
              </Typography>
              <Typography variant="h4" color={cweData.issuesWithCwe > 0 ? "primary" : "textSecondary"}>
                {cweData.issuesWithCwe}
              </Typography>
              {cweData.issuesWithCwe === 0 && (
                <Typography variant="caption" color="textSecondary">
                  No CWE mappings found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Vulnerabilities
              </Typography>
              <Typography variant="h4" color="error">
                {vulnerabilities}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Blocker Issues
              </Typography>
              <Typography variant="h4" color="error">
                {blockerIssues}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Security Hotspots
              </Typography>
              <Typography variant="h4" color="warning.main">
                {securityHotspots}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Security Rules
              </Typography>
              <Typography variant="h4" color="info.main">
                {securityRules}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderTopCweCategories = () => {
    if (!cweData) return null;

    const alternativeData = (cweData.cweStatistics as any).alternativeCweData;
    const hasCweData = cweData.cweStatistics.topCweCategories.length > 0;
    const hasAlternativeData = alternativeData && (alternativeData.securityIssues > 0 || alternativeData.vulnerabilityIssues > 0);

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Security Analysis
          </Typography>
          {(() => {
            if (hasCweData) {
              return (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    CWE Categories
                  </Typography>
                  {cweData.cweStatistics.topCweCategories.map((category, index) => (
                    <Box key={category.cwe} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ minWidth: 80 }}>
                        {category.cwe}
                      </Typography>
                      <Box sx={{ flexGrow: 1, mx: 2 }}>
                        <Box
                          sx={{
                            height: 8,
                            backgroundColor: 'primary.main',
                            borderRadius: 1,
                            width: `${category.percentage}%`
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {category.count} ({category.percentage.toFixed(1)}%)
                      </Typography>
                    </Box>
                  ))}
                </Box>
              );
            }
            
            if (hasAlternativeData) {
              return (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Security Issues Found
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="primary">
                      Security-tagged Issues: {alternativeData.securityIssues}
                    </Typography>
                    <Typography variant="body2" color="error">
                      Vulnerabilities: {alternativeData.vulnerabilityIssues}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    CWE mappings not available, but security issues were found using alternative methods.
                  </Typography>
                </Box>
              );
            }
            
            return (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  No security issues or CWE mappings found. This could be due to:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>No security rules activated in quality profile</li>
                  <li>Rule details not available in SonarQube API</li>
                  <li>API permissions limitations</li>
                  <li>No security issues in current project</li>
                </ul>
              </Box>
            );
          })()}
        </CardContent>
      </Card>
    );
  };

  const renderIssuesTable = () => {
    return (
      <Card>
        <CardContent>
          <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ minWidth: 200 }}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Severity</InputLabel>
              <Select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                label="Severity"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="BLOCKER">Blocker</MenuItem>
                <MenuItem value="CRITICAL">Critical</MenuItem>
                <MenuItem value="MAJOR">Major</MenuItem>
                <MenuItem value="MINOR">Minor</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Type"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="BUG">Bug</MenuItem>
                <MenuItem value="VULNERABILITY">Vulnerability</MenuItem>
                <MenuItem value="CODE_SMELL">Code Smell</MenuItem>
                <MenuItem value="SECURITY_HOTSPOT">Security Hotspot</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => {
                // Export functionality placeholder
                const exportData = {
                  issues: filteredIssues,
                  statistics: cweData?.cweStatistics,
                  timestamp: new Date().toISOString()
                };
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `cwe-analysis-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              Export
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Issue</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>CWE</TableCell>
                  <TableCell>Component</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <React.Fragment key={issue.key}>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 300 }}>
                          {issue.message}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {issue.rule}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getSeverityIcon(issue.severity)}
                          label={issue.severity}
                          color={getSeverityColor(issue.severity) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={issue.type}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {issue.cweNumbers.map((cwe) => (
                            <Chip
                              key={cwe}
                              label={cwe}
                              color="primary"
                              size="small"
                              variant="outlined"
                            />
                          ))}
                          {issue.cweNumbers.length === 0 && (
                            <Typography variant="caption" color="textSecondary">
                              No CWE
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {issue.component.split(':').pop()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => toggleIssueExpansion(issue.key)}
                          size="small"
                        >
                          {expandedIssues.has(issue.key) ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} sx={{ py: 0 }}>
                        <Collapse in={expandedIssues.has(issue.key)} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 2, backgroundColor: 'grey.50' }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Rule Details
                            </Typography>
                            {issue.ruleDetails && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  <strong>Name:</strong> {issue.ruleDetails.name}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  <strong>Language:</strong> {issue.ruleDetails.langName}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  <strong>Tags:</strong> {issue.ruleDetails.tags.join(', ')}
                                </Typography>
                                {issue.ruleDetails.cweNumbers.length > 0 && (
                                  <Typography variant="body2">
                                    <strong>CWE Numbers:</strong> {issue.ruleDetails.cweNumbers.join(', ')}
                                  </Typography>
                                )}
                              </Box>
                            )}
                            <Typography variant="subtitle2" gutterBottom>
                              Issue Details
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Status:</strong> {issue.status}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Created:</strong> {new Date(issue.creationDate).toLocaleDateString()}
                            </Typography>
                            {issue.line && (
                              <Typography variant="body2">
                                <strong>Line:</strong> {issue.line}
                              </Typography>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={loadCweData}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!cweData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          No CWE analysis data available. Make sure you have issues in your SonarQube projects.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Security sx={{ mr: 2, fontSize: 32 }} color="primary" />
        <Typography variant="h4">
          CWE Analysis
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Analysis Dashboard" />
          <Tab label="Issues" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {renderStatistics()}
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {renderTopCweCategories()}
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Security Distribution
                  </Typography>
                  {(() => {
                    if (cweData.cweStatistics.topCweCategories.length > 0) {
                      return (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            CWE Categories
                          </Typography>
                          {cweData.cweStatistics.topCweCategories.map((category, index) => (
                            <Box key={category.cwe} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ minWidth: 80 }}>
                                {category.cwe}
                              </Typography>
                              <Box sx={{ flexGrow: 1, mx: 2 }}>
                                <Box
                                  sx={{
                                    height: 8,
                                    backgroundColor: 'primary.main',
                                    borderRadius: 1,
                                    width: `${category.percentage}%`
                                  }}
                                />
                              </Box>
                              <Typography variant="body2" color="textSecondary">
                                {category.count} ({category.percentage.toFixed(1)}%)
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      );
                    }
                    
                    if ((cweData.cweStatistics as any).alternativeCweData) {
                      return (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Security Issue Types
                          </Typography>
                          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ minWidth: 120 }}>
                              Security Issues
                            </Typography>
                            <Box sx={{ flexGrow: 1, mx: 2 }}>
                              <Box
                                sx={{
                                  height: 8,
                                  backgroundColor: 'primary.main',
                                  borderRadius: 1,
                                  width: '100%'
                                }}
                              />
                            </Box>
                            <Typography variant="body2" color="textSecondary">
                              {(cweData.cweStatistics as any).alternativeCweData.securityIssues}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ minWidth: 120 }}>
                              Vulnerabilities
                            </Typography>
                            <Box sx={{ flexGrow: 1, mx: 2 }}>
                              <Box
                                sx={{
                                  height: 8,
                                  backgroundColor: 'error.main',
                                  borderRadius: 1,
                                  width: '100%'
                                }}
                              />
                            </Box>
                            <Typography variant="body2" color="textSecondary">
                              {(cweData.cweStatistics as any).alternativeCweData.vulnerabilityIssues}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    }
                    
                    return (
                      <Typography variant="body2" color="textSecondary">
                        No security data available. This could be due to:
                        <ul>
                          <li>No security rules activated in quality profile</li>
                          <li>Rule details not available in SonarQube</li>
                          <li>API permissions limitations</li>
                        </ul>
                      </Typography>
                    );
                  })()}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Security Analysis Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          {cweData.totalIssues}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Total Issues
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="error">
                          {cweData.issues.filter(i => i.severity === 'BLOCKER').length}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Blocker Issues
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main">
                          {cweData.issues.filter(i => i.severity === 'MAJOR').length}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Major Issues
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="info.main">
                          {cweData.issues.filter(i => i.type === 'VULNERABILITY').length}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Vulnerabilities
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Security Rules & Hotspots
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main">
                          {(cweData.cweStatistics as any).securityHotspots || 0}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Security Hotspots
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Areas requiring security review
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="info.main">
                          {(cweData.cweStatistics as any).securityRules || 0}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Security Rules Available
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Rules tagged with security
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderIssuesTable()}
      </TabPanel>
    </Box>
  );
};

export default CweAnalysis;
