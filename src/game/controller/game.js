const Match = require('../models/Match');
const Turn = require('../models/Turn');
const Player = require('../models/Player');
const ships = require('../libs/ships');
const board = require('../libs/board');
const matchDB = require('../../controller/match');

const matches = {};

const newGame = (room, players) => {
    players.p1.emit('room', room)
    players.p2.emit('room', room)
}
const join = (room, playerName, socket) => {
    if (matches[room]) {
        if (matches[room][playerName]) {
            socket.emit('alreadyInRoom');
            return;
        }
        matches[room].player2 = playerName;
        matches[room][playerName] = new Player(socket);
        setTimeout(() => {
            startGame(room);
        }, 200);
    } else {
        matches[room] = new Match();
        matches[room].player1 = playerName;
        matches[room][playerName] = new Player(socket);
        socket.emit('waitPlayer');
    }
}

const playHere = (room, playerName, socket) => {
    matches[room][playerName].socket.disconnect();
    matches[room][playerName].socket = socket;
    if (matches[room].start)
        resumeGame(room, playerName)
}
const startGame = (room) => {
    let player1 = matches[room].player1;
    let player2 = matches[room].player2;

    matches[room].turn = new Turn(player1, player2);

    createBoard(room, player1);
    createBoard(room, player2);

    matches[room][player1].socket.broadcast.to(room).emit('startGame', room);
    matches[room][player1].socket.emit('startGame', room);

    console.log('game started!');

    setTimeout(() => {
        matches[room].start = true;
        changeTurn(room);
    }, 1000);
}

const resumeGame = (room, playerName) => {
    matches[room][playerName].socket.emit('resumeGame',
        matches[room][playerName].hit,
        matches[room][playerName].miss,
        matches[room][playerName].sink,
        matches[room][playerName].score);
    if (matches[room].turn.getMe() == playerName) {
        matches[room][playerName].socket.emit('youTurn');
    } else {
        matches[room][playerName].socket.emit('opponentTurn');
    }
}

const finishGame = (room) => {
    let me = matches[room].turn.getMe();
    let he = matches[room].turn.getHe();
    matches[room][he].socket.emit('win');
    matches[room][he].socket.disconnect();
    matches[room][me].socket.emit('lose');
    matches[room][me].socket.disconnect();
    matches[room].start = false;
    saveMatch(me, he, room);
    setTimeout(() => {
        delete matches[room];
    }, 3000);
}

const saveMatch = (winner, loser, room) => {
    let match = {
        winner: winner,
        loser: loser,
        score: matches[room][winner].score,
        timestamp: Date.now()
    }
    matchDB.insert(match);
}

const isStarted = (room) => {
    return matches[room].start;
}

const existMatch = (room) => {
    return matches[room];
}

const createBoard = (room, playerName) => {
    let player = matches[room][playerName]
    player.ships = ships();
    player.board = board(player.ships);
}

const destroyed = (ship) => {
    return ship.filter(part => part.status == 'ok')
        .length == 0;
}

const sink = (room, playerName, ship) => {
    let shipId = [];
    ship.forEach(part => {
        setSink(room, playerName, part.position);
        shipId.push(part.position);
    });
    matches[room][playerName].socket.emit('sink', shipId);
}

const verifyShips = (room, playerName) => {
    const opponent = matches[room].turn.getHe();
    const ships = matches[room][opponent].ships;
    for (let i = 0; i < ships.length; i++) {
        let ship = ships[i];
        if (destroyed(ship)) {
            ships.splice(i, 1);
            sink(room, playerName, ship);
        }
    }
    if (allDestroyed(room, playerName)) {
        finishGame(room);
    }
}

const updateScore = (playerName) => {
    playerName.score += playerName.multi++;
}

const sendScore = (room, playerName) => {
    let score = matches[room][playerName].score;
    matches[room][playerName].socket.emit('updateScore', score);
}

const sendHit = (room, playerName, id) => {
    matches[room][playerName].socket.emit('hit', id);
}

const sendMiss = (room, playerName, id) => {
    matches[room][playerName].socket.emit('miss', id);
}

const setHit = (room, playerName, id) => {
    matches[room][playerName].hit.push(id);
}

const setMiss = (room, playerName, id) => {
    matches[room][playerName].miss.push(id);
}

const setSink = (room, playerName, id) => {
    matches[room][playerName].hit.pop(id);
    matches[room][playerName].sink.push(id);
}

const changeTurn = (room) => {
    matches[room].turn.next();
    let me = matches[room].turn.getMe();
    let he = matches[room].turn.getHe();
    if (isStarted(room)) {
        matches[room][me].socket.emit('youTurn');
        matches[room][he].socket.emit('opponentTurn');
    }
}

const shot = (room, playerName, id) => {
    const opponent = matches[room].turn.getHe();
    let board = matches[room][opponent].board;
    let i = (id / 10) | 0; // pick a right value
    let j = id % 10; // pick a left value
    if (matches[room].turn.getMe() != playerName) {
        matches[room][playerName].socket.emit('NotIsYouTurn');
    } else if (board[i][j] == 'hited') {
        matches[room][playerName].socket.emit('AlreadyHit');
    } else if (board[i][j] !== undefined) {
        board[i][j].status = 'destroyed';
        board[i][j] = 'hited';
        setHit(room, playerName, id);
        updateScore(matches[room][playerName]);
        sendScore(room, playerName);
        sendHit(room, playerName, id);
        verifyShips(room, playerName);
        changeTurn(room);
    } else {
        setMiss(room, playerName, id);
        board[i][j] = 'hited';
        matches[room][playerName].multi = 1;
        sendMiss(room, playerName, id);
        changeTurn(room);
    }
}

const allDestroyed = (room, playerName) => {
    return (matches[room][playerName]
        .ships.length == 0);
}

exports.join = join;
exports.shot = shot;
exports.playHere = playHere;
exports.existMatch = existMatch;
exports.isStarted = isStarted;
exports.start = startGame;
exports.newGame = newGame;