// Custom Next.js server with Socket.io support
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Prepare Next.js app
app.prepare().then(() => {
  // Create HTTP server with Socket.io
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request', err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    // Set transports to prefer WebSocket
    transports: ['websocket', 'polling'],
  });

  // Track connected clients
  const connectedClients = new Set();

  // Socket.io event handlers
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    connectedClients.add(socket.id);

    // Broadcast reveal event to all other clients
    socket.on('reveal_updated', (data) => {
      console.log('Reveal updated:', data);
      // Send to all clients except the sender
      socket.broadcast.emit('reveal_updated', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      connectedClients.delete(socket.id);
    });
  });

  // Start server
  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Socket.io running on ws://${hostname}:${port}`);
  });
});
