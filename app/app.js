let socket;

const connectToServer = () => {
  const userId = document.getElementById('userIdInput').value;
  socket = io(`ws://localhost:8080?userId=${userId}`);

  document.getElementById('messageInput').style.display = "inline-block	";
  document.getElementById('messageButton').style.display = "inline-block	";
  document.getElementById('userIdInput').style.display = "none";
  document.getElementById('connectButton').style.display = "none";

  socket.on('connect', () => {
    console.log(`You've connected with id: ${socket.id}`);
  });

  socket.on('message', (text) => {
    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul').appendChild(el);
  });
};

const userIdInput = document.getElementById('userIdInput');
const connectButton = document.getElementById('connectButton');
connectButton.onclick = connectToServer;

const emitText = () => {
  const text = messageInput.value;
  socket.emit('message', text);
  messageInput.value = '';
};

const messageInput = document.getElementById('messageInput');
messageInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    emitText();
  }
});
messageInput.style.display = 'none';

const messageButton = document.getElementById('messageButton');
messageButton.onclick = emitText;
messageButton.style.display = 'none';

