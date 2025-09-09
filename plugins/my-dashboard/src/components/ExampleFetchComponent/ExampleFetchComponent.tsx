import { useState, useEffect } from 'react';
import { Typography, Box, Chip, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  InfoCard,
  Progress,
} from '@backstage/core-components';

const useStyles = makeStyles((theme) => ({
  buildItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  buildInfo: {
    flex: 1,
  },
  actions: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  statusChip: {
    marginLeft: theme.spacing(1),
  },
}));

type Build = {
  id: string;
  status: 'success' | 'failure' | 'in_progress';
  branch: string;
  timestamp: string;
  url?: string;
  sha?: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'primary';
    case 'failure': return 'secondary';
    case 'in_progress': return 'default';
    default: return 'default';
  }
};

export const ExampleFetchComponent = () => {
  const classes = useStyles();
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeployments = () => {
      // Simulate CI/CD deployment data
      setBuilds([
        { 
          id: 'deploy-456', 
          status: 'success', 
          branch: 'main', 
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), 
          sha: '1a2b3c4',
          url: 'https://github.com/SanjaySK43/backstage-portal/actions/runs/456'
        },
        { 
          id: 'deploy-455', 
          status: 'success', 
          branch: 'main', 
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), 
          sha: '5d6e7f8'
        },
        { 
          id: 'deploy-454', 
          status: 'failure', 
          branch: 'feature/auth', 
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), 
          sha: '9g0h1i2'
        },
      ]);
      setLoading(false);
    };

    fetchDeployments();
    const interval = setInterval(fetchDeployments, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const triggerDeploy = () => {
    const deployUrl = 'https://github.com/SanjaySK43/backstage-portal/actions/workflows/ci.yml';
    window.open(deployUrl, '_blank');
  };

  const viewDeployment = (url?: string) => {
    const viewUrl = url || 'https://github.com/SanjaySK43/backstage-portal/actions';
    window.open(viewUrl, '_blank');
  };

  if (loading) {
    return (
      <InfoCard title="CI/CD Deployments">
        <Progress />
      </InfoCard>
    );
  }

  return (
    <InfoCard title="CI/CD Deployments">
      <Box style={{ marginBottom: '16px' }}>
        <Button onClick={triggerDeploy} variant="contained" color="primary" size="small">
          Trigger Deploy
        </Button>
      </Box>
      
      {builds.map(build => (
        <Box key={build.id} className={classes.buildItem}>
          <Box className={classes.buildInfo}>
            <Typography variant="subtitle2">
              {build.id}
              <Chip 
                label={build.status} 
                color={getStatusColor(build.status)} 
                size="small" 
                className={classes.statusChip}
              />
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {build.branch} | {build.sha} | {new Date(build.timestamp).toLocaleString()}
            </Typography>
          </Box>
          
          <Box className={classes.actions}>
            <Button 
              onClick={() => viewDeployment(build.url)} 
              variant="outlined" 
              size="small"
            >
              View
            </Button>
          </Box>
        </Box>
      ))}
    </InfoCard>
  );
};
