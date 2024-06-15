const express = require('express');
const cors = require('cors');
const net = require('net');

const app = express();
const PORT = 4000;

// Enable CORS
app.use(cors());

// Create a TCP server
const tcpServer = net.createServer((socket) => {
    console.log('TCP client connected');

    // Handle incoming data from TCP client
    socket.on('data', (data) => {
        console.log('Received data from TCP client:', data.toString());

        // Broadcast the received data to all connected WebSocket clients
        io.emit('tcpData', data.toString());
    });

    // Handle disconnection of TCP client
    socket.on('end', () => {
        console.log('TCP client disconnected');
    });
});

// Listen for TCP connections on port 9000
const TCP_PORT = 23;
tcpServer.listen(TCP_PORT,'192.168.3.33', () => {
    console.log(`TCP server is running on port ${TCP_PORT}`);
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Create a WebSocket server
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

// WebSocket connection handler
io.on('connection', (socket) => {
    console.log('WebSocket client connected');

    // Send initial message to WebSocket client
    socket.emit('message', 'Welcome to the WebSocket server');

    // Handle disconnection of WebSocket client
    socket.on('disconnect', () => {
        console.log('WebSocket client disconnected');
    });
});

// Route to send data received from TCP server to WebSocket clients
app.get('/tcpData', (req, res) => {
    // Send back a response indicating that the data will be received via WebSocket
    res.send('Data will be received via WebSocket');
});

// Start the HTTP server
httpServer.listen(PORT,'192.168.1.104', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
