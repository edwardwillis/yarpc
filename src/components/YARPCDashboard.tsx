import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Api as ApiIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Timeline as TimelineIcon,
  CloudQueue as CloudIcon,
  Settings as SettingsIcon,
  Logout,
} from '@mui/icons-material';

export const YARPCDashboard: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return null;
  }

  const dashboardItems = [
    {
      title: 'Active RPC Services',
      value: '12',
      icon: <ApiIcon color="primary" />,
      description: 'Currently running services'
    },
    {
      title: 'Avg Response Time',
      value: '24ms',
      icon: <SpeedIcon color="success" />,
      description: 'Last 24 hours'
    },
    {
      title: 'Total Requests',
      value: '1.2M',
      icon: <TimelineIcon color="info" />,
      description: 'This month'
    },
    {
      title: 'Uptime',
      value: '99.9%',
      icon: <CloudIcon color="warning" />,
      description: 'Last 30 days'
    }
  ];

  const recentActivity = [
    { action: 'New service deployed', service: 'user-service-v2', time: '2 minutes ago' },
    { action: 'Health check passed', service: 'payment-gateway', time: '5 minutes ago' },
    { action: 'Performance alert resolved', service: 'notification-api', time: '12 minutes ago' },
    { action: 'Service updated', service: 'auth-service', time: '1 hour ago' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            YARPC Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Remote Procedure Call Management Platform
          </Typography>
        </Box>
        
        {/* User Profile Section */}
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={user?.picture}
            alt={user?.name || 'User'}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography variant="h6">{user?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Logout />}
            onClick={() => logout({
              logoutParams: {
                returnTo: window.location.origin
              }
            })}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Welcome Banner */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <DashboardIcon sx={{ fontSize: 48 }} />
            <Box>
              <Typography variant="h5" gutterBottom>
                Welcome back, {user?.given_name || user?.name}!
              </Typography>
              <Typography variant="body1">
                Monitor and manage your RPC services from this centralized dashboard.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={3} mb={4}>
        {dashboardItems.map((item, index) => (
          <Card key={index}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {item.value}
                  </Typography>
                  <Typography variant="h6" color="text.primary">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
                <Box sx={{ opacity: 0.7 }}>
                  {item.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box display="flex" gap={3} flexDirection={{ xs: 'column', md: 'row' }}>
        {/* Recent Activity */}
        <Box flex={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <TimelineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.action}
                        secondary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip 
                              label={activity.service} 
                              size="small" 
                              variant="outlined" 
                            />
                            <Typography variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Quick Actions */}
        <Box flex={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<ApiIcon />}
                  fullWidth
                >
                  Deploy New Service
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SecurityIcon />}
                  fullWidth
                >
                  Security Audit
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SettingsIcon />}
                  fullWidth
                >
                  Configure Settings
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">API Gateway</Typography>
                  <Chip label="Healthy" color="success" size="small" />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Load Balancer</Typography>
                  <Chip label="Healthy" color="success" size="small" />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Database</Typography>
                  <Chip label="Warning" color="warning" size="small" />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Cache Server</Typography>
                  <Chip label="Healthy" color="success" size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default YARPCDashboard;
