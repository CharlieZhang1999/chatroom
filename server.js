const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const formatMessage = require('./utils/message');
const { format } = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// db
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.DB_CONNECT, () => console.log('connected to db!'));

// json parse
app.use(express.json());

// routes
const authRoute = require('./routes/auth');
const messageRoute = require('./routes/message');

app.use('/api/user', authRoute);
app.use('/api/message', messageRoute);

const botName = 'Chat Bot';

// set path
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    // Welcome current user
    // socket.emit('message', formatMessage(botName,'Welcome to chatroom!'));

    // to all the client except the client that is connecting
    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'));

    // when client disconnect
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user has disconnected'));
    })

    // Listen for chat message from main.js
    // Then send signal to main.js so that main.js can append the message 
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage(msg.username, msg.text));
    })
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

