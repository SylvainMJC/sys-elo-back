const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', auth, isAdmin, statusController.createStatus);
router.get('/', auth, isAdmin, statusController.getAllStatuses);
router.get('/:id', auth, isAdmin, statusController.getStatusById);
router.put('/:id', auth, isAdmin, statusController.updateStatus);
router.delete('/:id', auth, isAdmin, statusController.deleteStatus);

module.exports = router;
