

const MatchService = require('../services/matchService');
const { Match } = require('../models/match');

class MatchController {
    constructor(matchService) {
        this.matchService = matchService;
        console.error(this.matchService, 'this.matchService')
    }

    async createMatch(req, res) {
        try {

            
            const match = await this.matchService.createMatch(req.body);
            console.log(match, 'match')
            res.status(201).json(match);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAllMatches(req, res) {
        try {
            const matches = await this.matchService.getMatches();
            res.status(200).json(matches);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getMatchById(req, res) {
        try {
            const match = await this.matchService.getMatchById(req.params.id);
            if (match) {
                res.status(200).json(match);
            } else {
                res.status(404).json({ error: 'Match not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateMatch(req, res) {
        try {
            const updatedMatch = await this.matchService.updateMatch(req.params.id, req.body);
            if (updatedMatch) {
                res.status(200).json(updatedMatch);
            } else {
                res.status(404).json({ error: 'Match not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteMatch(req, res) {
        try {
            const deleted = await this.matchService.deleteMatch(req.params.id);
            if (deleted) {
                res.status(204).send('Match deleted');
            } else {
                res.status(404).json({ error: 'Match not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = MatchController;
