import React, { useEffect, useState } from 'react';
import { InfoCard, Progress, Link } from '@backstage/core-components';
import { useApi, githubAuthApiRef, errorApiRef } from '@backstage/core-plugin-api';
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
  const githubAuth = useApi(githubAuthApiRef);
  const errorApi = useApi(errorApiRef);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState('your-org');
  const [repo, setRepo] = useState('my-portal');

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      // For demo purposes, using mock data that represents GitHub Actions workflows
      const mockWorkflows: Workflow[] = [
        {
          id: 1,
          name: 'CI',
          path: '.github/workflows/ci.yml',
          state: 'active',
          created_at: '2025-09-01T10:00:00Z',
          updated_at: '2025-09-09T06:45:00Z',
          url: `https://api.github.com/repos/${owner}/${repo}/actions/workflows/1`,
          html_url: `https://github.com/${owner}/${repo}/actions/workflows/ci.yml`,
          badge_url: `https://github.com/${owner}/${repo}/workflows/CI/badge.svg`,
        },
        {
          id: 2,
          name: 'Build and Publish Backend Image',
          path: '.github/workflows/cd-backend-image.yml',
          state: 'active',
          created_at: '2025-09-01T10:00:00Z',
          updated_at: '2025-09-09T06:30:00Z',
          url: `https://api.github.com/repos/${owner}/${repo}/actions/workflows/2`,
          html_url: `https://github.com/${owner}/${repo}/actions/workflows/cd-backend-image.yml`,
          badge_url: `https://github.com/${owner}/${repo}/workflows/Build%20and%20Publish%20Backend%20Image/badge.svg`,
        },
        {
          id: 3,
          name: 'Deploy Frontend to Netlify',
          path: '.github/workflows/deploy-frontend.yml',
          state: 'active',
          created_at: '2025-09-09T12:00:00Z',
          updated_at: '2025-09-09T12:00:00Z',
          url: `https://api.github.com/repos/${owner}/${repo}/actions/workflows/3`,
          html_url: `https://github.com/${owner}/${repo}/actions/workflows/deploy-frontend.yml`,
          badge_url: `https://github.com/${owner}/${repo}/workflows/Deploy%20Frontend%20to%20Netlify/badge.svg`,
        },
        {
          id: 4,
          name: 'Security Scan',
          path: '.github/workflows/security-scan.yml',
          state: 'active',
          created_at: '2025-09-09T12:00:00Z',
          updated_at: '2025-09-09T12:00:00Z',
          url: `https://api.github.com/repos/${owner}/${repo}/actions/workflows/4`,
          html_url: `https://github.com/${owner}/${repo}/actions/workflows/security-scan.yml`,
          badge_url: `https://github.com/${owner}/${repo}/workflows/Security%20Scan/badge.svg`,
        },
      ];

      setWorkflows(mockWorkflows);
    } catch (error) {
      errorApi.post(new Error(`Failed to fetch workflows: ${error}`));
    } finally {
      setLoading(false);
    }
  };

  const triggerWorkflow = async (workflowId: number, workflowName: string) => {
    try {
      // In a real implementation, you would dispatch a workflow event here
      // POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches
      errorApi.post({ 
        message: `Triggered workflow: ${workflowName}`, 
        severity: 'success' 
      });
    } catch (error) {
      errorApi.post(new Error(`Failed to trigger workflow: ${error}`));
    }
  };

  const viewWorkflowRuns = (htmlUrl: string) => {
    window.open(htmlUrl, '_blank');
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
      <Box className={classes.workflowHeader}>
        <Typography variant="body2" color="textSecondary">
          Repository: {owner}/{repo}
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={fetchWorkflows}
        >
          Refresh
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
                    onClick={() => triggerWorkflow(workflow.id, workflow.name)}
                    disabled={workflow.state !== 'active'}
                  >
                    Trigger
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => viewWorkflowRuns(workflow.html_url)}
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
