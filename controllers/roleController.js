const { Role } = require('../models/role');

// Créer un nouveau rôle
exports.createRole = async (req, res) => {
    try {
        const role = await Role.create(req.body);
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtenir tous les rôles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json(roles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtenir un rôle par ID
exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (role) {
            res.status(200).json(role);
        } else {
            res.status(404).json({ error: 'Role not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Mettre à jour un rôle
exports.updateRole = async (req, res) => {
    try {
        const [updated] = await Role.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedRole = await Role.findByPk(req.params.id);
            res.status(200).json(updatedRole);
        } else {
            res.status(404).json({ error: 'Role not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer un rôle
exports.deleteRole = async (req, res) => {
    try {
        const deleted = await Role.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send('Role deleted');
        } else {
            res.status(404).json({ error: 'Role not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
