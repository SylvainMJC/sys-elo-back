const { Status } = require('../models/status');

// Créer un nouveau statut
exports.createStatus = async (req, res) => {
    try {
        const status = await Status.create(req.body);
        res.status(201).json(status);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtenir tous les statuts
exports.getAllStatuses = async (req, res) => {
    try {
        const statuses = await Status.findAll();
        res.status(200).json(statuses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtenir un statut par ID
exports.getStatusById = async (req, res) => {
    try {
        const status = await Status.findByPk(req.params.id);
        if (status) {
            res.status(200).json(status);
        } else {
            res.status(404).json({ error: 'Status not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Mettre à jour un statut
exports.updateStatus = async (req, res) => {
    try {
        const [updated] = await Status.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedStatus = await Status.findByPk(req.params.id);
            res.status(200).json(updatedStatus);
        } else {
            res.status(404).json({ error: 'Status not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer un statut
exports.deleteStatus = async (req, res) => {
    try {
        const deleted = await Status.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send('Status deleted');
        } else {
            res.status(404).json({ error: 'Status not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
