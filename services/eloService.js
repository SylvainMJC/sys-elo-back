class EloService {
  constructor() {
    // Constantes ELO
    this.K_FACTOR = 32; // Facteur K standard
    this.DEFAULT_ELO = 1200;
    
    // Seuils de rang
    this.RANK_THRESHOLDS = {
      'Bronze': 0,
      'Argent': 1000,
      'Or': 1300,
      'Platine': 1600,
      'Diamant': 1900,
      'Maître': 2200,
      'Grand Maître': 2500,
      'Légende': 2800
    };

    // Paliers pour notifications Discord
    this.MILESTONE_THRESHOLDS = [1500, 1600, 1700, 1800, 1900, 2000, 2200, 2500, 2800, 3000];
  }

  // Calcul du rang basé sur l'ELO
  getRankFromElo(elo) {
    const ranks = Object.entries(this.RANK_THRESHOLDS)
      .sort((a, b) => b[1] - a[1]); // Tri décroissant
    
    for (const [rank, threshold] of ranks) {
      if (elo >= threshold) {
        return rank;
      }
    }
    return 'Bronze';
  }

  // Calcul de la progression vers le prochain rang
  getProgressToNextRank(elo) {
    const currentRank = this.getRankFromElo(elo);
    const ranks = Object.entries(this.RANK_THRESHOLDS)
      .sort((a, b) => a[1] - b[1]); // Tri croissant
    
    const currentRankIndex = ranks.findIndex(([rank]) => rank === currentRank);
    if (currentRankIndex === ranks.length - 1) {
      return { 
        progress: 100, 
        nextRank: currentRank,
        eloNeeded: 0 
      };
    }

    const nextRank = ranks[currentRankIndex + 1];
    const currentThreshold = ranks[currentRankIndex][1];
    const nextThreshold = nextRank[1];
    
    const progress = Math.min(100, ((elo - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
    const eloNeeded = Math.max(0, nextThreshold - elo);
    
    return {
      progress: Math.round(progress),
      nextRank: nextRank[0],
      eloNeeded
    };
  }

  // Calcul de la probabilité de victoire
  calculateWinProbability(elo1, elo2) {
    return 1 / (1 + Math.pow(10, (elo2 - elo1) / 400));
  }

  // Calcul du changement d'ELO
  calculateEloChange(winnerElo, loserElo, actualScore = 1) {
    const expectedScore = this.calculateWinProbability(winnerElo, loserElo);
    const eloChange = Math.round(this.K_FACTOR * (actualScore - expectedScore));
    
    return {
      winner: Math.max(1, eloChange), // Minimum +1 pour une victoire
      loser: -Math.max(1, eloChange)  // Minimum -1 pour une défaite
    };
  }

  // Calcul complet pour un match avec toutes les infos
  calculateMatchResult(player1, player2, score1, score2) {
    const isPlayer1Winner = score1 > score2;
    const winner = isPlayer1Winner ? player1 : player2;
    const loser = isPlayer1Winner ? player2 : player1;
    
    // Calcul des changements ELO
    const eloChanges = this.calculateEloChange(winner.elo, loser.elo);
    
    // Nouveaux ELOs
    const winnerNewElo = winner.elo + eloChanges.winner;
    const loserNewElo = loser.elo + eloChanges.loser;
    
    // Rangs avant et après
    const winnerOldRank = this.getRankFromElo(winner.elo);
    const winnerNewRank = this.getRankFromElo(winnerNewElo);
    const loserOldRank = this.getRankFromElo(loser.elo);
    const loserNewRank = this.getRankFromElo(loserNewElo);
    
    // Vérification des paliers atteints
    const winnerMilestones = this.checkMilestonesReached(winner.elo, winnerNewElo);
    const loserMilestones = this.checkMilestonesReached(loser.elo, loserNewElo);
    
    // Progression vers le prochain rang
    const winnerProgress = this.getProgressToNextRank(winnerNewElo);
    const loserProgress = this.getProgressToNextRank(loserNewElo);
    
    return {
      winner: {
        ...winner,
        oldElo: winner.elo,
        newElo: winnerNewElo,
        eloChange: eloChanges.winner,
        oldRank: winnerOldRank,
        newRank: winnerNewRank,
        rank: winnerNewRank,
        rankChanged: winnerOldRank !== winnerNewRank,
        rankUp: this.isRankUp(winnerOldRank, winnerNewRank),
        progress: winnerProgress,
        milestonesReached: winnerMilestones
      },
      loser: {
        ...loser,
        oldElo: loser.elo,
        newElo: loserNewElo,
        eloChange: eloChanges.loser,
        oldRank: loserOldRank,
        newRank: loserNewRank,
        rank: loserNewRank,
        rankChanged: loserOldRank !== loserNewRank,
        rankUp: false, // Un perdant ne peut pas monter de rang
        progress: loserProgress,
        milestonesReached: loserMilestones
      },
      match: {
        winProbability: this.calculateWinProbability(winner.elo, loser.elo),
        upset: this.isUpset(winner.elo, loser.elo),
        eloGap: Math.abs(winner.elo - loser.elo),
        category: this.getMatchCategory(winner.elo, loser.elo)
      }
    };
  }

  // Vérifier si c'est un upset (victoire surprise)
  isUpset(winnerElo, loserElo) {
    return winnerElo < loserElo - 100; // Si le gagnant avait 100+ ELO de moins
  }

  // Catégoriser le match
  getMatchCategory(elo1, elo2) {
    const gap = Math.abs(elo1 - elo2);
    if (gap < 50) return 'Équilibré';
    if (gap < 150) return 'Léger favori';
    if (gap < 300) return 'Favori net';
    return 'Mismatch';
  }

  // Vérifier si c'est une montée de rang
  isRankUp(oldRank, newRank) {
    const oldThreshold = this.RANK_THRESHOLDS[oldRank] || 0;
    const newThreshold = this.RANK_THRESHOLDS[newRank] || 0;
    return newThreshold > oldThreshold;
  }

  // Vérifier les paliers atteints
  checkMilestonesReached(oldElo, newElo) {
    const milestones = [];
    for (const threshold of this.MILESTONE_THRESHOLDS) {
      if (oldElo < threshold && newElo >= threshold) {
        milestones.push(threshold);
      }
    }
    return milestones;
  }

  // Calculer les statistiques d'un joueur
  calculatePlayerStats(player, recentMatches = []) {
    const last10Matches = recentMatches.slice(-10);
    const wins = last10Matches.filter(match => 
      (match.player1 === player.id && match.result_player1 > match.result_player2) ||
      (match.player2 === player.id && match.result_player2 > match.result_player1)
    ).length;
    
    const winRate = last10Matches.length > 0 ? Math.round((wins / last10Matches.length) * 100) : 0;
    
    // Calcul de la forme récente (streak)
    let currentStreak = 0;
    let streakType = 'none';
    
    for (let i = last10Matches.length - 1; i >= 0; i--) {
      const match = last10Matches[i];
      const isWin = (match.player1 === player.id && match.result_player1 > match.result_player2) ||
                   (match.player2 === player.id && match.result_player2 > match.result_player1);
      
      if (i === last10Matches.length - 1) {
        streakType = isWin ? 'win' : 'loss';
        currentStreak = 1;
      } else if ((isWin && streakType === 'win') || (!isWin && streakType === 'loss')) {
        currentStreak++;
      } else {
        break;
      }
    }

    const rank = this.getRankFromElo(player.elo);
    const progress = this.getProgressToNextRank(player.elo);

    return {
      ...player,
      rank,
      progress,
      stats: {
        winRate,
        last10Wins: wins,
        last10Matches: last10Matches.length,
        currentStreak,
        streakType,
        totalMatches: recentMatches.length
      }
    };
  }

  // Prédire le résultat d'un match
  predictMatch(player1, player2) {
    const winProb1 = this.calculateWinProbability(player1.elo, player2.elo);
    const winProb2 = 1 - winProb1;
    
    return {
      player1: {
        ...player1,
        winProbability: Math.round(winProb1 * 100),
        expectedEloGain: this.calculateEloChange(player1.elo, player2.elo).winner,
        expectedEloLoss: this.calculateEloChange(player2.elo, player1.elo).loser
      },
      player2: {
        ...player2,
        winProbability: Math.round(winProb2 * 100),
        expectedEloGain: this.calculateEloChange(player2.elo, player1.elo).winner,
        expectedEloLoss: this.calculateEloChange(player1.elo, player2.elo).loser
      },
      matchInfo: {
        category: this.getMatchCategory(player1.elo, player2.elo),
        eloGap: Math.abs(player1.elo - player2.elo),
        isBalanced: Math.abs(player1.elo - player2.elo) < 100
      }
    };
  }
}

module.exports = new EloService(); 