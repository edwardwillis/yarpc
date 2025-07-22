import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Button,
  Box,
  Avatar,
  Typography,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Login, Logout, Person } from '@mui/icons-material';

export const Auth0LoginButton: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    error
  } = useAuth0();

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" p={2}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ ml: 1 }}>
          Loading authentication...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Authentication error: {error.message}
      </Alert>
    );
  }

  if (isAuthenticated && user) {
    return (
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={user.picture}
            alt={user.name || 'User'}
            sx={{ width: 32, height: 32 }}
          >
            <Person />
          </Avatar>
          <Box>
            <Typography variant="subtitle2">
              Welcome, {user.name || user.email}!
            </Typography>
            <Chip 
              label="Authenticated via Auth0" 
              color="success" 
              size="small"
              variant="outlined"
            />
          </Box>
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
    );
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Chip 
        label="Not authenticated" 
        color="default" 
        variant="outlined"
      />
      <Button
        variant="contained"
        startIcon={<Login />}
        onClick={() => loginWithRedirect()}
      >
        Login
      </Button>
    </Box>
  );
};

export default Auth0LoginButton;
