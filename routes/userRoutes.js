const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController'); 
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

// Route pour la connexion
router.post('/login', authController.login); 
// Routes pour les utilisateurs
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, isAdmin, userController.deleteUser);

module.exports = router;
