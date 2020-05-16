export default function() {
    let board_matrix = new Array(10)

    let x0 = 50
    let y0 = 50
    let x1 = 50
    let y1 = 50

    for (let i = 0; i < 10; i++) {
      board_matrix[i] = new Array(10);

      for (let j = 0; j < 10; j++) {
        x1 = x0 + 40,
        y1 = y0 + 40
        board_matrix[i][j] = {
          x0: x0,
          y0: y0,
          x1: x1,
          y1: y1,
          filled: false
        };
        x0 += 40
      }
      x0 = 0
      y0 += 40
    }
    return board_matrix
}
