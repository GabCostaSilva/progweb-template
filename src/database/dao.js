
const sqlite = require('sqlite-sync');
sqlite.connect(__dirname + '/database.db3');


const SQL_CREATE_USERS = `CREATE TABLE IF NOT EXISTS Users(
    username TEXT PRIMARY KEY,
    password TEXT
);`;

const SQL_CREATE_MATCHS = `CREATE TABLE IF NOT EXISTS Matchs(
    matchId INTEGER PRIMARY KEY AUTOINCREMENT,
    winner TEXT,
    loser TEXT,
    score INTEGER,
    timestamp INTEGER,
    FOREIGN KEY(winner) REFERENCES User(username),
    FOREIGN KEY(loser) REFERENCES User(username)
);`;                    

sqlite.run(SQL_CREATE_USERS);
sqlite.run(SQL_CREATE_MATCHS);

module.exports = sqlite;