const express = require('express');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

module.exports = (userRoleController) => {

    const router = express.Router();

    router.post('/', (req, res) => userRoleController.createUserRole(req, res));
    router.get('/', (req, res) => userRoleController.getAllUserRoles(req, res));
    router.get('/:id', (req, res) => userRoleController.getUserRoleById(req, res));
    router.put('/:id', (req, res) => userRoleController.updateUserRole(req, res));
    router.delete('/:id', (req, res) => userRoleController.deleteUserRole(req, res));

    return router;
};

