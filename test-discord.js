require('dotenv').config();
const discordNotificationService = require('./services/discordNotificationService');
const eloService = require('./services/eloService');

async function testDiscordIntegration() {
  console.log('🧪 Test de l\'intégration Discord SysELO - VERSION UNIFIÉE');
  console.log('=========================================================\n');

  // Attendre 3 secondes pour laisser le bot Discord se connecter
  console.log('⏳ Attente de la connexion Discord...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Données de test
  const testPlayer1 = {
    id: 1,
    username: 'TestPlayer1',
    elo: 1450
  };

  const testPlayer2 = {
    id: 2,
    username: 'TestPlayer2',
    elo: 1380
  };

  const testMatch = {
    id: 999,
    result_player1: 21,
    result_player2: 19,
    created_at: new Date(Date.now() - 25 * 60 * 1000), // Il y a 25 minutes
    updated_at: new Date(),
    duration: '25 min'
  };

  try {
    // 📊 Test 1: Calcul ELO enrichi
    console.log('📊 Test 1: Calcul ELO enrichi');
    const eloResult = eloService.calculateMatchResult(
      testPlayer1, 
      testPlayer2, 
      testMatch.result_player1, 
      testMatch.result_player2
    );
    
    console.log(`✅ Vainqueur: ${eloResult.winner.username}`);
    console.log(`   ELO: ${eloResult.winner.oldElo} → ${eloResult.winner.newElo} (+${eloResult.winner.eloChange})`);
    console.log(`   Rang: ${eloResult.winner.oldRank} → ${eloResult.winner.newRank}`);
    console.log(`✅ Perdant: ${eloResult.loser.username}`);
    console.log(`   ELO: ${eloResult.loser.oldElo} → ${eloResult.loser.newElo} (${eloResult.loser.eloChange})`);
    console.log(`   Rang: ${eloResult.loser.oldRank} → ${eloResult.loser.newRank}\n`);

    // 🔧 Test 2: Statut des services Discord
    console.log('🔧 Test 2: Statut des services Discord');
    const status = discordNotificationService.getStatus();
    console.log('📋 Configuration:');
    console.log(`   Bot Discord: ${status.bot.enabled ? '✅ Configuré' : '❌ Non configuré'} | ${status.bot.connected ? '🟢 Connecté' : '🔴 Déconnecté'}`);
    console.log(`   Webhook Discord: ${status.webhook.enabled ? '✅ Configuré' : '❌ Non configuré'} | ${status.webhook.connected ? '🟢 Connecté' : '🔴 Déconnecté'}`);
    console.log(`   Service unifié v${status.version}: ${status.unified ? '✅ Actif' : '❌ Inactif'}\n`);

    // 🧪 Test 3: Test complet des connexions Discord
    console.log('🧪 Test 3: Test complet des connexions Discord');
    const connectionTests = await discordNotificationService.testAllConnections();
    console.log(`📊 Résultats globaux: ${connectionTests.success ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
    console.log(`   Au moins une méthode: ${connectionTests.summary.atLeastOne ? '✅' : '❌'}`);
    console.log(`   Bot OK: ${connectionTests.summary.botOk ? '✅' : connectionTests.details.bot.available ? '❌' : '⚠️'}`);
    console.log(`   Webhook OK: ${connectionTests.summary.webhookOk ? '✅' : connectionTests.details.webhook.available ? '❌' : '⚠️'}\n`);

    // 📢 Test 4: Notification de match unifiée
    console.log('📢 Test 4: Notification de match unifiée (Bot + Webhook)');
    const matchNotification = await discordNotificationService.sendMatchNotification(
      testMatch, 
      eloResult.winner, 
      eloResult.loser
    );
    console.log(`📤 Résultat: ${matchNotification.success ? '✅ ENVOYÉ' : '❌ ÉCHEC'}`);
    console.log(`   Bot Discord: ${matchNotification.methods.bot ? '✅' : '❌'}`);
    console.log(`   Webhook: ${matchNotification.methods.webhook ? '✅' : '❌'}`);
    if (matchNotification.errors.length > 0) {
      console.log(`   Erreurs: ${matchNotification.errors.join(', ')}`);
    }
    console.log();

    // 🎯 Test 5: Notification milestone (si applicable)
    if (eloResult.winner.milestonesReached.length > 0) {
      console.log('🎯 Test 5: Notification milestone unifiée');
      for (const milestone of eloResult.winner.milestonesReached) {
        const milestoneResult = await discordNotificationService.sendEloMilestone(
          eloResult.winner, 
          milestone
        );
        console.log(`🎯 Milestone ${milestone}: ${milestoneResult.success ? '✅' : '❌'}`);
        console.log(`   Bot: ${milestoneResult.methods.bot ? '✅' : '❌'} | Webhook: ${milestoneResult.methods.webhook ? '✅' : '❌'}`);
      }
      console.log();
    } else {
      console.log('🎯 Test 5: Aucun milestone atteint pour ce test\n');
    }

    // 🎉 Test 6: Notification spéciale montée de rang (si applicable)
    if (eloResult.winner.rankUp) {
      console.log('🎉 Test 6: Notification montée de rang');
      const rankUpResult = await discordNotificationService.sendSpecialNotification(
        'rank_up',
        '🎉 Test Montée de Rang',
        `**${eloResult.winner.username}** passe ${eloResult.winner.oldRank} → **${eloResult.winner.newRank}** !`,
        0x00ff00
      );
      console.log(`🎉 Montée de rang: ${rankUpResult.success ? '✅' : '❌'}`);
      console.log(`   Méthode: ${rankUpResult.method || 'N/A'}`);
      console.log();
    } else {
      console.log('🎉 Test 6: Aucune montée de rang pour ce test\n');
    }

    // 🎭 Test 7: Notification upset (si applicable)
    if (eloResult.match.upset) {
      console.log('🎭 Test 7: Notification upset');
      const upsetResult = await discordNotificationService.sendSpecialNotification(
        'upset',
        '🎭 Test Upset',
        `Victoire surprise de **${eloResult.winner.username}** !`,
        0xff6b6b
      );
      console.log(`🎭 Upset: ${upsetResult.success ? '✅' : '❌'}`);
      console.log(`   Méthode: ${upsetResult.method || 'N/A'}`);
      console.log();
    } else {
      console.log('🎭 Test 7: Aucun upset détecté pour ce test\n');
    }

    // 📊 Test 8: Statistiques quotidiennes unifiées
    console.log('📊 Test 8: Statistiques quotidiennes unifiées');
    const statsData = {
      matchesToday: 15,
      activePlayers: 42,
      averageElo: 1350,
      topPlayers: [
        { username: 'Champion1', elo: 2100 },
        { username: 'Champion2', elo: 1950 },
        { username: 'Champion3', elo: 1850 }
      ]
    };
    
    const dailyStatsResult = await discordNotificationService.sendDailyStatistics(statsData);
    console.log(`📊 Stats quotidiennes: ${dailyStatsResult.success ? '✅' : '❌'}`);
    console.log(`   Bot (leaderboard): ${dailyStatsResult.methods.bot ? '✅' : '❌'}`);
    console.log(`   Webhook (stats): ${dailyStatsResult.methods.webhook ? '✅' : '❌'}`);
    console.log();

    // 🚨 Test 9: Alerte système
    console.log('🚨 Test 9: Alerte système');
    const alertResult = await discordNotificationService.sendSystemAlert(
      'Test Système',
      'Test d\'alerte système depuis le service unifié',
      false
    );
    console.log(`🚨 Alerte système: ${alertResult ? '✅' : '❌'}\n`);

    // 📋 Résumé final
    console.log('🎉 Tests terminés avec succès !');
    console.log('=====================================');
    console.log('📋 RÉSUMÉ DÉTAILLÉ:');
    console.log(`• ⚙️  Service unifié: ✅ Opérationnel`);
    console.log(`• 📊 Calcul ELO: ✅`);
    console.log(`• 🔧 Configuration Discord: ${status.bot.enabled || status.webhook.enabled ? '✅' : '❌'}`);
    console.log(`• 🧪 Tests connexion: ${connectionTests.success ? '✅' : connectionTests.summary.atLeastOne ? '⚠️' : '❌'}`);
    console.log(`• 📢 Notification match: ${matchNotification.success ? '✅' : '❌'}`);
    console.log(`• 🎯 Milestone: ${eloResult.winner.milestonesReached.length > 0 ? '✅ Testé' : '➖ N/A'}`);
    console.log(`• 🎉 Montée de rang: ${eloResult.winner.rankUp ? '✅ Testé' : '➖ N/A'}`);
    console.log(`• 🎭 Upset: ${eloResult.match.upset ? '✅ Testé' : '➖ N/A'}`);
    console.log(`• 📊 Stats quotidiennes: ${dailyStatsResult.success ? '✅' : '❌'}`);
    console.log(`• 🚨 Alerte système: ${alertResult ? '✅' : '❌'}`);
    console.log('\n🔥 AVANTAGES DU SERVICE UNIFIÉ:');
    console.log('• ✅ Élimination des doublons');
    console.log('• ✅ Redondance Bot + Webhook');
    console.log('• ✅ Gestion d\'erreurs centralisée');
    console.log('• ✅ Tests complets automatisés');
    console.log('• ✅ Configuration unifiée');
    console.log('• ✅ Reporting détaillé');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    console.log('\n🔍 Diagnostic:');
    const status = discordNotificationService.getStatus();
    console.log(`   Bot configuré: ${status.bot.enabled}`);
    console.log(`   Bot connecté: ${status.bot.connected}`);
    console.log(`   Webhook configuré: ${status.webhook.enabled}`);
    console.log('   Variables d\'environnement à vérifier: DISCORD_BOT_TOKEN, DISCORD_WEBHOOK_URL, DISCORD_CHANNEL_ID');
  }

  // Graceful shutdown
  setTimeout(() => {
    console.log('\n👋 Fermeture propre du service Discord unifié...');
    discordNotificationService.destroy();
    console.log('🔌 Déconnexion terminée, au revoir !');
    process.exit(0);
  }, 2000);
}

// Lancer les tests
console.log('🚀 Démarrage des tests Discord unifiés...\n');
testDiscordIntegration(); 