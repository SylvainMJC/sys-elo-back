const User = require("../models/user");
const Status = require("../models/status");
const redis= require("../config/redis");
const Match = require("../models/match");

// const EloCalculator = require("../functions/eloCalculate");

class MatchService {
  constructor(MatchModel) {
    this.Match = MatchModel;
  }

  async createMatch(player1Id, player2Id, statusName) {
    try {
      const player1 = await User.findByPk(player1Id);
      const player2 = await User.findByPk(player2Id);
      const status = await Status.findOne({ where: { name: statusName } });

      if (!player1 || !player2) {
        throw new Error("Un ou plusieurs joueurs sont introuvables.");
      }

      if (!status) {
        throw new Error("Le statut spécifié est introuvable.");
      }

      const match = await this.Match.create({
        player1: player1.id,
        player2: player2.id,
        id_status: status.id,
      });

      return match;
    } catch (error) {
      throw new Error(`Error creating match: ${error.message}`);
    }
  }

  async getMatches() {
    try {
      return await this.Match.findAll();
    } catch (error) {
      throw new Error(`Error fetching all matches: ${error.message}`);
    }
  }

  async getMatchById(id) {
    if (!id) {
      return null;
    }
    try {
      return await this.Match.findByPk(id);
    } catch (error) {
      throw new Error(`Error fetching match with ID ${id}: ${error.message}`);
    }
  }

  async updateMatch(id, data) {
    if (!id) {
      return null;
    }

    try {
      const match = await this.Match.findByPk(id);
      if (!match) {
        throw new Error(`Match with ID ${id} not found.`);
      }

      const { result_player1, result_player2, id_status } = data;

      if (
        typeof result_player1 !== "number" ||
        typeof result_player2 !== "number"
      ) {
        throw new Error("Results must be valid numbers.");
      }

      if (result_player1 === undefined || result_player1 === undefined) {
        throw new Error(
          `Error updating match: result_player1 and result_player2 are required:  ${error.message}`
        );
      }

      match.result_player1 = result_player1;
      match.result_player2 = result_player2;
      match.id_status = id_status;

      return await match.save();
    } catch (error) {
      throw new Error(`Error updating match with ID ${id}: ${error.message}`);
    }
  }

  async patchMatchStatus(id, id_status) {
    if (!id) {
      return null;
    }

    try {
      const match = await this.Match.findByPk(id);
      if (!match) {
        throw new Error(`Match with ID ${id} not found.`);
      }
      match.id_status = id_status;

      return await match.save();
    } catch (error) {
      throw new Error(`Error updating match with ID ${id}: ${error.message}`);
    }
  }

  async deleteMatch(id) {
    if (!id) {
      return null;
    }
    try {
      const match = await this.Match.findByPk(id);
      if (!match) {
        return null;
      }
      return await match.destroy();
    } catch (error) {
      throw new Error(`Error deleting match with ID ${id}: ${error.message}`);
    }
  }


  //redis
  async startMatch(id) {
    const match = await this.Match.findByPk(id);
    if (!match) throw new Error("Match not found");

    const inProgressStatus = await Status.findOne({ where: { name: "In Progress" } });
    if (!inProgressStatus) throw new Error("Status 'In Progress' not found.");

    match.id_status = inProgressStatus.id;
    await match.save();

    const key = `match:${id}`;

    await redis.set(`${key}:status`, "In Progress");
    await redis.hSet(key, {
      result_player1: 0,
      result_player2: 0,
    });

  return match;
}


  async updateLiveScore(idMatch, score1, score2) {
    const key = `match:${idMatch}`;
    const score = await redis.hGetAll(key);

    if (Object.keys(score).length === 0) {
      throw new Error("Match live data not found");
    }

    await redis.hSet(key, {
      result_player1: score1,
      result_player2: score2,
    });

    return {
      matchId: idMatch,
      result_player1: score1,
      result_player2: score2,
    };
  }

  async endMatch(matchId) {
    const key = `match:${matchId}`;
    const [score, status] = await Promise.all([
      redis.hGetAll(key),
      redis.get(`${key}:status`)
    ]);

    if (!score || Object.keys(score).length === 0) {
      throw new Error("No live data found for this match.");
    }

    const match = await Match.findByPk(matchId);

    if (!match) {
      throw new Error("Match not found in the database.");
    }

    // Update Postgres fields
    match.result_player1 = parseInt(score.result_player1, 10);
    match.result_player2 = parseInt(score.result_player2, 10);
    match.id_status = 3; // ← à adapter si 3 = "Finished"

    await match.save();

    // Clean up Redis
    await Promise.all([
      redis.del(key),
      redis.del(`${key}:status`)
    ]);

    return {
      message: "Match ended. Data saved in Postgres and removed from Redis.",
      matchId,
      result_player1: match.result_player1,
      result_player2: match.result_player2
    };
  }

  async getLiveMatchData(idMatch) {
    const key = `match:${idMatch}`;
    const [score, status] = await Promise.all([
      redis.hGetAll(key),
      redis.get(`${key}:status`)
    ]);

    if (!score || Object.keys(score).length === 0) {
      throw new Error("Live match data not found");
    }

    return {
      matchId: idMatch,
      result_player1: parseInt(score.result_player1, 10),
      result_player2: parseInt(score.result_player2, 10),
      status
    };
  }

}

module.exports = MatchService;
