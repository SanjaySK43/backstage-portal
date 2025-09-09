import { useEffect, useState } from 'react';
import { InfoCard, Progress } from '@backstage/core-components';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  LinearProgress, 
  Chip,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Computer as ServerIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkIcon,
  CheckCircle as HealthyIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  metricCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  metricValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  progressContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  serviceItem: {
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  healthyService: {
    borderLeft: `4px solid ${theme.palette.success.main}`,
  },
  warningService: {
    borderLeft: `4px solid ${theme.palette.warning.main}`,
  },
  errorService: {
    borderLeft: `4px solid ${theme.palette.error.main}`,
  },
}));

type SystemMetric = {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
};

type ServiceStatus = {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  uptime: string;
  responseTime: number;
};

export const MyDynamicDataComponent = () => {
  const classes = useStyles();
  const errorApi = useApi(errorApiRef);
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [useRealData, setUseRealData] = useState(false);

  useEffect(() => {
    const fetchRealMonitoringData = async () => {
      try {
        // Try to fetch real system metrics from backend
        const [metricsResponse, servicesResponse] = await Promise.all([
          fetch('/api/system-monitoring/metrics'),
          fetch('/api/system-monitoring/services')
        ]);

        if (metricsResponse.ok && servicesResponse.ok) {
          const metricsData = await metricsResponse.json();
          const servicesData = await servicesResponse.json();
          
          setMetrics(metricsData.metrics);
          setServices(servicesData.services);
          setUseRealData(true);
        } else {
          throw new Error('Backend API not available');
        }
      } catch (error) {
        // Fallback to simulated data if backend is not available
        console.warn('Using simulated data - backend monitoring API not available');
        fetchSimulatedData();
        setUseRealData(false);
      }
      setLoading(false);
    };

    const fetchSimulatedData = () => {
      // Simulate real-time system metrics
      const newMetrics: SystemMetric[] = [
        {
          name: 'CPU Usage',
          value: Math.floor(Math.random() * 40) + 20, // 20-60%
          unit: '%',
          status: 'healthy',
        },
        {
          name: 'Memory Usage',
          value: Math.floor(Math.random() * 30) + 45, // 45-75%
          unit: '%',
          status: Math.random() > 0.8 ? 'warning' : 'healthy',
        },
        {
          name: 'Disk Usage',
          value: Math.floor(Math.random() * 20) + 65, // 65-85%
          unit: '%',
          status: Math.random() > 0.9 ? 'critical' : 'healthy',
        },
        {
          name: 'Network I/O',
          value: Math.floor(Math.random() * 100) + 50, // 50-150 Mbps
          unit: 'Mbps',
          status: 'healthy',
        },
      ];

      // Simulate service health monitoring
      const serviceStatuses: ServiceStatus[] = [
        {
          name: 'Backstage Backend',
          status: Math.random() > 0.95 ? 'error' : 'healthy',
          uptime: '99.9%',
          responseTime: Math.floor(Math.random() * 50) + 20,
        },
        {
          name: 'Database',
          status: Math.random() > 0.9 ? 'warning' : 'healthy',
          uptime: '99.8%',
          responseTime: Math.floor(Math.random() * 30) + 10,
        },
        {
          name: 'GitHub API',
          status: Math.random() > 0.85 ? 'warning' : 'healthy',
          uptime: '99.5%',
          responseTime: Math.floor(Math.random() * 100) + 50,
        },
        {
          name: 'CI/CD Pipeline',
          status: Math.random() > 0.8 ? 'warning' : 'healthy',
          uptime: '98.9%',
          responseTime: Math.floor(Math.random() * 200) + 100,
        },
      ];

      setMetrics(newMetrics);
      setServices(serviceStatuses);
    };

    const fetchMonitoringData = () => {
      if (useRealData) {
        fetchRealMonitoringData();
      } else {
        fetchSimulatedData();
        setLoading(false);
      }
    };

    // Initial fetch
    fetchRealMonitoringData();

    // Set up interval for updates
    const interval = setInterval(fetchMonitoringData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [useRealData, errorApi]);

  const getProgressColor = (status: string) => {
    if (status === 'critical') return 'secondary';
    if (status === 'warning') return 'primary';
    return 'primary';
  };

  const getServiceIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <HealthyIcon style={{ color: '#4caf50' }} />;
      case 'warning': return <WarningIcon style={{ color: '#ff9800' }} />;
      case 'error': return <ErrorIcon style={{ color: '#f44336' }} />;
      default: return <HealthyIcon />;
    }
  };

  const getServiceClass = (status: string) => {
    switch (status) {
      case 'healthy': return classes.healthyService;
      case 'warning': return classes.warningService;
      case 'error': return classes.errorService;
      default: return classes.healthyService;
    }
  };

  if (loading) {
    return (
      <InfoCard title="System Monitoring Dashboard">
        <Progress />
      </InfoCard>
    );
  }

  return (
    <InfoCard title="System Monitoring Dashboard">
      <Grid container spacing={3}>
        {/* System Metrics */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            System Metrics
          </Typography>
        </Grid>
        
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={metric.name}>
            <Card className={classes.metricCard}>
              <CardContent>
                <Box display="flex" alignItems="center" marginBottom={1}>
                  {index === 0 && <ServerIcon style={{ marginRight: 8 }} />}
                  {index === 1 && <MemoryIcon style={{ marginRight: 8 }} />}
                  {index === 2 && <StorageIcon style={{ marginRight: 8 }} />}
                  {index === 3 && <NetworkIcon style={{ marginRight: 8 }} />}
                  <Typography variant="subtitle2">
                    {metric.name}
                  </Typography>
                </Box>
                
                <Typography className={classes.metricValue}>
                  {metric.value}{metric.unit}
                </Typography>
                
                <Box className={classes.progressContainer}>
                  <LinearProgress
                    variant="determinate"
                    value={metric.value}
                    color={getProgressColor(metric.status)}
                  />
                </Box>
                
                <Chip
                  label={metric.status}
                  size="small"
                  color={metric.status === 'healthy' ? 'primary' : 'secondary'}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Service Health */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
            Service Health
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <List>
            {services.map((service) => (
              <ListItem 
                key={service.name}
                className={`${classes.serviceItem} ${getServiceClass(service.status)}`}
              >
                <ListItemIcon>
                  {getServiceIcon(service.status)}
                </ListItemIcon>
                <ListItemText
                  primary={service.name}
                  secondary={
                    <Box display="flex" style={{ gap: 16 }} marginTop={0.5}>
                      <Typography variant="body2" color="textSecondary">
                        Uptime: {service.uptime}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Response: {service.responseTime}ms
                      </Typography>
                    </Box>
                  }
                />
                <Chip
                  label={service.status}
                  size="small"
                  color={service.status === 'healthy' ? 'primary' : 'secondary'}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </InfoCard>
  );
};
