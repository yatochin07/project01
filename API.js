// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

// Inisialisasi Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Gunakan body parser untuk menangani request body
app.use(bodyParser.json());

// Database sementara (untuk user dan channel)
let users = [];
let channels = [
    { id: 1, name: 'General' },
    { id: 2, name: 'Gaming' }
];

// Endpoint untuk daftar user
app.post('/register', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    // Simulasi pendaftaran user
    const user = { id: users.length + 1, username };
    users.push(user);
    res.status(201).json(user);
});

// Endpoint untuk login user
app.post('/login', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    const user = users.find(user => user.username === username);

    if (user) {
        return res.status(200).json(user);
    } else {
        return res.status(404).json({ message: 'User not found' });
    }
});

// Endpoint untuk mengambil daftar channel
app.get('/channels', (req, res) => {
    res.status(200).json(channels);
});

// Endpoint untuk membuat channel baru
app.post('/channels', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Channel name is required' });
    }

    const newChannel = { id: channels.length + 1, name };
    channels.push(newChannel);
    res.status(201).json(newChannel);
});

// Mengatur socket.io untuk komunikasi real-time
let userSockets = {}; // Menyimpan user yang terhubung dengan socket

io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Ketika user bergabung dengan channel
    socket.on('join_channel', (channelId, username) => {
        userSockets[socket.id] = { username, channelId };
        socket.join(channelId);
        console.log(`${username} joined channel ${channelId}`);
    });

    // Ketika user mengirim pesan
    socket.on('send_message', (message) => {
        const user = userSockets[socket.id];
        if (user) {
            const { username, channelId } = user;
            console.log(`Message from ${username} in channel ${channelId}: ${message}`);
            // Mengirim pesan ke semua user di channel yang sama
            io.to(channelId).emit('receive_message', { username, message });
        }
    });

    // Ketika user disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        delete userSockets[socket.id];
    });
});

// Menjalankan server pada port 3000
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
