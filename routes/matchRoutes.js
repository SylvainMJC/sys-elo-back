const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', auth, isAdmin, matchController.createMatch);
router.get('/', auth, isAdmin, matchController.getAllMatches);
router.get('/:id', auth, isAdmin, matchController.getMatchById);
router.put('/:id', auth, isAdmin, matchController.updateMatch);
router.delete('/:id', auth, isAdmin, matchController.deleteMatch);

module.exports = router;
