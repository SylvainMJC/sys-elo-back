const { Match } = require('../models/match');

// Créer un nouveau match
exports.createMatch = async (req, res) => {
    try {
        const match = await Match.create(req.body);
        res.status(201).json(match);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtenir tous les matchs
exports.getAllMatches = async (req, res) => {
    try {
        const matches = await Match.findAll();
        res.status(200).json(matches);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtenir un match par ID
exports.getMatchById = async (req, res) => {
    try {
        const match = await Match.findByPk(req.params.id);
        if (match) {
            res.status(200).json(match);
        } else {
            res.status(404).json({ error: 'Match not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Mettre à jour un match
exports.updateMatch = async (req, res) => {
    try {
        const [updated] = await Match.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedMatch = await Match.findByPk(req.params.id);
            res.status(200).json(updatedMatch);
        } else {
            res.status(404).json({ error: 'Match not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer un match
exports.deleteMatch = async (req, res) => {
    try {
        const deleted = await Match.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send('Match deleted');
        } else {
            res.status(404).json({ error: 'Match not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
