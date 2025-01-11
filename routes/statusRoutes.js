const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

module.exports = (statusController) => {
    router.post('/', (req, res) => statusController.createStatus(req, res));
    router.get('/', (req, res) => statusController.getAllStatuses(req, res));
    router.get('/:id', (req, res) => statusController.getStatusById(req, res));
    router.put('/:id', (req, res) => statusController.updateStatus(req, res));
    router.delete('/:id', (req, res) => statusController.deleteStatus(req, res));

    return router;
}
