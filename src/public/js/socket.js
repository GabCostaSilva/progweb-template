/** SOCKET */
function handleHit(id, score) {
  let sqr = document.getElementById(id);
  let scr = document.getElementById('score');

  scr.innerText = score;
  sqr.classList.add('hit');
}

function handleMiss(id) {
  let sqr = document.getElementById(id);
  sqr.classList.add('miss');
}

function handleSink(id){
  let sqr = document.getElementById(id);
  sqr.classList.add('sink')
}

function delayAlert(m, time){
  setTimeout(function(){
    alert(m)
  }, time);
}

function handleVictory() {
  delayAlert('You Win!!!', 100);
}

socket.on('hit', handleHit);
socket.on('miss', handleMiss);
socket.on('sink', handleSink);
socket.on('won', handleVictory);