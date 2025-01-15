
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

router.get('/debug-route', (req, res) => {
    res.send('User route is working');
});

module.exports = (userController) => {

    router.get('/', (req, res) =>userController.getAllUsers(req, res));
    router.get('/:id', (req, res) =>userController.getUserById(req, res));
    // router.post('/register', (req, res) => userController.createUser(req, res));
    router.put('/:id', (req, res) => userController.updateUser(req, res));
    router.delete('/:id', (req, res) => userController.deleteUser(req, res));

    return router
}
