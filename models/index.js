const sequelize = require('../config/db');
const Match = require('..models/Match');
const User = require('..models/user'); 
const Status = require('./status');

// Ajoutez les modèles à un objet
const models = {
    Match, User, Status,
    role, login,userRole
};

// Appelez la méthode `associate` pour chaque modèle qui en a une
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

module.exports = models;
