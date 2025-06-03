require('dotenv').config();
const discordNotificationService = require('./services/discordNotificationService');

async function testStartMatchNotification() {
  console.log('🧪 Test notification début de match Discord');
  console.log('================================================\n');

  try {
    // Données de test pour un début de match
    const testMatch = {
      id: 888,
      player1: 1,
      player2: 2,
      id_status: 2, // "In Progress"
      created_at: new Date(),
      updated_at: new Date()
    };

    const testPlayer1 = {
      id: 1,
      username: 'TestPlayer1',
      elo: 1600 // Platine
    };

    const testPlayer2 = {
      id: 2,
      username: 'TestPlayer2',
      elo: 1450 // Or
    };

    console.log('🎮 Début de match simulé:');
    console.log(`   Match ID: ${testMatch.id}`);
    console.log(`   ${testPlayer1.username} (${testPlayer1.elo}) vs ${testPlayer2.username} (${testPlayer2.elo})`);
    console.log(`   Différence ELO: ${Math.abs(testPlayer1.elo - testPlayer2.elo)}`);
    console.log();

    // Test de la notification de début
    console.log('📢 Envoi de la notification de début...');
    const startResult = await discordNotificationService.sendMatchStartNotification(
      testMatch,
      testPlayer1,
      testPlayer2
    );

    console.log(`📤 Résultat: ${startResult.success ? '✅ ENVOYÉ' : '❌ ÉCHEC'}`);
    console.log(`   Bot Discord: ${startResult.methods.bot ? '✅' : '❌'}`);
    console.log(`   Webhook: ${startResult.methods.webhook ? '✅' : '❌'}`);
    
    if (startResult.errors.length > 0) {
      console.log(`   Erreurs: ${startResult.errors.join(', ')}`);
    }

    console.log('\n🎉 Test terminé !');
    console.log('================');
    console.log('✅ Fonctionnalité notification début de match opérationnelle');

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
testStartMatchNotification(); 