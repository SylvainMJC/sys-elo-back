const express = require('express');
const router = express.Router();


module.exports = (userController) => {
    
    
    router.post('/', (req, res) => userController.createUser(req, res));

    return router;
};
