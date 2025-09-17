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
  Stack,
  LinearProgress,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Badge
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
  SecurityUpdate,
  Assessment,
  Timeline,
  Category,
  KeyboardArrowUp,
  KeyboardArrowDown
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const EnhancedCweAnalysis: React.FC = () => {
  const { apiService } = useSonarQube();
  const [cweData, setCweData] = useState<CweAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [securityTrends, setSecurityTrends] = useState<any>(null);
  const [hotspotCategories, setHotspotCategories] = useState<any>(null);

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

      const [basicData, trends, categories] = await Promise.all([
        apiService.getEnhancedCweAnalysisData(),
        apiService.getSecurityTrends(),
        apiService.getSecurityHotspotsByCategory()
      ]);

      setCweData(basicData);
      setSecurityTrends(trends);
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
              <Typography variant="body2" color="textSecondary" paragraph>
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
                                onClick={() => {
                                  // Navigate to CWE Browser with this CWE selected
                                  window.open(`/cwe-browser?cwe=${cweNumber}`, '_blank');
                                }}
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
              <Typography variant="body2" color="textSecondary" paragraph>
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
                                onClick={() => {
                                  window.open(`/cwe-browser?cwe=${cweNumber}`, '_blank');
                                }}
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

  const renderSecurityTrends = () => {
    if (!securityTrends) return null;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Trends Analysis
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(securityTrends).map(([metric, data]: [string, any]) => (
                  <Grid item xs={12} md={4} key={metric}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {metric.replace(/_/g, ' ').toUpperCase()}
                      </Typography>
                      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                        <Typography variant="h4" fontWeight="bold">
                          {data.current || 0}
                        </Typography>
                        {data.change !== undefined && (
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            {getTrendIcon(data.trend)}
                            <Typography 
                              variant="body2" 
                              color={data.change > 0 ? 'error' : 'success'}
                            >
                              {data.change > 0 ? '+' : ''}{data.change}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                      <Typography variant="caption" color="textSecondary">
                        Current: {data.current || 0} | New: {data.new || 0}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderIssuesTable = () => {
    if (!cweData) return null;

    const filteredIssues = cweData.issues.filter(issue => {
      const matchesSearch = issue.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.rule.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === 'all' || issue.severity === severityFilter;
      const matchesType = typeFilter === 'all' || issue.type === typeFilter;
      
      return matchesSearch && matchesSeverity && matchesType;
    });

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
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Expand</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Rule</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>CWE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredIssues.map((issue) => (
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
                        <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
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
                          <Stack direction="row" spacing={0.5}>
                            {issue.cweNumbers.slice(0, 2).map((cwe) => (
                              <Chip
                                key={cwe}
                                label={cwe}
                                size="small"
                                color="primary"
                                variant="outlined"
                                clickable
                                onClick={() => window.open(`/cwe-browser?cwe=${encodeURIComponent(cwe)}`, '_blank')}
                              />
                            ))}
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
                          <Typography variant="caption" color="textSecondary">
                            No CWE
                          </Typography>
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
        <Tab label="Security Trends" />
        <Tab label="Security Issues" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {renderSecurityOverview()}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderCweAnalysis()}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {renderSecurityTrends()}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {renderIssuesTable()}
      </TabPanel>
    </Box>
  );
};

export default EnhancedCweAnalysis;
