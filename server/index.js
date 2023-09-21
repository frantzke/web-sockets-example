const express = require('express');
const app = express();
const http = require('http').createServer(app);

//Example Express Server
const connections = [];
let counter = 0;

app.get('/increment', (req, res) => {
  counter++;
  res.status(200).json({ counter });
});

app.get('/decrement', (req, res) => {
  counter--;
  res.status(200).json({ counter });
});

app.get('/connections', (req, res) => {
  res.status(200).json(connections);
});


const io = require('socket.io')(http, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  connections.push(socket.id);
  const userId = socket.handshake.query.userId || "Unknown";
  io.emit("message", `User ${userId} connected`);

  socket.on('message', (message) => {
    console.log(message);
    io.emit('message', `${userId}: ${message}`);
    // socket.broadcast.emit('message', `Broadcast Message`); //Send to everyone BUT this socket
  });

  socket.join(userId);
  io.to(userId).emit('message', `Private: Welcome to the chat ${userId}!`);

  socket.on('disconnect', (reason) => {
    console.log('user disconnected');
    console.log('reason:', reason);
    io.emit('message', `User ${userId} disconnected`);
  });
});

http.listen(8080, () => console.log('listening on http://localhost:8080'));
