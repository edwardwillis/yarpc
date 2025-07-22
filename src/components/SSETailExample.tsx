import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import SSETailViewer from './SSETailViewer';

/**
 * Example usage of the SSETailViewer component
 * This demonstrates how to integrate the SSE tail viewer into your application
 */
export const SSETailExample: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Server-Sent Events Tail Viewer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor real-time events from your SSE endpoint, similar to the Unix tail command.
        </Typography>
      </Box>

      {/* Basic usage */}
      <SSETailViewer 
        defaultEndpoint="/api/events"
        maxMessages={500}
        autoScroll={true}
        showTimestamps={true}
      />

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Usage Examples:
        </Typography>
        <Typography variant="body2" component="pre" sx={{ 
          backgroundColor: '#f5f5f5', 
          p: 2, 
          borderRadius: 1,
          overflow: 'auto'
        }}>
{`// Basic usage
<SSETailViewer defaultEndpoint="/api/events" />

// With custom settings
<SSETailViewer 
  defaultEndpoint="/api/logs"
  maxMessages={1000}
  autoScroll={true}
  showTimestamps={true}
/>

// For monitoring application logs
<SSETailViewer 
  defaultEndpoint="/api/app-logs"
  maxMessages={2000}
  autoScroll={false}
  showTimestamps={true}
/>`}
        </Typography>
      </Box>
    </Container>
  );
};

export default SSETailExample;
