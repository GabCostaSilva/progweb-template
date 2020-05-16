window.onload = function() {
  let canvas = document.getElementById('board-canvas');
  let context = canvas.getContext('2d');
  let width = canvas.width = 600;
  let height = canvas.height = 800;

  drawBoard()

  /**
   *
   * Function to draw the game board
   */

  function drawBoard() {
    let y = 90;
    let x = 90;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#fff";
    context.fillRect(50, 50, 402, 402);

    for (let i = 0; i < 9; i++) {
      /* draws vertical lines */
      context.beginPath();
      context.moveTo(50, y);
      context.lineTo(452, y);

      context.strokeStyle = "black 1px";
      context.stroke();

      /* draws horizontal lines */
      context.beginPath();
      context.moveTo(x, 50);
      context.lineTo(x, 452);

      context.strokeStyle = "black 1px";
      context.stroke();
      y += 40;
      x += 40;
    }

    y = 42;
    x = 40;
    context.font = "15px Arial";
    context.textAlign = "center";

    for (let i = 1; i <= 10; i++) {
      context.fillText(String.fromCharCode(64 + i), 40, (y += 40));
      context.fillText(i.toString(), (x += 38), 45);
    }
  }

  drawBoard()
}
