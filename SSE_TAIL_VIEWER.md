# SSE Tail Viewer Component

A React component that connects to Server-Sent Events (SSE) endpoints and displays messages in real-time, similar to the Unix `tail` command.

## Features

- 🔗 **Async Connection Control** - Connect/disconnect with button controls
- 📡 **Real-time Streaming** - Displays SSE messages as they arrive
- 📜 **Tail-like Display** - Shows messages in chronological order with auto-scroll
- 🏷️ **Event Type Support** - Handles different SSE event types (message, error, heartbeat, custom)
- 💾 **Message Persistence** - Configurable message buffer with automatic cleanup
- 📥 **Export Functionality** - Download messages as text file
- 🎨 **Material-UI Design** - Clean, professional interface
- ⚙️ **Configurable Options** - Customizable endpoint, max messages, auto-scroll, timestamps

## Usage

### Basic Implementation

```tsx
import SSETailViewer from './components/SSETailViewer';

function App() {
  return (
    <SSETailViewer 
      defaultEndpoint="/api/events"
      maxMessages={1000}
      autoScroll={true}
      showTimestamps={true}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultEndpoint` | `string` | `"/api/events"` | Default SSE endpoint URL |
| `maxMessages` | `number` | `1000` | Maximum number of messages to keep in memory |
| `autoScroll` | `boolean` | `true` | Automatically scroll to show new messages |
| `showTimestamps` | `boolean` | `true` | Display timestamps for each message |

## SSE Server Example

Here's a simple Node.js/Express server that provides SSE:

```javascript
// server.js
const express = require('express');
const app = express();

app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Send initial connection message
  res.write(`data: Connected to SSE stream\\n\\n`);

  // Send periodic messages
  const interval = setInterval(() => {
    const timestamp = new Date().toISOString();
    res.write(`id: ${Date.now()}\\n`);
    res.write(`event: message\\n`);
    res.write(`data: [${timestamp}] Server message ${Math.random()}\\n\\n`);
  }, 2000);

  // Send heartbeat every 30 seconds
  const heartbeat = setInterval(() => {
    res.write(`event: heartbeat\\n`);
    res.write(`data: 💓 Heartbeat\\n\\n`);
  }, 30000);

  // Cleanup on connection close
  req.on('close', () => {
    clearInterval(interval);
    clearInterval(heartbeat);
  });
});

app.listen(3001, () => {
  console.log('SSE server running on port 3001');
});
```

## Message Format

The component expects SSE messages in this format:

```typescript
interface SSEMessage {
  id: string;          // Unique message ID
  timestamp: Date;     // When the message was received
  data: string;        // Message content
  event?: string;      // Event type (message, error, heartbeat, custom)
  retry?: number;      // Retry interval
}
```

## Event Types

The component handles several event types:

- **`message`** - Standard SSE messages (default)
- **`error`** - Error events (displayed with red styling)
- **`heartbeat`** - Keep-alive messages
- **Custom events** - Any custom event types you define

## Features in Detail

### Connection Management
- Connect/disconnect buttons with visual status indicators
- Automatic reconnection handling
- Connection state tracking

### Message Display
- Monospace font for consistent formatting
- Color-coded event types
- Timestamps (toggleable)
- Auto-scroll to latest messages
- Maximum message limit with automatic cleanup

### Controls
- Clear messages button
- Export messages to text file
- Configurable endpoint input
- Real-time connection status

### Error Handling
- Connection error display
- Graceful disconnection
- Server disconnection handling

## Testing with curl

You can test your SSE endpoint with curl:

```bash
# Test SSE endpoint
curl -N -H "Accept: text/event-stream" http://localhost:3001/api/events

# Expected output:
# data: Connected to SSE stream
#
# id: 1640995200000
# event: message
# data: [2021-12-31T12:00:00.000Z] Server message 0.123456
```

## Integration with YARPC

This component is perfect for monitoring:
- RPC call logs
- Service health status
- Real-time metrics
- Error monitoring
- System events

Add it to your YARPC dashboard for real-time monitoring!
