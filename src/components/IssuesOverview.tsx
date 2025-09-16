import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';

import {
  BugReport,
  Security,
  Code,
  Warning,
} from '@mui/icons-material';
import type { ProjectSummary } from '../types/sonarqube';

interface IssuesOverviewProps {
  projects: ProjectSummary[];
}

const IssuesOverview: React.FC<IssuesOverviewProps> = ({ projects }) => {
  const totalBugs = projects.reduce((sum, project) => sum + project.metrics.bugs, 0);
  const totalVulnerabilities = projects.reduce((sum, project) => sum + project.metrics.vulnerabilities, 0);
  const totalCodeSmells = projects.reduce((sum, project) => sum + project.metrics.codeSmells, 0);
  const totalSecurityHotspots = projects.reduce((sum, project) => sum + project.metrics.securityHotspots, 0);

  const getSeverityColor = (count: number, type: string) => {
    switch (type) {
      case 'bugs':
        if (count === 0) return 'success';
        if (count < 10) return 'warning';
        return 'error';
      case 'vulnerabilities':
        if (count === 0) return 'success';
        if (count < 5) return 'warning';
        return 'error';
      case 'codeSmells':
        if (count < 50) return 'success';
        if (count < 100) return 'warning';
        return 'error';
      case 'securityHotspots':
        if (count === 0) return 'success';
        if (count < 5) return 'warning';
        return 'error';
      default:
        return 'default';
    }
  };

  const getSeverityText = (count: number, type: string) => {
    switch (type) {
      case 'bugs':
        if (count === 0) return 'No bugs found';
        if (count < 10) return 'Few bugs detected';
        return 'Multiple bugs need attention';
      case 'vulnerabilities':
        if (count === 0) return 'No vulnerabilities';
        if (count < 5) return 'Some vulnerabilities found';
        return 'Critical vulnerabilities detected';
      case 'codeSmells':
        if (count < 50) return 'Clean code';
        if (count < 100) return 'Some maintainability issues';
        return 'Many code smells detected';
      case 'securityHotspots':
        if (count === 0) return 'No security hotspots';
        if (count < 5) return 'Some security hotspots';
        return 'Multiple security hotspots';
      default:
        return '';
    }
  };

  const issues = [
    {
      type: 'bugs',
      title: 'Bugs',
      count: totalBugs,
      icon: <BugReport />,
      description: 'Issues that need immediate attention',
    },
    {
      type: 'vulnerabilities',
      title: 'Vulnerabilities',
      count: totalVulnerabilities,
      icon: <Security />,
      description: 'Security vulnerabilities in the code',
    },
    {
      type: 'codeSmells',
      title: 'Code Smells',
      count: totalCodeSmells,
      icon: <Code />,
      description: 'Maintainability issues',
    },
    {
      type: 'securityHotspots',
      title: 'Security Hotspots',
      count: totalSecurityHotspots,
      icon: <Warning />,
      description: 'Areas that need security review',
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 3 }}>
          Issues Overview
        </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {issues.map((issue) => (
                <Box key={issue.type} sx={{ flex: '1 1 calc(25% - 12px)', minWidth: 250 }}>
              <Box
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Box sx={{ color: 'primary.main', mr: 1 }}>
                      {issue.icon}
                    </Box>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
                      {issue.title}
                    </Typography>
                  </Box>

                  <Typography variant="h3" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                    {issue.count}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {issue.description}
                  </Typography>
                </Box>

                <Box>
                  <Chip
                    label={getSeverityText(issue.count, issue.type)}
                    color={getSeverityColor(issue.count, issue.type) as any}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
                </Box>
              ))}
            </Box>

        <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Total issues across all projects: {totalBugs + totalVulnerabilities + totalCodeSmells + totalSecurityHotspots}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default IssuesOverview;
