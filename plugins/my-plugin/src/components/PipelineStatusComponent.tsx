import { useEffect, useState } from 'react';
import { InfoCard, Progress } from '@backstage/core-components';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  Button,
  Box,
  Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2, 0),
  },
  statusChip: {
    margin: theme.spacing(0.5),
  },
  actionButton: {
    margin: theme.spacing(0, 0.5),
  },
  runInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  timestamp: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
}));

type WorkflowRun = {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  head_branch: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  head_sha: string;
  run_number: number;
  event: string;
};

const getStatusColor = (status: string, conclusion: string | null) => {
  if (status === 'completed') {
    switch (conclusion) {
      case 'success': return 'primary';
      case 'failure': return 'secondary';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  }
  switch (status) {
    case 'in_progress': return 'default';
    case 'queued': return 'default';
    default: return 'default';
  }
};

const getStatusText = (status: string, conclusion: string | null) => {
  if (status === 'completed') {
    return conclusion || 'completed';
  }
  return status;
};

export const PipelineStatusComponent = () => {
  const classes = useStyles();
  const errorApi = useApi(errorApiRef);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflowRuns();
    // Refresh every 30 seconds
    const interval = setInterval(fetchWorkflowRuns, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchWorkflowRuns = async () => {
    try {
      // For demo purposes, using mock data that represents recent pipeline runs
      const mockRuns: WorkflowRun[] = [
        {
          id: 1001,
          name: 'Demo CI Pipeline',
          status: 'completed',
          conclusion: 'success',
          head_branch: 'main',
          created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
          updated_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 minutes ago
          html_url: 'https://github.com/SanjaySK43/my-portal/actions/runs/1001',
          head_sha: 'b2ad87c',
          run_number: 15,
          event: 'push',
        },
        {
          id: 1000,
          name: 'Demo CI Pipeline',
          status: 'completed',
          conclusion: 'success',
          head_branch: 'main',
          created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
          updated_at: new Date(Date.now() - 13 * 60 * 1000).toISOString(), // 13 minutes ago
          html_url: 'https://github.com/SanjaySK43/my-portal/actions/runs/1000',
          head_sha: '05132f7',
          run_number: 14,
          event: 'push',
        },
        {
          id: 999,
          name: 'Demo CI Pipeline',
          status: 'in_progress',
          conclusion: null,
          head_branch: 'feature/demo',
          created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
          updated_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
          html_url: 'https://github.com/SanjaySK43/my-portal/actions/runs/999',
          head_sha: 'abc1234',
          run_number: 16,
          event: 'pull_request',
        },
      ];

      setRuns(mockRuns);
    } catch (error) {
      errorApi.post(new Error(`Failed to fetch workflow runs: ${error}`));
    } finally {
      setLoading(false);
    }
  };

  const viewRun = () => {
    // Since we're using mock data, redirect to the main GitHub Actions page
    // In a real implementation, this would use the actual run URL
    const actionsUrl = `https://github.com/SanjaySK43/backstage-portal/actions`;
    window.open(actionsUrl, '_blank');
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <InfoCard title="Pipeline Status">
        <Progress />
      </InfoCard>
    );
  }

  return (
    <InfoCard title="CI/CD Pipeline Status" className={classes.container}>
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary">
          Recent workflow runs from GitHub Actions
        </Typography>
      </Box>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Run</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Commit</TableCell>
              <TableCell>Trigger</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {runs.map((run) => (
              <TableRow key={run.id}>
                <TableCell>
                  <div className={classes.runInfo}>
                    <Typography variant="body2" component="strong">
                      #{run.run_number}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {run.name}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(run.status, run.conclusion)}
                    color={getStatusColor(run.status, run.conclusion)}
                    size="small"
                    className={classes.statusChip}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {run.head_branch}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" style={{ fontFamily: 'monospace' }}>
                    {run.head_sha}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    {run.event}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" className={classes.timestamp}>
                    {formatTimeAgo(run.created_at)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.actionButton}
                    onClick={() => viewRun()}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Button
          variant="outlined"
          onClick={() => window.open('https://github.com/SanjaySK43/backstage-portal/actions', '_blank')}
        >
          View all workflows on GitHub →
        </Button>
      </Box>
    </InfoCard>
  );
};
