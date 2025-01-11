const express = require('express');

const MatchController = require('../controllers/matchController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');


module.exports = (matchController) => {
    const router = express.Router();
    
    router.post('/',  matchController.createMatch.bind(matchController));
    router.get('/',  matchController.getAllMatches.bind(matchController));;
    router.get('/:id',  matchController.getMatchById.bind(matchController));
    router.put('/:id',  matchController.updateMatch.bind(matchController));
    router.delete('/:id',  matchController.deleteMatch.bind(matchController));

    return router;
};

