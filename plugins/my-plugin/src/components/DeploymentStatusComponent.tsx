import React, { useEffect, useState } from 'react';
import { InfoCard, Progress } from '@backstage/core-components';
import { useApi, alertApiRef, githubAuthApiRef, errorApiRef } from '@backstage/core-plugin-api';
import { Button, Chip, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

type WorkflowRun = {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  head_branch: string;
  created_at: string;
  html_url: string;
  head_sha: string;
};

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
  const githubAuth = useApi(githubAuthApiRef);
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
        { id: 'build-123', status: 'success', branch: 'main', timestamp: '2025-09-09T06:45:00Z', sha: 'abc1234', url: 'https://github.com/user/repo/actions/runs/123' },
        { id: 'build-122', status: 'failure', branch: 'feature/ci-cd', timestamp: '2025-09-09T06:30:00Z', sha: 'def5678', url: 'https://github.com/user/repo/actions/runs/122' },
        { id: 'build-121', status: 'in_progress', branch: 'feature/github-integration', timestamp: '2025-09-09T06:15:00Z', sha: 'ghi9012', url: 'https://github.com/user/repo/actions/runs/121' },
      ]);
    } catch (error) {
      errorApi.post(new Error(`Failed to fetch workflow runs: ${error}`));
    } finally {
      setLoading(false);
    }
  };

  const triggerBuild = async () => {
    alertApi.post({ message: 'Triggering GitHub Actions workflow...', severity: 'info' });
    // In a real implementation, you would trigger a GitHub Actions workflow here
    // Example: POST to /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches
  };

  const rollbackBuild = (id: string) => {
    alertApi.post({ message: `Initiating rollback for build ${id}...`, severity: 'warning' });
  };

  const viewBuild = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
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
                onClick={() => viewBuild(build.url)} 
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
