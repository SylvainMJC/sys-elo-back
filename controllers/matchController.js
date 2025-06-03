const redis = require("../config/redis");
const Match = require("../models/match");
const discordNotificationService = require("../services/discordNotificationService");
const eloService = require("../services/eloService");

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

    // 🎯 Récupérer les joueurs pour la notification Discord
    const [player1, player2] = await Promise.all([
      this.userService.getUserById(match.player1),
      this.userService.getUserById(match.player2)
    ]);

    if (!player1 || !player2) {
      return res.status(404).json({ error: "Joueurs non trouvés" });
    }

    // ✅ Convertir les ELO en nombres pour la notification
    const player1Safe = {
      ...player1.toJSON(),
      elo: parseInt(player1.elo) || 1500
    };
    
    const player2Safe = {
      ...player2.toJSON(),
      elo: parseInt(player2.elo) || 1500
    };

    match.result_player1 = result_player1;
    match.result_player2 = result_player2;
    match.id_status = 2; // "In Progress"

    await match.save();

    // ✅ Définir la clé Redis AVANT de l'utiliser
    const key = `match:${matchId}`;

    // ✅ Mise à jour de Redis
    await Promise.all([
      redis.hSet(key, {
        result_player1,
        result_player2,
      }),
      redis.set(`${key}:status`, 'In Progress'),
    ]);

    const startNotification = await discordNotificationService.sendMatchStartNotification(
      match, 
      player1Safe, 
      player2Safe
    ).catch(err => {
      console.warn('⚠️ Erreur notification début match:', err.message);
      return { success: false, errors: [err.message] };
    });

    console.log(`🚀 Match #${matchId} démarré: ${player1Safe.username} vs ${player2Safe.username}`);
    console.log(`📢 Discord start: ${startNotification.success ? '✅' : '❌'}`);

    res.status(200).json({ 
      message: 'Match started and data saved to Redis',
      match: {
        id: match.id,
        player1: player1Safe,
        player2: player2Safe,
        status: 'In Progress'
      },
      notification: {
        discordSent: startNotification.success,
        details: startNotification
      }
    });
  } catch (error) {
    console.error('❌ Erreur startMatch:', error);
    res.status(500).json({ error: error.message });
  }
}

  async updateLiveScore(req, res) {
    const { result_player1, result_player2 } = req.body;
    const matchId = req.params.id;

    try {
      const updatedData = await this.matchService.updateLiveScore(
        matchId,
        result_player1,
        result_player2
      );
      res.status(200).json(updatedData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getLiveMatchData(req, res) {
    try {
      const liveData = await this.matchService.getLiveMatchData(req.params.id);
      res.status(200).json(liveData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // 🚀 NOUVELLE VERSION SIMPLIFIÉE avec service unifié
  async endMatch(req, res) {
    try {
      const matchId = req.params.id;
      
      const endedMatch = await this.matchService.endMatch(matchId);
      
      const [player1, player2] = await Promise.all([
        this.userService.getUserById(endedMatch.player1),
        this.userService.getUserById(endedMatch.player2)
      ]);

      if (!player1 || !player2) {
        return res.status(404).json({ error: "Joueurs non trouvés" });
      }

      const player1Safe = {
        ...player1.toJSON(),
        elo: parseInt(player1.elo) || 1500
      };
      
      const player2Safe = {
        ...player2.toJSON(),
        elo: parseInt(player2.elo) || 1500
      };

      console.log(`🔢 ELO avant calcul: P1=${player1Safe.elo} (${typeof player1Safe.elo}), P2=${player2Safe.elo} (${typeof player2Safe.elo})`);

      const eloResult = eloService.calculateMatchResult(
        player1Safe, 
        player2Safe, 
        endedMatch.result_player1, 
        endedMatch.result_player2
      );

      console.log(`📊 ELO après calcul: Winner=${eloResult.winner.newElo} (${typeof eloResult.winner.newElo}), Loser=${eloResult.loser.newElo} (${typeof eloResult.loser.newElo})`);

      await Promise.all([
        this.userService.updateUserElo(player1.id, eloResult.winner.newElo),
        this.userService.updateUserElo(player2.id, eloResult.loser.newElo)
      ]);

      const matchForDiscord = {
        ...endedMatch,
        duration: this.calculateMatchDuration(endedMatch.created_at, endedMatch.updated_at)
      };

      const matchNotification = await discordNotificationService.sendMatchNotification(
        matchForDiscord, 
        eloResult.winner, 
        eloResult.loser
      ).catch(err => {
        console.warn('⚠️ Erreur notification match:', err.message);
        return { success: false, errors: [err.message] };
      });

      const milestoneNotifications = [];
      if (eloResult.winner.milestonesReached.length > 0) {
        for (const milestone of eloResult.winner.milestonesReached) {
          const milestoneResult = await discordNotificationService.sendEloMilestone(
            eloResult.winner, 
            milestone
          ).catch(err => {
            console.warn('⚠️ Erreur milestone Discord:', err.message);
            return { success: false, milestone, errors: [err.message] };
          });
          milestoneNotifications.push(milestoneResult);
        }
      }

      let rankUpNotification = null;
      if (eloResult.winner.rankUp) {
        rankUpNotification = await discordNotificationService.sendSpecialNotification(
          'rank_up',
          '🎉 Montée de Rang !',
          `**${eloResult.winner.username}** vient de passer ${eloResult.winner.oldRank} → **${eloResult.winner.newRank}** !`,
          0x00ff00
        ).catch(err => {
          console.warn('⚠️ Erreur rank up Discord:', err.message);
          return { success: false, type: 'rank_up', errors: [err.message] };
        });
      }

      let upsetNotification = null;
      if (eloResult.match.upset) {
        upsetNotification = await discordNotificationService.sendSpecialNotification(
          'upset',
          '🎭 Upset !',
          `**${eloResult.winner.username}** (${eloResult.winner.oldElo}) bat **${eloResult.loser.username}** (${eloResult.loser.oldElo}) ! Quelle surprise !`,
          0xff6b6b
        ).catch(err => {
          console.warn('⚠️ Erreur upset Discord:', err.message);
          return { success: false, type: 'upset', errors: [err.message] };
        });
      }

      const enrichedResult = {
        match: endedMatch,
        eloChanges: eloResult,
        notifications: {
          discordSent: matchNotification.success,
          discordDetails: {
            match: matchNotification,
            milestones: milestoneNotifications,
            rankUp: rankUpNotification,
            upset: upsetNotification
          },
          milestonesTriggered: eloResult.winner.milestonesReached.length,
          rankUp: eloResult.winner.rankUp,
          upset: eloResult.match.upset
        }
      };

      console.log(`✅ Match #${matchId} terminé avec notifications Discord`);
      console.log(`📊 ELO: ${eloResult.winner.username} +${eloResult.winner.eloChange}, ${eloResult.loser.username} ${eloResult.loser.eloChange}`);
      console.log(`📢 Discord: ${matchNotification.success ? '✅' : '❌'} | Milestones: ${milestoneNotifications.length} | RankUp: ${!!rankUpNotification} | Upset: ${!!upsetNotification}`);

      res.status(200).json(enrichedResult);
    } catch (error) {
      console.error('❌ Erreur endMatch:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // Méthode utilitaire pour calculer la durée du match
  calculateMatchDuration(startTime, endTime) {
    if (!startTime || !endTime) return 'Non disponible';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    
    if (durationMinutes < 60) {
      return `${durationMinutes} min`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return `${hours}h ${minutes}min`;
    }
  }

  // ===== NOUVELLES ROUTES DISCORD POUR LE FRONTEND =====

  /**
   * Route pour tester les connexions Discord
   * GET /api/matches/discord/test
   */
  async testDiscordConnections(req, res) {
    try {
      const testResults = await discordNotificationService.testAllConnections();
      res.status(200).json(testResults);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message,
        details: discordNotificationService.getStatus()
      });
    }
  }

  /**
   * Route pour obtenir le statut Discord
   * GET /api/matches/discord/status
   */
  async getDiscordStatus(req, res) {
    try {
      const status = discordNotificationService.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Route pour simuler une notification Discord
   * POST /api/matches/discord/simulate
   */
  async simulateDiscordNotification(req, res) {
    try {
      // Données de test
      const testMatch = {
        id: 999,
        result_player1: 21,
        result_player2: 19,
        duration: '25 min'
      };

      const testWinner = {
        id: 1,
        username: 'TestPlayer1',
        elo: 1463,
        oldElo: 1450,
        newElo: 1463,
        eloChange: 13,
        oldRank: 'Or',
        newRank: 'Or',
        rank: 'Or',
        rankUp: false,
        milestonesReached: []
      };

      const testLoser = {
        id: 2,
        username: 'TestPlayer2',
        elo: 1367,
        oldElo: 1380,
        newElo: 1367,
        eloChange: -13,
        oldRank: 'Or',
        newRank: 'Or',
        rank: 'Or',
        rankUp: false,
        milestonesReached: []
      };

      const result = await discordNotificationService.sendMatchNotification(
        testMatch, 
        testWinner, 
        testLoser
      );

      res.status(200).json({
        success: true,
        message: 'Notification de test envoyée',
        result: result
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  /**
   * Route pour tester les statistiques quotidiennes Discord
   * POST /api/matches/discord/daily-stats
   */
  async testDailyStatistics(req, res) {
    try {
      // Données de test pour statistiques quotidiennes
      const statsData = {
        matchesToday: 15,
        activePlayers: 42,
        averageElo: 1350,
        topPlayers: [
          { username: 'Champion1', elo: 2100 },
          { username: 'Champion2', elo: 1950 },
          { username: 'Champion3', elo: 1850 },
          { username: 'Expert1', elo: 1750 },
          { username: 'Expert2', elo: 1650 }
        ]
      };

      const result = await discordNotificationService.sendDailyStatistics(statsData);

      res.status(200).json({
        success: true,
        message: 'Statistiques quotidiennes de test envoyées',
        result: result,
        data: statsData
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }
}

module.exports = MatchController;
