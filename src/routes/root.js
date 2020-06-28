express = require('express');
router = express.Router();

const rooms = require('../controller/room');
const auth = require('../middleware/authenticator');
const online = require('../controller/online');
const match = require('../controller/match');


router.get('/', auth, (req, res) => {
    return res.render('home.ejs');
});

router.get('/ranking', (req, res) => {
    res.render('ranking.ejs', {
        user: match.rankUser(req.session.user),
        bestScore: match.bestScore(),
        moreWins: match.moreWins(),
        wellBottom: match.wellBottom()
    });
});

router.get('/r/public/:id', auth, (req, res) => {
    try {
        rooms.check(req.params.id, req.session.user);
        return res.render('game.ejs');
    } catch (e) {
        if (e == "RoomDoesNotExistException") {
            res.status(404).render('error.ejs', {
                tittle: 'Não Encontrado',
                error_tittle: 'Sala não encontrada',
                error_msg: 'Parece que a sala que você solicitou não existe mais.'
            });

        } else if (e == "AlreadyInRoomException") {
            res.status(403).render('error.ejs', {
                tittle: 'Erro',
                error_tittle: 'Você já está na sala',
                error_msg: 'Parece que você já está com a sala aberta em outra aba.'
            });

        } else if (e == "FullRoomException") {
            res.status(403).render('error.ejs', {
                tittle: 'Erro',
                error_tittle: 'A sala atingiu seu limite',
                error_msg: 'A sala que você está tentando acessar, já está em jogo.'
            });
        } else {
            throw e;
        }
    }
});

router.get('/logout', auth, (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.use((req, res, next) => {
    res.status(404).render('error.ejs', {
        tittle: '404 - Não Encontrado',
        error_tittle: '404 - Página não encontrada.',
        error_msg: 'Parece que a página que você solicitou não existe, ou está temporariamente indisponível.'
    });
});

module.exports = router;
