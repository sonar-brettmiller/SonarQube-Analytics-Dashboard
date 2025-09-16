import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { ProjectSummary } from '../types/sonarqube';

interface CoverageChartProps {
  projects: ProjectSummary[];
}

const CoverageChart: React.FC<CoverageChartProps> = ({ projects }) => {
  const data = projects.slice(0, 10).map(project => ({
    name: project.project.name.length > 15 
      ? project.project.name.substring(0, 15) + '...' 
      : project.project.name,
    coverage: project.metrics.coverage,
    bugs: project.metrics.bugs,
    vulnerabilities: project.metrics.vulnerabilities,
    codeSmells: project.metrics.codeSmells,
  }));

  const getBarColor = (value: number, type: string) => {
    switch (type) {
      case 'coverage':
        if (value >= 80) return '#4caf50';
        if (value >= 60) return '#ff9800';
        return '#f44336';
      case 'bugs':
        if (value === 0) return '#4caf50';
        if (value < 5) return '#ff9800';
        return '#f44336';
      case 'vulnerabilities':
        if (value === 0) return '#4caf50';
        if (value < 3) return '#ff9800';
        return '#f44336';
      case 'codeSmells':
        if (value < 50) return '#4caf50';
        if (value < 100) return '#ff9800';
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 3 }}>
          Project Coverage Overview
        </Typography>
        
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Coverage %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  `${value}${name === 'coverage' ? '%' : ''}`,
                  name === 'coverage' ? 'Coverage' : 
                  name === 'bugs' ? 'Bugs' :
                  name === 'vulnerabilities' ? 'Vulnerabilities' : 'Code Smells'
                ]}
                labelStyle={{ color: '#333' }}
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="coverage" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry.coverage, 'coverage')} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing top {Math.min(10, projects.length)} projects
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#4caf50', borderRadius: 1 }} />
              <Typography variant="caption">Good</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#ff9800', borderRadius: 1 }} />
              <Typography variant="caption">Fair</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#f44336', borderRadius: 1 }} />
              <Typography variant="caption">Poor</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CoverageChart;
