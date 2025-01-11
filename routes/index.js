const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const roleRoutes = require('./roleRoutes');
const userRoleRoutes = require('./userRoleRoutes');
const statusRoutes = require('./statusRoutes');
const matchRoutes = require('./matchRoutes');

const registerRoutes = require('./registerRoutes');
const loginRoutes = require('./loginRoutes');
const logoutRoutes = require('./logoutRoutes');


router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/userRoles', userRoleRoutes);
router.use('/statuses', statusRoutes);
router.use('/matches', matchRoutes);
router.use('/login', loginRoutes);
router.use('/logout', logoutRoutes);
router.use('/register', registerRoutes);

module.exports = router;
