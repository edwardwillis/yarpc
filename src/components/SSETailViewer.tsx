import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Alert,
  Chip,
  IconButton,
  Paper,
  Divider,
  Autocomplete,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Clear,
  Download,
  Circle,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface SSEMessage {
  id: string;
  timestamp: Date;
  data: string;
  event?: string;
  retry?: number;
}

interface SSEParameters {
  connection: string;
  date: string;
  tags: number[];
  search: string;
}

interface SSETailViewerProps {
  defaultEndpoint?: string;
  maxMessages?: number;
  autoScroll?: boolean;
  showTimestamps?: boolean;
}

export const SSETailViewer: React.FC<SSETailViewerProps> = ({
  defaultEndpoint = '/api/events',
  maxMessages = 1000,
  autoScroll = true,
  showTimestamps = true,
}) => {
  const [endpoint, setEndpoint] = useState(defaultEndpoint);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<SSEMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connectionCount, setConnectionCount] = useState(0);
  const [lastEventId, setLastEventId] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState('');

  // SSE Parameters
  const [parameters, setParameters] = useState<SSEParameters>({
    connection: '',
    date: '',
    tags: [],
    search: '',
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Available connection types and dates
  const availableConnections = ['websocket', 'http', 'grpc', 'tcp', 'redis', 'mqtt'];
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Build URL with query parameters
  const buildUrl = useCallback((params: SSEParameters): string => {
    const url = new URL(endpoint, window.location.origin);
    
    if (params.connection) {
      url.searchParams.set('connection', params.connection);
    }
    
    if (params.date) {
      url.searchParams.set('date', params.date);
    }
    
    if (params.tags.length > 0) {
      url.searchParams.set('tags', params.tags.join(','));
    }
    
    if (params.search) {
      url.searchParams.set('search', params.search);
    }
    
    return url.toString();
  }, [endpoint]);

  // Fetch available dates from the API
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch('/dates');
        if (response.ok) {
          const dates = await response.json();
          setAvailableDates(dates);
        } else {
          console.warn('Failed to fetch dates from /dates endpoint');
        }
      } catch (error) {
        console.error('Error fetching dates:', error);
      }
    };

    fetchDates();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [autoScroll]);

  // Add new message to the list
  const addMessage = useCallback((newMessage: SSEMessage) => {
    setMessages(prev => {
      const updated = [...prev, newMessage];
      // Keep only the last maxMessages
      if (updated.length > maxMessages) {
        return updated.slice(-maxMessages);
      }
      return updated;
    });
  }, [maxMessages]);

  // Connect to SSE endpoint
  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      return; // Already connected
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Build URL with parameters and Last-Event-ID if available
      const url = new URL(buildUrl(parameters), window.location.origin);
      if (lastEventId) {
        url.searchParams.set('lastEventId', lastEventId);
      }

      const eventSource = new EventSource(url.toString());
      eventSourceRef.current = eventSource;

      // Connection opened
      eventSource.onopen = () => {
        console.log('🔗 SSE Connection opened');
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionCount(prev => prev + 1);
        setError(null);
      };

      // Handle incoming messages
      eventSource.onmessage = (event) => {
        const message: SSEMessage = {
          id: event.lastEventId || crypto.randomUUID(),
          timestamp: new Date(),
          data: event.data,
          event: event.type,
        };

        setLastEventId(event.lastEventId);
        addMessage(message);
      };

      // Handle custom events
      eventSource.addEventListener('error', (event: MessageEvent) => {
        const message: SSEMessage = {
          id: crypto.randomUUID(),
          timestamp: new Date(),
          data: event.data || 'SSE Error event received',
          event: 'error',
        };
        addMessage(message);
      });

      eventSource.addEventListener('heartbeat', (event: MessageEvent) => {
        const message: SSEMessage = {
          id: crypto.randomUUID(),
          timestamp: new Date(),
          data: event.data || '💓 Heartbeat',
          event: 'heartbeat',
        };
        addMessage(message);
      });

      // Connection error
      eventSource.onerror = (event) => {
        console.error('❌ SSE Connection error:', event);
        
        if (eventSource.readyState === EventSource.CLOSED) {
          setError('Connection closed by server');
          setIsConnected(false);
          setIsConnecting(false);
        } else if (eventSource.readyState === EventSource.CONNECTING) {
          setError('Reconnecting to server...');
          setIsConnecting(true);
        } else {
          setError('Connection error occurred');
          setIsConnected(false);
          setIsConnecting(false);
        }
      };

    } catch (err) {
      console.error('Failed to create SSE connection:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setIsConnecting(false);
    }
  }, [buildUrl, parameters, lastEventId, addMessage]);

  // Disconnect from SSE endpoint
  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setError(null);
    console.log('🔌 SSE Connection closed');
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setLastEventId(null);
  }, []);

  // Export messages as text file
  const exportMessages = useCallback(() => {
    const content = messages
      .map(msg => {
        const timestamp = showTimestamps 
          ? `[${msg.timestamp.toISOString()}] ` 
          : '';
        const event = msg.event && msg.event !== 'message' 
          ? `(${msg.event}) ` 
          : '';
        return `${timestamp}${event}${msg.data}`;
      })
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sse-messages-${new Date().toISOString().slice(0, 19)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [messages, showTimestamps]);

  // Auto-scroll effect
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const getStatusColor = () => {
    if (isConnecting) return 'warning';
    if (isConnected) return 'success';
    if (error) return 'error';
    return 'default';
  };

  const getStatusText = () => {
    if (isConnecting) return 'Connecting...';
    if (isConnected) return 'Connected';
    if (error) return 'Disconnected';
    return 'Not Connected';
  };

  return (
    <Card sx={{ maxWidth: '100%', height: '600px', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6">SSE Tail Viewer</Typography>
            <Chip 
              icon={<Circle />} 
              label={getStatusText()} 
              color={getStatusColor()}
              size="small"
            />
          </Box>
        }
        action={
          <Box display="flex" gap={1}>
            <IconButton onClick={clearMessages} disabled={messages.length === 0}>
              <Clear />
            </IconButton>
            <IconButton onClick={exportMessages} disabled={messages.length === 0}>
              <Download />
            </IconButton>
          </Box>
        }
      />
      
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Connection Controls */}
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="SSE Endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            disabled={isConnected || isConnecting}
            fullWidth
            size="small"
            placeholder="/api/events"
          />
          <Button
            variant={isConnected ? "outlined" : "contained"}
            color={isConnected ? "error" : "primary"}
            onClick={isConnected ? disconnect : connect}
            disabled={isConnecting}
            startIcon={isConnected ? <Stop /> : <PlayArrow />}
            sx={{ minWidth: 120 }}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </Box>

        {/* SSE Parameters */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Query Parameters
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2}>
            <Box sx={{ minWidth: 200 }}>
              <Autocomplete
                size="small"
                options={availableConnections}
                value={parameters.connection}
                onChange={(_, newValue) => {
                  const newParams = { ...parameters, connection: newValue || '' };
                  setParameters(newParams);
                  if (isConnected) {
                    disconnect();
                    setTimeout(() => connect(), 100);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Connection"
                    placeholder="Select connection type"
                  />
                )}
              />
            </Box>
            
            <Box sx={{ minWidth: 200 }}>
              <Autocomplete
                size="small"
                options={availableDates}
                value={parameters.date}
                onChange={(_, newValue) => {
                  const newParams = { ...parameters, date: newValue || '' };
                  setParameters(newParams);
                  if (isConnected) {
                    disconnect();
                    setTimeout(() => connect(), 100);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Date"
                    placeholder="Select date"
                  />
                )}
              />
            </Box>
              
              <Box sx={{ minWidth: 200 }}>
                <TextField
                  size="small"
                  label="Add Tag"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newTagInput.trim()) {
                      const tagNum = parseInt(newTagInput.trim());
                      if (!isNaN(tagNum) && !parameters.tags.includes(tagNum)) {
                        const newParams = { 
                          ...parameters, 
                          tags: [...parameters.tags, tagNum].sort((a, b) => a - b) 
                        };
                        setParameters(newParams);
                        setNewTagInput('');
                        if (isConnected) {
                          disconnect();
                          setTimeout(() => connect(), 100);
                        }
                      }
                    }
                  }}
                  placeholder="Enter tag number"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (newTagInput.trim()) {
                            const tagNum = parseInt(newTagInput.trim());
                            if (!isNaN(tagNum) && !parameters.tags.includes(tagNum)) {
                              const newParams = { 
                                ...parameters, 
                                tags: [...parameters.tags, tagNum].sort((a, b) => a - b) 
                              };
                              setParameters(newParams);
                              setNewTagInput('');
                              if (isConnected) {
                                disconnect();
                                setTimeout(() => connect(), 100);
                              }
                            }
                          }
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    ),
                  }}
                />
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {parameters.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onDelete={() => {
                        const newParams = { 
                          ...parameters, 
                          tags: parameters.tags.filter(t => t !== tag) 
                        };
                        setParameters(newParams);
                        if (isConnected) {
                          disconnect();
                          setTimeout(() => connect(), 100);
                        }
                      }}
                      deleteIcon={<DeleteIcon />}
                    />
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ minWidth: 200 }}>
                <TextField
                  size="small"
                  fullWidth
                  label="Search"
                  value={parameters.search}
                  onChange={(e) => {
                    const newParams = { ...parameters, search: e.target.value };
                    setParameters(newParams);
                    // Debounce the reconnection for search
                    if (isConnected) {
                      disconnect();
                      setTimeout(() => connect(), 500);
                    }
                  }}
                  placeholder="Search term"
                />
              </Box>
            </Box>
          </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Connection Info */}
        {isConnected && (
          <Box display="flex" gap={2} flexWrap="wrap">
            <Chip label={`Messages: ${messages.length}`} size="small" />
            <Chip label={`Connections: ${connectionCount}`} size="small" />
            {lastEventId && (
              <Chip label={`Last ID: ${lastEventId.slice(0, 8)}...`} size="small" />
            )}
          </Box>
        )}

        {/* Messages Display */}
        <Paper 
          ref={containerRef}
          sx={{ 
            flex: 1, 
            overflow: 'auto', 
            p: 1, 
            backgroundColor: '#1e1e1e', 
            color: '#ffffff',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
          }}
        >
          {messages.length === 0 ? (
            <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              {isConnected ? 'Waiting for messages...' : 'Connect to start receiving messages'}
            </Typography>
          ) : (
            <Box>
              {messages.map((message, index) => (
                <Box key={message.id} sx={{ mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    {showTimestamps && (
                      <Typography 
                        variant="caption" 
                        sx={{ color: '#888', minWidth: 180, fontFamily: 'monospace' }}
                      >
                        {message.timestamp.toISOString()}
                      </Typography>
                    )}
                    {message.event && message.event !== 'message' && (
                      <Chip 
                        label={message.event} 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          height: 20, 
                          fontSize: '0.7rem',
                          color: message.event === 'error' ? '#f44336' : '#2196f3'
                        }}
                      />
                    )}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace', 
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                      }}
                    >
                      {message.data}
                    </Typography>
                  </Box>
                  {index < messages.length - 1 && <Divider sx={{ my: 0.5, opacity: 0.3 }} />}
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
          )}
        </Paper>

        {/* Footer Info */}
        <Typography variant="caption" color="text.secondary">
          Max messages: {maxMessages} | Auto-scroll: {autoScroll ? 'On' : 'Off'} | 
          Timestamps: {showTimestamps ? 'On' : 'Off'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SSETailViewer;
