const path = require('path');
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
  connections.push(socket.id)

  socket.on('message', (message) => {
    console.log(message);
    io.emit('message', `${socket.id.substr(0, 4)}: ${message}`);
  });


  socket.on('disconnect', (reason) => {
    console.log('user disconeected');
    console.log('reason:', reason);
  });
});

http.listen(8080, () => console.log('listening on http://localhost:8080'));
