import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';

import {
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';

interface QualityGateStatusProps {
  passed: number;
  failed: number;
  total: number;
}

const QualityGateStatus: React.FC<QualityGateStatusProps> = ({
  passed,
  failed,
  total,
}) => {
  const passRate = total > 0 ? (passed / total) * 100 : 0;
  const failRate = total > 0 ? (failed / total) * 100 : 0;

  const getStatusColor = () => {
    if (failRate === 0) return 'success';
    if (failRate < 20) return 'warning';
    return 'error';
  };

  const getStatusIcon = () => {
    if (failRate === 0) return <CheckCircle />;
    if (failRate < 20) return <Warning />;
    return <Error />;
  };

  const getStatusText = () => {
    if (failRate === 0) return 'All Quality Gates Passed';
    if (failRate < 20) return 'Most Quality Gates Passed';
    return 'Quality Gates Need Attention';
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Quality Gate Status
          </Typography>
          <Chip
            icon={getStatusIcon()}
            label={getStatusText()}
            color={getStatusColor() as any}
            variant="outlined"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {passRate.toFixed(1)}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Projects passing quality gates
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={passRate}
          sx={{
            height: 12,
            borderRadius: 6,
            backgroundColor: 'rgba(0,0,0,0.1)',
            mb: 2,
            '& .MuiLinearProgress-bar': {
              backgroundColor: getStatusColor() === 'success' ? '#4caf50' : 
                            getStatusColor() === 'warning' ? '#ff9800' : '#f44336',
              borderRadius: 6,
            },
          }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1, textAlign: 'center', p: 2, backgroundColor: 'success.light', borderRadius: 2 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'success.dark' }}>
              {passed}
            </Typography>
            <Typography variant="body2" color="success.dark" sx={{ fontWeight: 500 }}>
              Passed
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center', p: 2, backgroundColor: 'error.light', borderRadius: 2 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'error.dark' }}>
              {failed}
            </Typography>
            <Typography variant="body2" color="error.dark" sx={{ fontWeight: 500 }}>
              Failed
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Total Projects: {total}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QualityGateStatus;
