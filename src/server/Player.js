class Player {
  constructor(name, socketID) {

    this.name = name
    this.socketID = socketID
  }
  /**
   * Creates a new Player object.
   * @param {string} name The display name of the player
   * @param {string} socketID The associated socket ID
   * @return {Player}
   */

  static create(name, socketID) {
    return new Player(name, socketID);
  }
}

module.exports = Player
