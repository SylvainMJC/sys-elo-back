const { UserRole } = require('../models/userRole');

// Créer une nouvelle relation utilisateur-rôle
exports.createUserRole = async (req, res) => {
    try {
        const userRole = await UserRole.create(req.body);
        res.status(201).json(userRole);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtenir toutes les relations utilisateur-rôle
exports.getAllUserRoles = async (req, res) => {
    try {
        const userRoles = await UserRole.findAll();
        res.status(200).json(userRoles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtenir une relation utilisateur-rôle par ID
exports.getUserRoleById = async (req, res) => {
    try {
        const userRole = await UserRole.findByPk(req.params.id);
        if (userRole) {
            res.status(200).json(userRole);
        } else {
            res.status(404).json({ error: 'UserRole not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Mettre à jour une relation utilisateur-rôle
exports.updateUserRole = async (req, res) => {
    try {
        const [updated] = await UserRole.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedUserRole = await UserRole.findByPk(req.params.id);
            res.status(200).json(updatedUserRole);
        } else {
            res.status(404).json({ error: 'UserRole not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer une relation utilisateur-rôle
exports.deleteUserRole = async (req, res) => {
    try {
        const deleted = await UserRole.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send('UserRole deleted');
        } else {
            res.status(404).json({ error: 'UserRole not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
