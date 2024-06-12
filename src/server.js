const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'source.html'));
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    const decodedMessage = message.toString('utf8'); // might be jank but it works /shrug
    console.log('Received:', decodedMessage);

    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(decodedMessage);
      }
    });
  });
});

const port = 42069;
server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
