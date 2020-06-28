const db = require('../database/dao');
const {
    sql
} = require('../database/dao');

const insertMatch = (match) => {
    db.insert('matchs', match, result => {
        if (result.error)
            throw result.error
    });
}

const qtdWins = (username) => {
    const SQL_QTD_WINS = `SELECT COUNT(winner) as wins FROM matchs
                        WHERE winner = "${username}";`;
    return result = db.run(SQL_QTD_WINS)[0].wins;
}

const qtdLoses = (username) => {
    const SQL_QTD_LOSES = `SELECT COUNT(loser) as loses FROM matchs
                        WHERE loser = "${username}";`;
    return result = db.run(SQL_QTD_LOSES)[0].loses;
}

const totalScore = (username) => {
    const SQL_TOTAL_SCORE = `SELECT COALESCE(SUM(score), 0) as score FROM matchs
                            WHERE winner = "${username}";`;
    return result = db.run(SQL_TOTAL_SCORE)[0].score;
}

const scoreRate = (username) => {
    const wins = qtdWins(username);
    const loses = qtdLoses(username);
    if (wins || loses)
        return ((wins * 100) / (wins + loses)).toFixed(2);
    else
        return 0;
}

const rankUser = (username) => {
    return {
        username: username,
        wins: qtdWins(username),
        loses: qtdLoses(username),
        scoreRate: scoreRate(username),
        totalScore: totalScore(username)
    }
}

const bestScore = () => {
    const SQL_BEST_SCORE = `SELECT winner as username, SUM(score) AS totalScore FROM matchs
                            GROUP BY username
                            ORDER BY totalScore DESC
                            LIMIT 10;`;
    const bScore = db.run(SQL_BEST_SCORE);
    bScore.forEach(user => {
        user.wins = qtdWins(user.username);
        user.loses = qtdLoses(user.username);
        user.scoreRate = scoreRate(user.username);
    });
    return bScore
}

const moreWins = () => {
    const SQL_MORE_WINS = `SELECT winner as username, count(winner) as wins FROM matchs
                            GROUP BY username
                            ORDER BY wins DESC
                            LIMIT 10;`;
    const mWins = db.run(SQL_MORE_WINS);
    mWins.forEach(user => {
        user.loses = qtdLoses(user.username);
        user.scoreRate = scoreRate(user.username);
        user.totalScore = totalScore(user.username);
    });
    return mWins;
}

const wellBottom = () => {
    const SQL_WEEL_BOTTOM = `SELECT winner as username, sum(score) as totalScore,
                        count(winner) as wins FROM matchs
                        GROUP BY username
                        ORDER BY totalScore / wins
                        LIMIT 10;`;
    const wBottom = db.run(SQL_WEEL_BOTTOM);
    wBottom.forEach(user => {
        user.loses = qtdLoses(user.username);
        user.scoreRate = scoreRate(user.username);
    });
    return wBottom;
}

module.exports.insert = insertMatch;
module.exports.rankUser = rankUser;
module.exports.bestScore = bestScore;
module.exports.moreWins = moreWins;
module.exports.wellBottom = wellBottom;