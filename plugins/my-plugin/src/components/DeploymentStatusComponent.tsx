import React, { useEffect, useState } from 'react';
import { InfoCard } from '@backstage/core-components';
import Button from '@mui/material/Button';

type Build = {
  id: string;
  status: string;
  branch: string;
  timestamp: string;
};

export const DeploymentStatusComponent = () => {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setBuilds([
        { id: 'build-123', status: 'Success', branch: 'main', timestamp: '2025-09-07T12:00:00Z' },
        { id: 'build-122', status: 'Failed', branch: 'feature/login', timestamp: '2025-09-06T10:30:00Z' },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const triggerBuild = () => {
    alert('Triggering a new build... (connect to your CI API here)');
  };

  const rollbackBuild = (id: string) => {
    alert(`Rolling back build ${id}... (connect to your CI API here)`);
  };

  if (loading) return <InfoCard title="Deployment Status">Loading...</InfoCard>;

  return (
    <InfoCard title="Deployment & CI/CD Status">
      <Button onClick={triggerBuild} variant="contained" color="primary" style={{ marginBottom: '12px' }}>
        Trigger New Build
      </Button>
      <ul>
        {builds.map(b => (
          <li key={b.id}>
            <strong>{b.id}</strong> - Status: {b.status} - Branch: {b.branch} - {new Date(b.timestamp).toLocaleString()}
            <Button onClick={() => rollbackBuild(b.id)} variant="outlined" color="secondary" size="small" style={{ marginLeft: '12px' }}>
              Rollback
            </Button>
          </li>
        ))}
      </ul>
    </InfoCard>
  );
};
