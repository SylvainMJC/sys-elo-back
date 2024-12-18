const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', userController.createUser);
router.get('/', auth, isAdmin, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, isAdmin, userController.deleteUser);

module.exports = router;
