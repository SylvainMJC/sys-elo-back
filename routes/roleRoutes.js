const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', auth, isAdmin, roleController.createRole);
router.get('/', auth, isAdmin, roleController.getAllRoles);
router.get('/:id', auth, isAdmin, roleController.getRoleById);
router.put('/:id', auth, isAdmin, roleController.updateRole);
router.delete('/:id', auth, isAdmin, roleController.deleteRole);

module.exports = router;
