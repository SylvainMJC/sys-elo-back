const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/userRoleController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', auth, isAdmin, userRoleController.createUserRole);
router.get('/', auth, isAdmin, userRoleController.getAllUserRoles);
router.get('/:id', auth, isAdmin, userRoleController.getUserRoleById);
router.put('/:id', auth, isAdmin, userRoleController.updateUserRole);
router.delete('/:id', auth, isAdmin, userRoleController.deleteUserRole);

module.exports = router;
