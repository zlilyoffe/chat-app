const http = require ('http');
const express = require ('express');
const socketio = require ('socket.io');

const PORT = process.env.PORT || 5000;

const router = require('./router');
const { Console } = require('console');
const { cpSync } = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('we have new connection!');

    socket.on('join',({name, room}, callback)=> {
        console.log(name, room);
    });
    socket.on('join', ({ name, room }) => {
        console.log(name, room);
    });

    socket.on('disconnect', () => {
        console.log('user had left!');
    })
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
