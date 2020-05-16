const socket = io();

function createSquare(i, j) {
    let square = document.createElement('div');

    square.innerText = '';

    square.className = 'square sea';
    square.addEventListener('click', onClick)
    square.id = [i, j].join('');

    return square;
}

function onClick(event) {
  event.preventDefault()
  socket.emit('click', event.target.id)
}

(function createBoard() {
  let root = document.getElementById('root')
  if(root) {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        root.appendChild(createSquare(i, j));
      }
    }
  }
})()
