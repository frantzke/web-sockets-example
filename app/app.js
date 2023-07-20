const socket = io('ws://localhost:8080');

socket.on('message', (text) => {
  const el = document.createElement('li');
  el.innerHTML = text;
  document.querySelector('ul').appendChild(el);
});

const input = document.querySelector('input');

const emitText = () => {
    const text = input.value;
    socket.emit('message', text);
    input.value = '';
}

document.querySelector('button').onclick = emitText;

input.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    emitText();
  }
});
