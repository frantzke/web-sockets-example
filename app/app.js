let socket;
let webSocket;

const connectToServer = () => {
  const userId = document.getElementById('userIdInput').value;
  webSocket = new WebSocket(`ws://localhost:8080?userId=${userId}`);

  document.getElementById('messageInput').style.display = 'inline-block	';
  document.getElementById('messageButton').style.display = 'inline-block	';
  document.getElementById('userIdInput').style.display = 'none';
  document.getElementById('connectButton').style.display = 'none';

  webSocket.onmessage = (event) => {
    console.log(event);
    const el = document.createElement('li');
    el.innerHTML = event.data;
    document.querySelector('ul').appendChild(el);
  };

  webSocket.addEventListener("open", () => {
    console.log("Connected to server");
  });
};

const userIdInput = document.getElementById('userIdInput');
const connectButton = document.getElementById('connectButton');
connectButton.onclick = connectToServer;

const emitText = () => {
  const text = messageInput.value;
  webSocket.send(text);
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
