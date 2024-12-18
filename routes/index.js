const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const roleRoutes = require('./roleRoutes');
const userRoleRoutes = require('./userRoleRoutes');
const statusRoutes = require('./statusRoutes');
const matchRoutes = require('./matchRoutes');

// Utiliser les routes spécifiques
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/userRoles', userRoleRoutes);
router.use('/statuses', statusRoutes);
router.use('/matches', matchRoutes);

module.exports = router;
