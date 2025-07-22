import { useAuth0 } from '@auth0/auth0-react'
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress,
} from '@mui/material'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Auth0LoginButton from './components/Auth0LoginButton'
import YARPCDashboard from './components/YARPCDashboard'

// Create a Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const { isAuthenticated, isLoading } = useAuth0()

  // Show loading spinner while Auth0 is initializing
  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            minHeight="60vh"
          >
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    )
  }

  // If authenticated, show the YARPC Dashboard
  if (isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <YARPCDashboard />
      </ThemeProvider>
    )
  }

  // If not authenticated, show the login page

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box textAlign="center" mb={4}>
          <Box display="flex" justifyContent="center" gap={3} mb={3}>
            <Avatar
              src={viteLogo}
              alt="Vite logo"
              sx={{ width: 56, height: 56 }}
            />
            <Avatar
              src={reactLogo}
              alt="React logo"
              sx={{ width: 56, height: 56 }}
            />
          </Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to YARPC
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Yet Another Remote Procedure Call Platform
          </Typography>
        </Box>
        
        {/* Authentication Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Authentication Required
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please log in to access the YARPC Dashboard and manage your RPC services.
            </Typography>
            <Auth0LoginButton />
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  )
}

export default App
