import React, { useState, useEffect, useMemo } from 'react';
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
  TablePagination,
  IconButton,
  Collapse,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  
  Tooltip,
  
} from '@mui/material';
import {
  Security,
  BugReport,
  Warning,
  Info,
  ExpandMore,
  ExpandLess,
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Shield,
  Assessment,
  KeyboardArrowUp,
  KeyboardArrowDown,
  OpenInNew
} from '@mui/icons-material';
import { useSonarQube } from '../contexts/SonarQubeContext';
import { useNavigate } from 'react-router-dom';
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const EnhancedCweAnalysis: React.FC = () => {
  const { apiService } = useSonarQube();
  const navigate = useNavigate();
  const [cweData, setCweData] = useState<CweAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [hotspotCategories, setHotspotCategories] = useState<any>(null);
  const [projectFilter, setProjectFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Derived issues based on filters
  const filteredIssues = useMemo(() => {
    if (!cweData) return [] as any[];
    return cweData.issues.filter(issue => {
      const matchesSearch = issue.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.rule.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === 'all' || issue.severity === severityFilter;
      const matchesType = typeFilter === 'all' || issue.type === typeFilter;
      const matchesProject = projectFilter === 'all' || issue.project === projectFilter;
      return matchesSearch && matchesSeverity && matchesType && matchesProject;
    });
  }, [cweData, searchTerm, severityFilter, typeFilter, projectFilter]);

  const paginatedIssues = useMemo(() => {
    return filteredIssues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredIssues, page, rowsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [searchTerm, severityFilter, typeFilter, projectFilter]);

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

      const [basicData, categories] = await Promise.all([
        apiService.getEnhancedCweAnalysisData(),
        apiService.getSecurityHotspotsByCategory()
      ]);

      setCweData(basicData);
      setHotspotCategories(categories);
    } catch (err) {
      console.error('Error loading CWE data:', err);
      setError('Failed to load CWE analysis data');
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'BLOCKER':
        return <KeyboardArrowUp color="error" />;
      case 'CRITICAL':
        return <KeyboardArrowUp color="error" />;
      case 'MAJOR':
        return <KeyboardArrowDown color="warning" />;
      case 'MINOR':
        return <KeyboardArrowDown color="info" />;
      case 'INFO':
        return <Info color="info" />;
      default:
        return <Info />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'BLOCKER':
      case 'CRITICAL':
        return 'error';
      case 'MAJOR':
        return 'warning';
      case 'MINOR':
        return 'info';
      case 'INFO':
        return 'default';
      default:
        return 'default';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp color="error" />;
      case 'decreasing':
        return <TrendingDown color="success" />;
      default:
        return <TrendingFlat color="info" />;
    }
  };

  const getSecurityRatingColor = (rating: string) => {
    switch (rating) {
      case 'A':
        return 'success';
      case 'B':
        return 'info';
      case 'C':
        return 'warning';
      case 'D':
      case 'E':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderSecurityOverview = () => {
    if (!cweData) return null;

    const projectMetrics = cweData.cweStatistics?.projectMetrics;
    const severityBreakdown = cweData.cweStatistics?.severityBreakdown || {};

    return (
      <Grid container spacing={3}>
        {/* Primary Security Metrics */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Security color="primary" />
                <Typography variant="h6">Security Rating</Typography>
                <Tooltip title="Overall security assessment based on vulnerabilities and security hotspots. A = Best (0 vulnerabilities), E = Worst (many vulnerabilities).">
                  <Info color="action" sx={{ fontSize: 16 }} />
                </Tooltip>
              </Stack>
              <Typography 
                variant="h2" 
                color={`${getSecurityRatingColor(projectMetrics?.security_rating?.value || 'N/A')}.main`}
                fontWeight="bold"
              >
                {projectMetrics?.security_rating?.value || 'N/A'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Overall Security Assessment
              </Typography>
              <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                Source: SonarQube Measures API
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <BugReport color="error" />
                <Typography variant="h6">Vulnerabilities</Typography>
                <Tooltip title="Security vulnerabilities that could be exploited by attackers. These require immediate attention and should be fixed as soon as possible.">
                  <Info color="action" sx={{ fontSize: 16 }} />
                </Tooltip>
              </Stack>
              <Typography variant="h2" color="error" fontWeight="bold">
                {cweData.cweStatistics?.vulnerabilityCount || 0}
              </Typography>
              {projectMetrics?.new_vulnerabilities && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  {getTrendIcon(projectMetrics.new_vulnerabilities.value > 0 ? 'increasing' : 'stable')}
                  <Typography variant="body2" color="textSecondary">
                    +{projectMetrics.new_vulnerabilities.value} new
                  </Typography>
                </Stack>
              )}
              <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                Source: SonarQube Issues API
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Warning color="warning" />
                <Typography variant="h6">Security Hotspots</Typography>
                <Tooltip title="Security-sensitive code that needs to be reviewed. These may or may not be vulnerabilities and require manual review to determine if they pose actual security risks.">
                  <Info color="action" sx={{ fontSize: 16 }} />
                </Tooltip>
              </Stack>
              <Typography variant="h2" color="warning.main" fontWeight="bold">
                {cweData.cweStatistics?.securityHotspots || 0}
              </Typography>
              {projectMetrics?.new_security_hotspots && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  {getTrendIcon(projectMetrics.new_security_hotspots.value > 0 ? 'increasing' : 'stable')}
                  <Typography variant="body2" color="textSecondary">
                    +{projectMetrics.new_security_hotspots.value} new
                  </Typography>
                </Stack>
              )}
              <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                Source: SonarQube Measures API
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Shield color="info" />
                <Typography variant="h6">Security Rules</Typography>
                <Tooltip title="Estimated count of security-related rules based on vulnerability issues found. Direct rule API access is limited, so this is calculated from available issue data.">
                  <Info color="action" sx={{ fontSize: 16 }} />
                </Tooltip>
              </Stack>
              <Typography variant="h2" color="info.main" fontWeight="bold">
                {cweData.cweStatistics?.securityRules || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Active Security Rules
              </Typography>
              <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                Source: Estimated from Issues API
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Issue Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Issue Severity Breakdown
              </Typography>
              <Stack spacing={2}>
                {Object.entries(severityBreakdown).map(([severity, count]) => (
                  <Box key={severity}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {getSeverityIcon(severity)}
                        <Typography variant="body1" fontWeight="medium">
                          {severity}
                        </Typography>
                      </Stack>
                      <Typography variant="h6" color={`${getSeverityColor(severity)}.main`}>
                        {count as number}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={(count as number) / (cweData.totalIssues || 1) * 100}
                      color={getSeverityColor(severity) as any}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Hotspots by Category */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Hotspots by Category
              </Typography>
              {hotspotCategories ? (
                <Stack spacing={2}>
                  {Object.entries(hotspotCategories.categories || {}).map(([category, count]) => (
                    <Box key={category}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body1" fontWeight="medium">
                          {category}
                        </Typography>
                        <Typography variant="h6" color="warning.main">
                          {count as number}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={(count as number) / (hotspotCategories.total || 1) * 100}
                        color="warning"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  ))}
                  {hotspotCategories.estimatedFromVulnerabilities && (
                    <Typography variant="caption" color="textSecondary">
                      * Estimated from vulnerability patterns
                    </Typography>
                  )}
                </Stack>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No hotspot category data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderCweAnalysis = () => {
    if (!cweData) return null;

    const cweMappings = cweData.cweStatistics?.cweMappings;

    return (
      <Grid container spacing={3}>
        {/* CWE Overview Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Shield color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  CWE Coverage
                </Typography>
                <Tooltip title="Percentage of issues that have been mapped to CWE (Common Weakness Enumeration) numbers">
                  <Info color="action" sx={{ ml: 1, fontSize: 16 }} />
                </Tooltip>
              </Box>
              <Typography variant="h2" color="primary" fontWeight="bold">
                {cweMappings?.cweCoveragePercentage || 0}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {cweMappings?.issuesWithCwe || 0} of {cweMappings?.totalIssues || 0} issues mapped
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <BugReport color="error" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  CWE Categories
                </Typography>
                <Tooltip title="Number of unique CWE categories found in your security issues">
                  <Info color="action" sx={{ ml: 1, fontSize: 16 }} />
                </Tooltip>
              </Box>
              <Typography variant="h2" color="error" fontWeight="bold">
                {Object.keys(cweMappings?.cweCategories || {}).length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Unique CWE types
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Security color="warning" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  High Confidence
                </Typography>
                <Tooltip title="Issues with high-confidence CWE mappings based on known SonarQube rule patterns">
                  <Info color="action" sx={{ ml: 1, fontSize: 16 }} />
                </Tooltip>
              </Box>
              <Typography variant="h2" color="warning.main" fontWeight="bold">
                {Object.values(cweMappings?.confidenceLevels || {}).filter((level: any) => level === 'high').length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                High confidence mappings
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Assessment color="info" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Rule Mappings
                </Typography>
                <Tooltip title="Total number of SonarQube rules that have been mapped to CWE numbers">
                  <Info color="action" sx={{ ml: 1, fontSize: 16 }} />
                </Tooltip>
              </Box>
              <Typography variant="h2" color="info.main" fontWeight="bold">
                {Object.keys(cweMappings?.ruleToCweMappings || {}).length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Rules mapped to CWE
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* CWE Categories Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                CWE Categories Distribution
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Breakdown of security issues by CWE category
              </Typography>
              
              {Object.keys(cweMappings?.cweCategories || {}).length > 0 ? (
                <List>
                  {Object.entries(cweMappings.cweCategories)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .map(([cweNumber, count]) => (
                      <ListItem key={cweNumber}>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body1" fontWeight="bold">
                                {cweNumber}
                              </Typography>
                              <Typography variant="body1">
                                - {getCweDescription(cweNumber)}
                              </Typography>
                              <Chip 
                                label="View Details" 
                                color="primary" 
                                size="small"
                                clickable
                                onClick={() => navigate(`/cwe-browser?cwe=${encodeURIComponent(cweNumber)}`)}
                              />
                            </Box>
                          }
                          secondary={`${count} issue${count !== 1 ? 's' : ''}`}
                        />
                        <Chip 
                          label={count} 
                          color="primary" 
                          size="small"
                        />
                      </ListItem>
                    ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No CWE mappings found. This could be due to API limitations or lack of security issues.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Rule to CWE Mappings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rule to CWE Mappings
              </Typography>
              <Typography variant="body2" color="textSecondary">
                SonarQube rules mapped to CWE numbers with confidence levels
              </Typography>
              
              {Object.keys(cweMappings?.ruleToCweMappings || {}).length > 0 ? (
                <List>
                  {Object.entries(cweMappings.ruleToCweMappings)
                    .slice(0, 10) // Show first 10 mappings
                    .map(([ruleKey, cweNumber]) => (
                      <ListItem key={ruleKey}>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body1" fontWeight="bold">
                                {ruleKey}
                              </Typography>
                              <Chip 
                                label="View CWE Details" 
                                color="secondary" 
                                size="small"
                                clickable
                                onClick={() => navigate(`/cwe-browser?cwe=${encodeURIComponent(String(cweNumber))}`)}
                              />
                            </Box>
                          }
                          secondary={`Mapped to ${cweNumber}`}
                        />
                        <Chip 
                          label={cweMappings.confidenceLevels[ruleKey] || 'unknown'}
                          color={getConfidenceColor(cweMappings.confidenceLevels[ruleKey])}
                          size="small"
                        />
                      </ListItem>
                    ))}
                  {Object.keys(cweMappings.ruleToCweMappings).length > 10 && (
                    <ListItem>
                      <Typography variant="body2" color="textSecondary">
                        ... and {Object.keys(cweMappings.ruleToCweMappings).length - 10} more
                      </Typography>
                    </ListItem>
                  )}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No rule mappings available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const getCweDescription = (cweNumber: string): string => {
    const cweDescriptions: Record<string, string> = {
      'CWE-79': 'Cross-site Scripting (XSS)',
      'CWE-89': 'SQL Injection',
      'CWE-78': 'OS Command Injection',
      'CWE-367': 'Time-of-check Time-of-use',
      'CWE-693': 'Protection Mechanism Failure'
    };
    return cweDescriptions[cweNumber] || 'Unknown CWE';
  };

  const getConfidenceColor = (confidence: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (confidence) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'error';
      default: return 'default';
    }
  };

  // removed Security Trends tab per request

  const renderIssuesTable = () => {
    if (!cweData) return null;

    return (
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Security Issues ({filteredIssues.length})
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => {
                const dataStr = JSON.stringify(filteredIssues, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'security-issues.json';
                link.click();
              }}
            >
              Export
            </Button>
          </Stack>

          {/* Filters */}
          <Stack direction="row" spacing={2} mb={3}>
            <TextField
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Severity</InputLabel>
              <Select
                value={severityFilter}
                label="Severity"
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="BLOCKER">Blocker</MenuItem>
                <MenuItem value="CRITICAL">Critical</MenuItem>
                <MenuItem value="MAJOR">Major</MenuItem>
                <MenuItem value="MINOR">Minor</MenuItem>
                <MenuItem value="INFO">Info</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="VULNERABILITY">Vulnerability</MenuItem>
                <MenuItem value="BUG">Bug</MenuItem>
                <MenuItem value="CODE_SMELL">Code Smell</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Project</InputLabel>
              <Select
                value={projectFilter}
                label="Project"
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                {Array.from(new Set(cweData.issues.map(i => i.project))).map(p => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <TableContainer sx={{ overflowX: 'auto', maxWidth: '100%' }}>
            <Table sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 80 }}>Expand</TableCell>
                  <TableCell sx={{ width: 100 }}>Severity</TableCell>
                  <TableCell sx={{ width: 120 }}>Type</TableCell>
                  <TableCell sx={{ width: 200 }}>Rule</TableCell>
                  <TableCell sx={{ minWidth: 300 }}>Message</TableCell>
                  <TableCell sx={{ width: 200 }}>Project</TableCell>
                  <TableCell sx={{ width: 150 }}>CWE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedIssues.map((issue) => (
                  <React.Fragment key={issue.key}>
                    <TableRow>
                      <TableCell>
                        <IconButton
                          onClick={() => toggleIssueExpansion(issue.key)}
                          size="small"
                        >
                          {expandedIssues.has(issue.key) ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
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
                          color={issue.type === 'VULNERABILITY' ? 'error' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {issue.rule}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {issue.message}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {issue.project}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {issue.cweNumbers.length > 0 ? (
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            {issue.cweNumbers.slice(0, 2).map((cwe) => (
                              <Chip
                                key={cwe}
                                label={cwe}
                                size="small"
                                color="primary"
                                variant="outlined"
                                clickable
                                onClick={() => navigate(`/cwe-browser?cwe=${encodeURIComponent(cwe)}`)}
                              />
                            ))}
                            <Tooltip title="View CVEs for this CWE on NVD">
                              <IconButton
                                size="small"
                                aria-label="view cves on nvd"
                                onClick={() => window.open(`https://nvd.nist.gov/vuln/search/results?adv_search=true&cwe_id=${encodeURIComponent(issue.cweNumbers[0])}`, '_blank')}
                                sx={{ ml: 0.5 }}
                              >
                                <OpenInNew fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {issue.cweNumbers.length > 2 && (
                              <Chip
                                label={`+${issue.cweNumbers.length - 2}`}
                                size="small"
                                color="default"
                                variant="outlined"
                              />
                            )}
                          </Stack>
                        ) : (
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography variant="caption" color="textSecondary">
                              No CWE
                            </Typography>
                            <Tooltip title="No CWE mapping available">
                              <Info fontSize="small" color="disabled" />
                            </Tooltip>
                          </Stack>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={7} sx={{ py: 0 }}>
                        <Collapse in={expandedIssues.has(issue.key)} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Issue Details
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body2">
                                  <strong>Component:</strong> {issue.component}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Line:</strong> {issue.line}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Status:</strong> {issue.status}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body2">
                                  <strong>Author:</strong> {issue.author || 'N/A'}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Creation Date:</strong> {new Date(issue.creationDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Update Date:</strong> {new Date(issue.updateDate).toLocaleDateString()}
                                </Typography>
                              </Grid>
                            </Grid>
                            {issue.cweNumbers.length > 0 && (
                              <Box mt={2}>
                                <Typography variant="subtitle2" gutterBottom>
                                  CWE Mappings
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                  {issue.cweNumbers.map((cwe) => (
                                    <Chip
                                      key={cwe}
                                      label={cwe}
                                      color="primary"
                                      variant="outlined"
                                    />
                                  ))}
                                </Stack>
                              </Box>
                            )}
                          </Box>
                          <Box mt={2}>
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate(`/cwe-browser?cwe=${encodeURIComponent((issue.cweNumbers[0] || '').toString())}`)}
                                disabled={issue.cweNumbers.length === 0}
                              >
                                View CWE Details
                              </Button>
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => window.open(`https://sonarcloud.io/project/issues?id=${encodeURIComponent(issue.project)}&open=${encodeURIComponent(issue.key)}`,'_blank')}
                              >
                                Open in SonarCloud
                              </Button>
                            </Stack>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredIssues.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" action={
        <Button color="inherit" size="small" onClick={loadCweData}>
          Retry
        </Button>
      }>
        {error}
      </Alert>
    );
  }

  if (!cweData) {
    return (
      <Alert severity="info">
        No CWE analysis data available.
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Security sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          Enhanced Security Analysis
        </Typography>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Security Overview" />
        <Tab label="CWE Analysis" />
        <Tab label="Security Issues" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {renderSecurityOverview()}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderCweAnalysis()}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {renderIssuesTable()}
      </TabPanel>
    </Box>
  );
};

export default EnhancedCweAnalysis;
