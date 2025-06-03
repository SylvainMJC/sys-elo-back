require('dotenv').config();
const discordService = require('./discordService');
const webhookService = require('./webhookService');

/**
 * Service unifié pour toutes les notifications Discord
 * Élimine les doublons entre discordService et webhookService
 */
class DiscordNotificationService {
  constructor() {
    this.discordBot = discordService;
    this.webhook = webhookService;
  }

  /**
   * Envoie une notification de fin de match
   * Utilise Bot + Webhook pour redondance
   */
  async sendMatchNotification(match, winner, loser) {
    console.log(`📢 Envoi notification match #${match.id}: ${winner.username} vs ${loser.username}`);
    
    const promises = [];
    let results = {
      bot: false,
      webhook: false,
      errors: []
    };

    // Tentative Bot Discord
    if (this.discordBot.isReady) {
      promises.push(
        this.discordBot.sendMatchNotification(match, winner, loser)
          .then(result => { results.bot = result; })
          .catch(err => {
            results.errors.push(`Bot: ${err.message}`);
            console.warn('⚠️ Erreur Discord Bot:', err.message);
          })
      );
    }

    // Tentative Webhook Discord
    if (this.webhook.isEnabled) {
      promises.push(
        this.webhook.sendMatchResult(match, winner, loser)
          .then(result => { results.webhook = result; })
          .catch(err => {
            results.errors.push(`Webhook: ${err.message}`);
            console.warn('⚠️ Erreur Webhook Discord:', err.message);
          })
      );
    }

    await Promise.allSettled(promises);

    const success = results.bot || results.webhook;
    console.log(`${success ? '✅' : '❌'} Notification match: Bot(${results.bot}) Webhook(${results.webhook})`);
    
    return {
      success,
      methods: results,
      errors: results.errors
    };
  }

  /**
   * Envoie une notification de palier ELO atteint
   * Utilise Bot + Webhook pour redondance
   */
  async sendEloMilestone(player, milestone) {
    console.log(`🎯 Envoi milestone ${milestone} pour ${player.username}`);
    
    const promises = [];
    let results = {
      bot: false,
      webhook: false,
      errors: []
    };

    // Tentative Bot Discord
    if (this.discordBot.isReady) {
      promises.push(
        this.discordBot.sendEloMilestone(player, milestone)
          .then(result => { results.bot = result; })
          .catch(err => {
            results.errors.push(`Bot: ${err.message}`);
            console.warn('⚠️ Erreur milestone Bot:', err.message);
          })
      );
    }

    // Tentative Webhook Discord
    if (this.webhook.isEnabled) {
      promises.push(
        this.webhook.sendEloMilestone(player, milestone)
          .then(result => { results.webhook = result; })
          .catch(err => {
            results.errors.push(`Webhook: ${err.message}`);
            console.warn('⚠️ Erreur milestone Webhook:', err.message);
          })
      );
    }

    await Promise.allSettled(promises);

    const success = results.bot || results.webhook;
    console.log(`${success ? '✅' : '❌'} Milestone: Bot(${results.bot}) Webhook(${results.webhook})`);
    
    return {
      success,
      methods: results,
      milestone,
      errors: results.errors
    };
  }

  /**
   * Envoie une notification spéciale (montée de rang, upset, etc.)
   */
  async sendSpecialNotification(type, title, message, color = 0x007fff) {
    console.log(`🎭 Envoi notification spéciale: ${type}`);
    
    // Utilise seulement le webhook pour les notifications rapides
    if (this.webhook.isEnabled) {
      try {
        const result = await this.webhook.sendQuickNotification(title, message, color);
        console.log(`${result ? '✅' : '❌'} Notification spéciale ${type} envoyée`);
        return {
          success: result,
          type,
          method: 'webhook'
        };
      } catch (error) {
        console.error(`❌ Erreur notification spéciale ${type}:`, error.message);
        return {
          success: false,
          type,
          error: error.message
        };
      }
    }

    console.warn('⚠️ Webhook non disponible pour notification spéciale');
    return {
      success: false,
      type,
      error: 'Webhook non configuré'
    };
  }

  /**
   * Envoie les statistiques quotidiennes
   * Unifie sendDailyLeaderboard et sendDailyStats
   */
  async sendDailyStatistics(stats) {
    console.log('📊 Envoi statistiques quotidiennes');
    
    const promises = [];
    let results = {
      bot: false,
      webhook: false,
      errors: []
    };

    // Format pour Bot Discord (leaderboard)
    if (this.discordBot.isReady && stats.topPlayers) {
      promises.push(
        this.discordBot.sendDailyLeaderboard(stats.topPlayers)
          .then(result => { results.bot = result; })
          .catch(err => {
            results.errors.push(`Bot leaderboard: ${err.message}`);
            console.warn('⚠️ Erreur daily leaderboard:', err.message);
          })
      );
    }

    // Format pour Webhook (stats générales)
    if (this.webhook.isEnabled) {
      promises.push(
        this.webhook.sendDailyStats(stats)
          .then(result => { results.webhook = result; })
          .catch(err => {
            results.errors.push(`Webhook stats: ${err.message}`);
            console.warn('⚠️ Erreur daily stats:', err.message);
          })
      );
    }

    await Promise.allSettled(promises);

    const success = results.bot || results.webhook;
    console.log(`${success ? '✅' : '❌'} Stats quotidiennes: Bot(${results.bot}) Webhook(${results.webhook})`);
    
    return {
      success,
      methods: results,
      errors: results.errors
    };
  }

  /**
   * Test complet de toutes les connexions Discord
   */
  async testAllConnections() {
    console.log('🧪 Test des connexions Discord');
    
    const results = {
      bot: {
        available: this.discordBot.isReady,
        tested: false,
        success: false,
        error: null
      },
      webhook: {
        available: this.webhook.isEnabled,
        tested: false,
        success: false,
        error: null
      }
    };

    // Test Bot Discord
    if (results.bot.available) {
      try {
        results.bot.tested = true;
        await this.discordBot.testConnection();
        results.bot.success = true;
        console.log('✅ Bot Discord: OK');
      } catch (error) {
        results.bot.error = error.message;
        console.log(`❌ Bot Discord: ${error.message}`);
      }
    }

    // Test Webhook Discord
    if (results.webhook.available) {
      try {
        results.webhook.tested = true;
        await this.webhook.testWebhook();
        results.webhook.success = true;
        console.log('✅ Webhook Discord: OK');
      } catch (error) {
        results.webhook.error = error.message;
        console.log(`❌ Webhook Discord: ${error.message}`);
      }
    }

    const overallSuccess = (results.bot.success || !results.bot.available) && 
                          (results.webhook.success || !results.webhook.available);

    console.log(`${overallSuccess ? '✅' : '❌'} Test connexions Discord terminé`);
    
    return {
      success: overallSuccess,
      details: results,
      summary: {
        botOk: results.bot.success,
        webhookOk: results.webhook.success,
        atLeastOne: results.bot.success || results.webhook.success
      }
    };
  }

  /**
   * Envoie une alerte système
   */
  async sendSystemAlert(alertType, message, isError = false) {
    if (this.webhook.isEnabled) {
      return this.webhook.sendSystemAlert(alertType, message, isError);
    }
    return false;
  }

  /**
   * Obtient le statut des services Discord
   */
  getStatus() {
    return {
      bot: {
        enabled: !!process.env.DISCORD_BOT_TOKEN,
        connected: this.discordBot.isReady,
        service: 'Discord.js Client'
      },
      webhook: {
        enabled: this.webhook.isEnabled,
        connected: this.webhook.isEnabled,
        service: 'Discord Webhook'
      },
      unified: true,
      version: '2.0.0'
    };
  }

  /**
   * Fermeture propre
   */
  async destroy() {
    console.log('🔌 Fermeture service Discord unifié');
    if (this.discordBot.client) {
      await this.discordBot.destroy();
    }
  }

  /**
   * Envoie une notification de début de match
   * Format plus simple que la fin de match
   */
  async sendMatchStartNotification(match, player1, player2) {
    console.log(`🚀 Envoi notification début match #${match.id}: ${player1.username} vs ${player2.username}`);
    
    const promises = [];
    let results = {
      bot: false,
      webhook: false,
      errors: []
    };

    // Prédiction du match
    const prediction = this.getPredictionMessage(player1.elo, player2.elo);
    const startMessage = `**${player1.username}** (${player1.elo} ELO) vs **${player2.username}** (${player2.elo} ELO)\n\n🏆 **Prédiction:** ${prediction}\n⏰ **Statut:** En cours`;

    // Tentative Bot Discord (avec embed complet)
    if (this.discordBot.isReady && process.env.DISCORD_CHANNEL_ID) {
      promises.push(
        this.sendBotStartNotification(match, player1, player2, prediction)
          .then(result => { results.bot = result; })
          .catch(err => {
            results.errors.push(`Bot: ${err.message}`);
            console.warn('⚠️ Erreur start match Bot:', err.message);
          })
      );
    }

    // Tentative Webhook Discord (notification simple)
    if (this.webhook.isEnabled) {
      promises.push(
        this.webhook.sendQuickNotification(
          '🚀 Nouveau Match !',
          startMessage,
          0x00ff00 // Vert pour nouveau match
        )
          .then(result => { results.webhook = result; })
          .catch(err => {
            results.errors.push(`Webhook: ${err.message}`);
            console.warn('⚠️ Erreur start match Webhook:', err.message);
          })
      );
    }

    await Promise.allSettled(promises);

    const success = results.bot || results.webhook;
    console.log(`${success ? '✅' : '❌'} Notification début match: Bot(${results.bot}) Webhook(${results.webhook})`);
    
    return {
      success,
      methods: results,
      errors: results.errors
    };
  }

  /**
   * Méthode spécialisée pour envoyer via le Bot Discord avec embed riche
   */
  async sendBotStartNotification(match, player1, player2, prediction) {
    try {
      const { EmbedBuilder } = require('discord.js');
      const channel = await this.discordBot.client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
      
      const embed = new EmbedBuilder()
        .setTitle('🚀 Nouveau Match !')
        .setDescription(`**${player1.username}** vs **${player2.username}**`)
        .setColor(0x00ff00)
        .addFields([
          {
            name: '👤 Joueur 1',
            value: `**${player1.username}**\nELO: ${player1.elo}`,
            inline: true
          },
          {
            name: '👤 Joueur 2',
            value: `**${player2.username}**\nELO: ${player2.elo}`,
            inline: true
          },
          {
            name: '🏆 Prédiction',
            value: prediction,
            inline: true
          },
          {
            name: '⏰ Statut',
            value: '**En cours**',
            inline: true
          },
          {
            name: '🎮 Match ID',
            value: `#${match.id}`,
            inline: true
          }
        ])
        .setTimestamp()
        .setFooter({ 
          text: 'SysELO • Match en cours',
          iconURL: 'https://cdn.discordapp.com/embed/avatars/0.png'
        });

      const message = await channel.send({ embeds: [embed] });
      
      // Ajouter des réactions automatiques
      await message.react('🎮');
      await message.react('🍿'); // Popcorn pour regarder le match
      
      console.log('✅ Notification Discord début match envoyée');
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi notification début match Discord:', error.message);
      return false;
    }
  }

  /**
   * Méthode utilitaire pour générer le message de prédiction
   */
  getPredictionMessage(elo1, elo2) {
    const diff = Math.abs(elo1 - elo2);
    const favorite = elo1 > elo2 ? 'Joueur 1' : 'Joueur 2';
    
    if (diff < 50) return '⚖️ Match équilibré';
    if (diff < 150) return `📈 ${favorite} légèrement favori`;
    if (diff < 300) return `🎯 ${favorite} favori`;
    return `🔥 ${favorite} grand favori`;
  }
}

module.exports = new DiscordNotificationService(); 