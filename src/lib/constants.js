const { mapShips } = require('./mapShips')

module.exports = {
  SOCKET_DISCONNECT: 'disconnect',
  SOCKET_CONNECTION: 'connection',
  SOCKET_START_GAME: 'start',
  SOCKET_NEW_PLAYER: 'new_player',
  CANVAS_WIDTH: '700px',
  CANVAS_HEIGHT: '600px',
  SHIPS_MAP: mapShips()
}
