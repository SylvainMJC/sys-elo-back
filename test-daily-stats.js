require('dotenv').config();
const discordNotificationService = require('./services/discordNotificationService');

async function testDailyStatistics() {
  console.log('🧪 Test statistiques quotidiennes Discord');
  console.log('==========================================\n');

  try {
    // Données de test pour statistiques quotidiennes
    const statsData = {
      matchesToday: 25,
      activePlayers: 67,
      averageElo: 1425,
      topPlayers: [
        { username: 'GrandMaster1', elo: 2350 },
        { username: 'Master2', elo: 2180 },
        { username: 'Diamond3', elo: 1950 },
        { username: 'Platinum4', elo: 1720 },
        { username: 'Gold5', elo: 1580 },
        { username: 'Silver6', elo: 1350 },
        { username: 'Bronze7', elo: 1120 }
      ]
    };

    console.log('📊 Données de test:');
    console.log(`   Matchs aujourd'hui: ${statsData.matchesToday}`);
    console.log(`   Joueurs actifs: ${statsData.activePlayers}`);
    console.log(`   ELO moyen: ${statsData.averageElo}`);
    console.log(`   Top joueurs: ${statsData.topPlayers.length}`);
    console.log();

    // Test des statistiques quotidiennes
    console.log('📢 Envoi des statistiques quotidiennes...');
    const result = await discordNotificationService.sendDailyStatistics(statsData);

    console.log(`📤 Résultat: ${result.success ? '✅ ENVOYÉ' : '❌ ÉCHEC'}`);
    console.log(`   Bot Discord (leaderboard): ${result.methods.bot ? '✅' : '❌'}`);
    console.log(`   Webhook (stats générales): ${result.methods.webhook ? '✅' : '❌'}`);
    
    if (result.errors.length > 0) {
      console.log(`   Erreurs: ${result.errors.join(', ')}`);
    }

    console.log('\n🎉 Test terminé !');
    console.log('================');
    console.log('✅ Fonctionnalité statistiques quotidiennes opérationnelle');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }

  // Graceful shutdown
  setTimeout(() => {
    console.log('\n👋 Fermeture du service Discord...');
    discordNotificationService.destroy();
    process.exit(0);
  }, 2000);
}

// Exécuter le test
testDailyStatistics(); 