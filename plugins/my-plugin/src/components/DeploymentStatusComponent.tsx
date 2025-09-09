import { useEffect, useState } from 'react';
import { InfoCard, Progress } from '@backstage/core-components';
import { useApi, alertApiRef, errorApiRef } from '@backstage/core-plugin-api';
import { Button, Chip, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


type Build = {
  id: string;
  status: string;
  branch: string;
  timestamp: string;
  url?: string;
  sha?: string;
};

const useStyles = makeStyles((theme) => ({
  statusChip: {
    marginLeft: theme.spacing(1),
  },
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
}));

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'primary';
    case 'failure': return 'secondary';
    case 'in_progress': return 'default';
    default: return 'default';
  }
};

export const DeploymentStatusComponent = () => {
  const classes = useStyles();
  const alertApi = useApi(alertApiRef);
  const errorApi = useApi(errorApiRef);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflowRuns();
  }, []);

  const fetchWorkflowRuns = async () => {
    try {
      // For demo purposes, using mock data that simulates GitHub Actions
      setBuilds([
        { id: 'build-123', status: 'success', branch: 'main', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), sha: '0baa9b8' },
        { id: 'build-122', status: 'success', branch: 'main', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), sha: 'aa2acae' },
        { id: 'build-121', status: 'success', branch: 'main', timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), sha: '9df1324', url: 'https://github.com/SanjaySK43/backstage-portal/actions/runs/121' },
      ]);
    } catch (error) {
      errorApi.post(new Error(`Failed to fetch workflow runs: ${error}`));
    } finally {
      setLoading(false);
    }
  };

  const triggerBuild = async () => {
    try {
      // Open GitHub Actions to trigger the workflow manually
      const triggerUrl = `https://github.com/SanjaySK43/backstage-portal/actions/workflows/ci.yml`;
      window.open(triggerUrl, '_blank');
      
      alertApi.post({ message: 'Opening GitHub Actions to trigger build. Click "Run workflow" button.', severity: 'success' });
    } catch (error) {
      errorApi.post(new Error(`Failed to open workflow: ${error}`));
    }
    // In a real implementation, you would trigger a GitHub Actions workflow here
    // Example: POST to /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches
  };

  const rollbackBuild = (id: string) => {
    // Open GitHub Actions to manually trigger a rollback workflow
    const rollbackUrl = `https://github.com/SanjaySK43/backstage-portal/actions`;
    window.open(rollbackUrl, '_blank');
    alertApi.post({ message: `Opening GitHub Actions for rollback of build ${id}`, severity: 'warning' });
  };

  const viewBuild = () => {
    // Open GitHub Actions main page to view workflow runs
    const viewUrl = `https://github.com/SanjaySK43/backstage-portal/actions`;
    window.open(viewUrl, '_blank');
  };

  if (loading) return <InfoCard title="CI/CD Pipeline Status"><Progress /></InfoCard>;

  return (
    <InfoCard title="GitHub Actions & Deployment Status">
      <Box style={{ marginBottom: '16px' }}>
        <Button onClick={triggerBuild} variant="contained" color="primary">
          Trigger New Build
        </Button>
      </Box>
      
      {builds.map(build => (
        <Box key={build.id} className={classes.buildItem}>
          <Box className={classes.buildInfo}>
            <Typography variant="subtitle1">
              Build #{build.id}
              <Chip 
                label={build.status} 
                color={getStatusColor(build.status)} 
                size="small" 
                className={classes.statusChip}
              />
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Branch: {build.branch} | SHA: {build.sha} | {new Date(build.timestamp).toLocaleString()}
            </Typography>
          </Box>
          
          <Box className={classes.actions}>
            {build.url && (
              <Button 
                onClick={() => viewBuild()} 
                variant="outlined" 
                size="small"
              >
                View
              </Button>
            )}
            <Button 
              onClick={() => rollbackBuild(build.id)} 
              variant="outlined" 
              color="secondary" 
              size="small"
            >
              Rollback
            </Button>
          </Box>
        </Box>
      ))}
    </InfoCard>
  );
};
