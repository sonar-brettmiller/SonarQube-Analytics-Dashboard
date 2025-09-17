import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import {
  PictureAsPdf,
  TableChart,
  FileDownload,
  Assessment,
  Business,
  Security,
  Refresh,
} from '@mui/icons-material';
import { useSonarQube } from '../contexts/SonarQubeContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Reports: React.FC = () => {
  const { reportData, isLoading, refreshData } = useSonarQube();
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const generateReport = async (type: 'executive' | 'technical' | 'compliance') => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setGeneratedReport(`${type}-report-${Date.now()}.pdf`);
      setIsGenerating(false);
    }, 2000);
  };

  const downloadReport = (format: 'pdf' | 'excel' | 'csv') => {
    // Simulate download
    console.log(`Downloading ${format} report...`);
  };

  if (!reportData) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5" color="text.secondary">
          No data available for reporting
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Connect to SonarQube Cloud to generate reports
        </Typography>
      </Box>
    );
  }

  const reportTypes = [
    {
      id: 'executive',
      title: 'Executive Summary',
      description: 'High-level overview for leadership and stakeholders',
      icon: <Business />,
      color: 'primary',
    },
    {
      id: 'technical',
      title: 'Technical Report',
      description: 'Detailed technical analysis for development teams',
      icon: <Assessment />,
      color: 'secondary',
    },
    {
      id: 'compliance',
      title: 'Compliance Report',
      description: 'Security and compliance status for audit purposes',
      icon: <Security />,
      color: 'success',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Reports & Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Generate comprehensive reports for different audiences
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={refreshData}
          disabled={isLoading}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Report Type Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {reportTypes.map((reportType) => (
          <Box key={reportType.id} sx={{ flex: '1 1 calc(33.33% - 12px)', minWidth: 300 }}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                border: activeTab === reportTypes.indexOf(reportType) ? 2 : 1,
                borderColor: activeTab === reportTypes.indexOf(reportType) ? 'primary.main' : 'divider',
                '&:hover': {
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                },
              }}
              onClick={() => setActiveTab(reportTypes.indexOf(reportType))}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ color: `${reportType.color}.main`, mb: 2 }}>
                  {reportType.icon}
                </Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                  {reportType.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {reportType.description}
                </Typography>
                <Chip
                  label={activeTab === reportTypes.indexOf(reportType) ? 'Selected' : 'Select'}
                  color={activeTab === reportTypes.indexOf(reportType) ? 'primary' : 'default'}
                  size="small"
                />
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Report Content */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="report tabs">
            <Tab
              label="Executive Summary"
              icon={<Business />}
              iconPosition="start"
              sx={{ textTransform: 'none' }}
            />
            <Tab
              label="Technical Report"
              icon={<Assessment />}
              iconPosition="start"
              sx={{ textTransform: 'none' }}
            />
            <Tab
              label="Compliance Report"
              icon={<Security />}
              iconPosition="start"
              sx={{ textTransform: 'none' }}
            />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6">Executive Report</Typography>
          <Typography variant="body2" color="text.secondary">
            Executive report functionality coming soon...
          </Typography>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6">Technical Report</Typography>
          <Typography variant="body2" color="text.secondary">
            Technical report functionality coming soon...
          </Typography>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6">Compliance Report</Typography>
          <Typography variant="body2" color="text.secondary">
            Compliance report functionality coming soon...
          </Typography>
        </TabPanel>
      </Card>

      {/* Report Actions */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<PictureAsPdf />}
          onClick={() => generateReport(activeTab === 0 ? 'executive' : activeTab === 1 ? 'technical' : 'compliance')}
          disabled={isGenerating}
          size="large"
        >
          {isGenerating ? 'Generating...' : 'Generate PDF Report'}
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<TableChart />}
          onClick={() => downloadReport('excel')}
          size="large"
        >
          Export Excel
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<FileDownload />}
          onClick={() => downloadReport('csv')}
          size="large"
        >
          Export CSV
        </Button>
      </Box>

      {/* Generation Dialog */}
      <Dialog open={isGenerating} maxWidth="sm" fullWidth>
        <DialogTitle>Generating Report</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Refresh sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Generating your report...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This may take a few moments
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={!!generatedReport} onClose={() => setGeneratedReport(null)}>
        <DialogTitle>Report Generated Successfully</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Your report has been generated and is ready for download.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGeneratedReport(null)}>Close</Button>
          <Button variant="contained" onClick={() => downloadReport('pdf')}>
            Download Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports;
