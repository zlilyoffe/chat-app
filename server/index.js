const http = require ('http');
const express = require ('express');
const socketio = require ('socket.io');
const cors = require('cors');


const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = process.env.PORT || 5000;
//check
const router = require('./router');
const { Console } = require('console');
const { cpSync } = require('fs');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });
app.use(cors());


io.on('connection', (socket) => {
    socket.on('join',({name, room}, callback)=> {
        const { error, user } = addUser({ id: socket.id, name, room });

        if(error) return callback(error);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!` });

        socket.join(user.room);

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });


        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text:message });

        callback();
    });

socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user){
        io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.`})
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});

    }
    })
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

//    origin: 'https://6183b79aae22a8bb20d1df8d--clever-ardinghelli-efddf8.netlify.app'

