const MatchService = require("../services/matchService");
const UserService = require("../services/userService");
const { Match } = require("../models/match");
const { User } = require("../models/user");

class MatchController {
  constructor(matchService, userService) {
    this.matchService = matchService;
    this.userService = userService;
  }

  async createMatch(req, res) {
    try {
      const match = await this.matchService.createMatch(req.body);
      res.status(201).json(match);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllMatches(req, res) {
    try {
      const matches = await this.matchService.getMatches();
      for (const match of matches) {
        const id1 = match.player1;
        const id2 = match.player2;

        // Fetch users in parallel
        const [user1, user2] = await Promise.all([
          this.userService.getUserById(id1),
          this.userService.getUserById(id2),
        ]);

        // Replace ids with user objects if found
        if (user1) match.player1 = user1;
        if (user2) match.player2 = user2;
      }
      res.status(200).json(matches);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMatchById(req, res) {
    try {
      const match = await this.matchService.getMatchById(req.params.id);
      if (match) {
        const id1 = match.player1;
        const id2 = match.player2;
        const [user1, user2] = await Promise.all([
          this.userService.getUserById(id1),
          this.userService.getUserById(id2),
        ]);
        if (user1 && user2) {
          match.player1 = user1;
          match.player2 = user2;
        }

        res.status(200).json(match);
      } else {
        res.status(404).json({ error: "Match not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateMatch(req, res) {
    try {
      const updatedMatch = await this.matchService.updateMatch(
        req.params.id,
        req.body
      );
      if (updatedMatch) {
        res.status(200).json(updatedMatch);
      } else {
        res.status(404).json({ error: "Match not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteMatch(req, res) {
    try {
      const deleted = await this.matchService.deleteMatch(req.params.id);
      if (deleted) {
        res.status(204).send("Match deleted");
      } else {
        res.status(404).json({ error: "Match not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = MatchController;
