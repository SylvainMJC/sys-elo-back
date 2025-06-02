const redis = require("../config/redis");
const Match = require("../models/match");
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
        throw new Error(
          "Error updating match: result_player1 and result_player2 are required"
        );
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

  async patchMatchStatus(req, res) {
    try {
      const id_status = req.body.status_id;
      const patchedMatch = await this.matchService.patchMatchStatus(
        req.params.id,
        id_status
      );
      if (patchedMatch) {
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
  
  //redis
  async startMatch(req, res) {
  const { result_player1, result_player2 } = req.body;
  const matchId = req.params.id;

  try {
    const match = await Match.findByPk(matchId);

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const score1 = result_player1 ?? 0;
    const score2 = result_player2 ?? 0;

    match.result_player1 = result_player1;
    match.result_player2 = result_player2;
    match.id_status = 2; 

    await match.save();

    
    const key = `match:${matchId}`;

    
    await Promise.all([
      redis.hSet(key, {
        result_player1,
        result_player2,
      }),
      redis.set(`${key}:status`, 'In Progress'),
    ]);

    res.status(200).json({ message: 'Match started and data saved to Redis' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



  // Mettre à jour les scores en live dans Redis
  async updateLiveScore(req, res) {
    try {
      const matchId = req.params.id;
      const { result_player1, result_player2 } = req.body;

      if (
        typeof result_player1 !== "number" ||
        typeof result_player2 !== "number"
      ) {
        throw new Error("result_player1 et result_player2 doivent être des nombres");
        
      }

      const updatedScore = await this.matchService.updateLiveScore(
        matchId,
        result_player1,
        result_player2
      );
      res.status(200).json(updatedScore);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Terminer le match (récupérer scores Redis, mettre à jour BDD, supprimer Redis)
  async endMatch(req, res) {
    try {
      const matchId = req.params.id;
      const endedMatch = await this.matchService.endMatch(matchId);
      res.status(200).json(endedMatch);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Récupérer le score en live depuis Redis
  async getLiveMatchData(req, res) {
  try {
    const liveData = await this.matchService.getLiveMatchData(req.params.id);
    res.status(200).json(liveData);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}




}

module.exports = MatchController;
