import { useEffect, useState } from 'react';
import { InfoCard, Progress, Link } from '@backstage/core-components';
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

type Workflow = {
  id: number;
  name: string;
  path: string;
  state: string;
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
  badge_url: string;
};

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  statusChip: {
    minWidth: 80,
  },
  actionButton: {
    marginRight: theme.spacing(1),
  },
  workflowHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
}));

const getStatusColor = (state: string) => {
  switch (state) {
    case 'active': return 'primary';
    case 'disabled': return 'default';
    default: return 'secondary';
  }
};

export const GitHubActionsComponent = () => {
  const classes = useStyles();
  const errorApi = useApi(errorApiRef);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [owner] = useState('SanjaySK43');
  const [repo] = useState('backstage-portal');

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      // For demo purposes, using mock data that represents GitHub Actions workflows
      const mockWorkflows: Workflow[] = [
        {
          id: 1,
          name: 'Demo CI Pipeline',
          path: '.github/workflows/ci.yml',
          state: 'active',
          created_at: '2025-09-01T10:00:00Z',
          updated_at: '2025-09-09T06:45:00Z',
          url: `https://api.github.com/repos/${owner}/${repo}/actions/workflows/ci.yml`,
          html_url: `https://github.com/${owner}/${repo}/actions/workflows/ci.yml`,
          badge_url: `https://github.com/${owner}/${repo}/workflows/Demo%20CI%20Pipeline/badge.svg`,
        },
      ];

      setWorkflows(mockWorkflows);
    } catch (error) {
      errorApi.post(new Error(`Failed to fetch workflows: ${error}`));
    } finally {
      setLoading(false);
    }
  };

  const triggerWorkflow = async (workflowName: string, workflowPath: string) => {
    try {
      // GitHub API endpoint for workflow_dispatch
      // POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches
      
      // Open GitHub Actions page where user can manually trigger with "Run workflow" button
      const triggerUrl = `https://github.com/${owner}/${repo}/actions/workflows/${workflowPath.replace('.github/workflows/', '')}`;
      window.open(triggerUrl, '_blank');
      
      // Show success message
      errorApi.post(new Error(`Opening GitHub Actions to trigger: ${workflowName}. Click "Run workflow" button.`));
    } catch (error) {
      errorApi.post(new Error(`Failed to open workflow: ${error}`));
    }
  };

  const viewWorkflowRuns = () => {
    // Navigate directly to all workflow runs for this repository
    const runsUrl = `https://github.com/${owner}/${repo}/actions`;
    window.open(runsUrl, '_blank');
  };

  if (loading) {
    return (
      <InfoCard title="GitHub Actions Workflows">
        <Progress />
      </InfoCard>
    );
  }

  return (
    <InfoCard title="GitHub Actions Workflows">
      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="textSecondary">
          Repository: {owner}/{repo}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => fetchWorkflows()}
        >
          REFRESH
        </Button>
      </Box>

      <TableContainer>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Workflow</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Path</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workflows.map((workflow) => (
              <TableRow key={workflow.id}>
                <TableCell>
                  <Link to={workflow.html_url} target="_blank">
                    {workflow.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Chip
                    label={workflow.state}
                    color={getStatusColor(workflow.state)}
                    size="small"
                    className={classes.statusChip}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" style={{ fontFamily: 'monospace' }}>
                    {workflow.path}
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(workflow.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.actionButton}
                    onClick={() => triggerWorkflow(workflow.name, workflow.path)}
                    disabled={workflow.state !== 'active'}
                  >
                    Trigger
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => viewWorkflowRuns()}
                  >
                    View Runs
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </InfoCard>
  );
};
