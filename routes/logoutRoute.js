const express = require('express');
const router = express.Router();


module.exports = (loginController) => {
    
    
    router.post('/', (req, res) => loginController.logoutUser(req, res));

    return router;
};
