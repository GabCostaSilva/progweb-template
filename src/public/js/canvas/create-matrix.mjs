export default function() {
    let board_matrix = new Array(10)

    let x = 50
    let y = 50

    for (let i = 0; i < 10; i++) {
      board_matrix[i] = new Array(10);
      for (let j = 0; j < 10; j++) {
        board_matrix[i][j] = {
          x: x,
          y: y,
          filled: false
        };
        x += 40
      }
      x = 50
      y += 40
    }
    return board_matrix
}
