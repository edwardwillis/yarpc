import { ErrorBoundary } from 'react-error-boundary';
import { Alert, Box, Button, Typography } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="200px"
      p={3}
    >
      <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 400 }}>
        <Typography variant="h6" gutterBottom>
          Authentication Error
        </Typography>
        <Typography variant="body2" paragraph>
          {error?.message || 'Something went wrong with authentication.'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={resetErrorBoundary}
          size="small"
        >
          Try Again
        </Button>
      </Alert>
    </Box>
  );
}

interface Auth0ErrorBoundaryProps {
  children: React.ReactNode;
}

export default function Auth0ErrorBoundary({ children }: Auth0ErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Auth0 Error Boundary caught an error:', error, errorInfo);
      }}
      onReset={() => {
        // Optional: Add any cleanup logic here
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
