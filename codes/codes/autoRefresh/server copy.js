const express = require('express');
const cors = require('cors');
const path = require('path');
const net = require('net');

const app = express();
const PORT = 4000;

app.use(cors());
// Route to generate and send random data
app.use(express.static(path.join(__dirname, 'public')));
app.get('/randomData', (req, res) => {
    
   // Create a TCP server
const server = net.createServer((socket) => {
            // Connection callback
            console.log('Client connected');

            // Handle incoming data
            socket.on('data', (data) => {
                console.log('Received data:', data.toString());
                // You can process the received data here
            });

            // Handle connection termination
            socket.on('end', () => {
                console.log('Client disconnected');
            });

            // Handle errors
            socket.on('error', (err) => {
                console.error('Socket error:', err);
            });
        });

        // Handle server errors
        server.on('error', (err) => {
            console.error('Server error:', err);
        });

        // Start listening on a specific port
        const PORT = 23; // Change to your desired port number
        server.listen(PORT,'192.168.3.34', () => {
            console.log('Server listening on port', PORT);
        });
});

app.listen(PORT,'192.168.1.104', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});