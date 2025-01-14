const MatchService = require("../services/matchService");
const UserService = require("../services/userService");
const StatusService = require("../services/statusService");
const { Match } = require("../models/match");
const { User } = require("../models/user");

class MatchController {
  constructor(matchService, userService, statusService) {
    this.matchService = matchService;
    this.userService = userService;
    this.statusService = statusService;
  }

  async createMatch(req, res) {
    try {
      const { player1, player2, statusName } = req.body;
      
      const match = await this.matchService.createMatch(
        parseInt(player1, 10),
        parseInt(player2, 10),
        statusName
      );
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
        const id_status = match.id_status;
        const [user1, user2, status] = await Promise.all([
          this.userService.getUserById(id1),
          this.userService.getUserById(id2),
          this.statusService.getStatusById(id_status),
        ]);
        if (user1) match.player1 = user1;
        if (user2) match.player2 = user2;
        if (status) match.id_status = status;
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
        const id_status = match.id_status;
        const [user1, user2, status] = await Promise.all([
          this.userService.getUserById(id1),
          this.userService.getUserById(id2),
          this.statusService.getStatusById(id_status),
        ]);
        if (user1) match.player1 = user1;
        if (user2) match.player2 = user2;
        if (status) match.id_status = status;

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
      const { result_player1, result_player2, id_status } = req.body;

      if (result_player1 === undefined || result_player2 === undefined) {
        throw new Error("Error updating match: result_player1 and result_player2 are required");
      }

      const data = { result_player1, result_player2, id_status };

      const updatedMatch = await this.matchService.updateMatch(
        req.params.id,
        data
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

  async patchMatch(req, res) {
    try {
      const id_status  = req.body;

      const patchedMatch = await this.matchService.patchMatch(
        req.params.id,
        id_status
      );
      if (patchedMatch) {
        console.log(id_status, 'id_status');
        res.status(200).json(patchedMatch);
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
