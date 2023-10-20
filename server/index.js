const WebSocketServer = require('ws').Server;
const url = require('url');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const wsServer = new WebSocketServer({ server: server });


//Example Express Server
let counter = 0;

app.get('/increment', (req, res) => {
  counter++;
  res.status(200).json({ counter });
});

app.get('/decrement', (req, res) => {
  counter--;
  res.status(200).json({ counter });
});


app.get('/clients', (req, res) => {
  const clients = Array.from(wsServer.clients).map((client) => {
    return { userId: client.userId, readyState: client.readyState };
  });
  console.log('app.get ~ clients:', clients);
  res.status(200).json(clients);
});

const sendAll = (message) => {
  wsServer.clients.forEach((client) => {
    client.send(message);
  });
};

wsServer.on('connection', function (connection, request) {
  const queryData = url.parse(request.url, true).query;
  const userId = queryData.userId || 'Unknown';

  connection.userId = userId;
  sendAll(`User ${userId} connected`);

  connection.send(`Private: Welcome to the chat ${userId}!`);

  connection.on('message', (message) => {
    console.log(message);
    sendAll(`${userId}: ${message}`);
  });

  connection.on('close', (reason) => {
    console.log('user disconnected');
    console.log('reason:', reason);
    sendAll(`User ${userId} disconnected`);
  });

  connection.onerror = function () {
    console.log('websocket error');
  };
});

server.listen(8080, () => console.log('listening on http://localhost:8080'));
