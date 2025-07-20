import { useState } from 'react'
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Fab,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material'
import { Login, Logout, Add } from '@mui/icons-material'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import AuthDialog from './components/AuthDialog'

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
  const [count, setCount] = useState(0)
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState('')

  const handleLogin = async (username: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simple validation for demo - replace with real authentication
        if (username === 'admin' && password === 'password') {
          setIsLoggedIn(true)
          setCurrentUser(username)
          resolve()
        } else {
          reject(new Error('Invalid username or password'))
        }
      }, 1000)
    })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser('')
  }

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
            Vite + React
          </Typography>
        </Box>
        
        {/* Authentication Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Authentication Status
            </Typography>
            {isLoggedIn ? (
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2}>
                  <Chip 
                    label={`Welcome, ${currentUser}!`} 
                    color="success" 
                    variant="filled"
                  />
                </Box>
                <Button 
                  variant="outlined" 
                  startIcon={<Logout />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Chip 
                  label="You are not logged in" 
                  color="default" 
                  variant="outlined"
                />
                <Button 
                  variant="contained" 
                  startIcon={<Login />}
                  onClick={() => setIsAuthDialogOpen(true)}
                >
                  Login
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box textAlign="center">
              <Typography variant="h4" gutterBottom>
                Count: {count}
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => setCount((count) => count + 1)}
                sx={{ mb: 2 }}
              >
                Increment Counter
              </Button>
              <Typography variant="body2" color="text.secondary">
                Edit <code>src/App.tsx</code> and save to test HMR
              </Typography>
            </Box>
          </CardContent>
        </Card>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          textAlign="center" 
          mt={3}
        >
          Click on the Vite and React logos to learn more
        </Typography>
        
        {/* Floating Action Button */}
        <Fab 
          color="primary" 
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setCount(count + 1)}
        >
          <Add />
        </Fab>
        
        {/* Authentication Dialog */}
        <AuthDialog
          isOpen={isAuthDialogOpen}
          onClose={() => setIsAuthDialogOpen(false)}
          onLogin={handleLogin}
          title="Login to Your Account"
        />
      </Container>
    </ThemeProvider>
  )
}

export default App
