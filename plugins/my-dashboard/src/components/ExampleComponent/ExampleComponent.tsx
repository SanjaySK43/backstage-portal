import { useState, useEffect } from 'react';
import { Typography, Grid, Box, Chip, LinearProgress } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
  Progress,
} from '@backstage/core-components';
import { makeStyles } from '@material-ui/core/styles';
import { ExampleFetchComponent } from '../ExampleFetchComponent';

const useStyles = makeStyles((theme) => ({
  metricCard: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  metricValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  statusChip: {
    margin: theme.spacing(0.5),
  },
  progressContainer: {
    marginTop: theme.spacing(1),
  },
}));

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  threshold: number;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  responseTime: number;
}

export const ExampleComponent = () => {
  const classes = useStyles();
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate real system metrics
    const fetchSystemData = () => {
      setSystemMetrics([
        { name: 'CPU Usage', value: 45, unit: '%', status: 'healthy', threshold: 80 },
        { name: 'Memory Usage', value: 68, unit: '%', status: 'warning', threshold: 85 },
        { name: 'Disk Usage', value: 32, unit: '%', status: 'healthy', threshold: 90 },
        { name: 'Network I/O', value: 156, unit: 'MB/s', status: 'healthy', threshold: 1000 },
      ]);

      setServices([
        { name: 'API Gateway', status: 'online', uptime: '99.9%', responseTime: 45 },
        { name: 'Database', status: 'online', uptime: '99.8%', responseTime: 12 },
        { name: 'Cache Service', status: 'degraded', uptime: '98.5%', responseTime: 89 },
        { name: 'Message Queue', status: 'online', uptime: '99.9%', responseTime: 23 },
      ]);
      
      setLoading(false);
    };

    fetchSystemData();
    const interval = setInterval(fetchSystemData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'primary';
      case 'warning':
      case 'degraded':
        return 'secondary';
      case 'critical':
      case 'offline':
        return 'default';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Page themeId="tool">
        <Header title="System Dashboard" subtitle="Real-time monitoring and metrics">
          <HeaderLabel label="Environment" value="Production" />
          <HeaderLabel label="Region" value="US-East-1" />
        </Header>
        <Content>
          <Progress />
        </Content>
      </Page>
    );
  }

  return (
    <Page themeId="tool">
      <Header title="System Dashboard" subtitle="Real-time monitoring and metrics">
        <HeaderLabel label="Environment" value="Production" />
        <HeaderLabel label="Region" value="US-East-1" />
        <HeaderLabel label="Last Updated" value={new Date().toLocaleTimeString()} />
      </Header>
      <Content>
        <ContentHeader title="Infrastructure Monitoring">
          <SupportButton>Monitor system health, performance metrics, and service status in real-time.</SupportButton>
        </ContentHeader>
        
        {/* System Metrics */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <InfoCard title="System Metrics">
              <Grid container spacing={2}>
                {systemMetrics.map((metric) => (
                  <Grid item xs={12} sm={6} md={3} key={metric.name}>
                    <Box className={classes.metricCard}>
                      <Typography variant="h6">{metric.name}</Typography>
                      <Typography className={classes.metricValue}>
                        {metric.value}{metric.unit}
                      </Typography>
                      <Chip
                        label={metric.status}
                        color={getStatusColor(metric.status)}
                        size="small"
                        className={classes.statusChip}
                      />
                      <Box className={classes.progressContainer}>
                        <LinearProgress
                          variant="determinate"
                          value={(metric.value / metric.threshold) * 100}
                          color={metric.status === 'critical' ? 'secondary' : 'primary'}
                        />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </InfoCard>
          </Grid>

          {/* Service Status */}
          <Grid item xs={12} md={6}>
            <InfoCard title="Service Status">
              {services.map((service) => (
                <Box key={service.name} style={{ marginBottom: '16px', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">{service.name}</Typography>
                    <Chip
                      label={service.status}
                      color={getStatusColor(service.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Uptime: {service.uptime} | Response Time: {service.responseTime}ms
                  </Typography>
                </Box>
              ))}
            </InfoCard>
          </Grid>

          {/* CI/CD Integration */}
          <Grid item xs={12} md={6}>
            <ExampleFetchComponent />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
