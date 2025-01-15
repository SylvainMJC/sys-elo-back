const User = require("../models/user");
const Status = require("../models/Status");

const EloCalculator = require("../functions/eloCalculate");

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
}

module.exports = MatchService;
