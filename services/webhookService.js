require('dotenv').config();
const axios = require('axios');

class WebhookService {
  constructor() {
    this.webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    this.isEnabled = !!this.webhookUrl;
    
    if (!this.isEnabled) {
      console.warn('⚠️ DISCORD_WEBHOOK_URL non défini, webhooks Discord désactivés');
    }
  }

  async sendMatchResult(match, winner, loser) {
    if (!this.isEnabled) {
      console.log('⚠️ Webhook Discord non disponible, notification ignorée');
      return false;
    }

    try {
      const embed = {
        title: "🏆 Match Terminé !",
        color: winner.eloChange > 0 ? 0x00ff00 : 0xff6b6b,
        fields: [
          {
            name: "🥇 Vainqueur",
            value: `**${winner.username}**\nELO: ${winner.newElo} (+${winner.eloChange})\nRang: ${winner.rank || 'Non classé'}`,
            inline: true
          },
          {
            name: "🥈 Adversaire", 
            value: `**${loser.username}**\nELO: ${loser.newElo} (${loser.eloChange})\nRang: ${loser.rank || 'Non classé'}`,
            inline: true
          },
          {
            name: "📊 Score",
            value: `${match.result_player1} - ${match.result_player2}`,
            inline: true
          },
          {
            name: "⏱️ Durée",
            value: match.duration || 'Non disponible',
            inline: true
          },
          {
            name: "🎮 Match ID",
            value: `#${match.id}`,
            inline: true
          },
          {
            name: "📅 Date",
            value: new Date(match.updated_at || Date.now()).toLocaleString('fr-FR'),
            inline: true
          }
        ],
        timestamp: new Date(),
        footer: {
          text: "SysELO • Système de classement",
          icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
        }
      };

      const response = await axios.post(this.webhookUrl, {
        embeds: [embed],
        username: "SysELO Bot",
        avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png"
      });

      console.log('✅ Notification webhook Discord envoyée');
      return true;
    } catch (error) {
      console.error('❌ Erreur webhook Discord:', error.message);
      return false;
    }
  }

  async sendQuickNotification(title, message, color = 0x007fff) {
    if (!this.isEnabled) {
      return false;
    }

    try {
      const embed = {
        title: title,
        description: message,
        color: color,
        timestamp: new Date(),
        footer: {
          text: "SysELO"
        }
      };

      await axios.post(this.webhookUrl, {
        embeds: [embed],
        username: "SysELO Bot"
      });

      console.log(`✅ Notification rapide envoyée: ${title}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur notification rapide:', error.message);
      return false;
    }
  }

  async sendEloMilestone(player, milestone) {
    if (!this.isEnabled) {
      return false;
    }

    try {
      const embed = {
        title: "🎯 Nouveau Palier Atteint !",
        description: `**${player.username}** vient d'atteindre **${milestone}** ELO !`,
        color: 0xffd700,
        fields: [
          {
            name: "📈 Progression",
            value: `ELO actuel: **${player.elo}**\nRang: **${player.rank || 'Maître'}**`,
            inline: true
          }
        ],
        thumbnail: {
          url: player.avatar || "https://cdn.discordapp.com/embed/avatars/0.png"
        },
        timestamp: new Date()
      };

      await axios.post(this.webhookUrl, {
        embeds: [embed],
        username: "SysELO Bot"
      });

      console.log(`✅ Milestone webhook envoyé pour ${player.username}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur milestone webhook:', error.message);
      return false;
    }
  }

  async sendSystemAlert(alertType, message, isError = false) {
    if (!this.isEnabled) {
      return false;
    }

    try {
      const embed = {
        title: `🚨 ${alertType}`,
        description: message,
        color: isError ? 0xff0000 : 0xffa500,
        timestamp: new Date(),
        footer: {
          text: "SysELO System Alert"
        }
      };

      await axios.post(this.webhookUrl, {
        embeds: [embed],
        username: "SysELO System"
      });

      console.log(`✅ Alerte système envoyée: ${alertType}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur alerte système:', error.message);
      return false;
    }
  }

  // Test de connexion webhook
  async testWebhook() {
    if (!this.isEnabled) {
      throw new Error('Webhook Discord non configuré');
    }

    try {
      await this.sendQuickNotification(
        '🧪 Test Webhook',
        'Test de connexion webhook SysELO réussi !',
        0x00ff00
      );
      console.log('✅ Test webhook Discord réussi');
      return true;
    } catch (error) {
      console.error('❌ Test webhook échoué:', error.message);
      throw error;
    }
  }

  // Méthode pour envoyer des stats périodiques
  async sendDailyStats(stats) {
    if (!this.isEnabled) {
      return false;
    }

    try {
      const embed = {
        title: "📊 Statistiques Quotidiennes",
        color: 0x007fff,
        fields: [
          {
            name: "🎮 Matchs du jour",
            value: stats.matchesToday || '0',
            inline: true
          },
          {
            name: "👥 Joueurs actifs",
            value: stats.activePlayers || '0',
            inline: true
          },
          {
            name: "📈 Total ELO moyen",
            value: stats.averageElo || '1200',
            inline: true
          }
        ],
        timestamp: new Date(),
        footer: {
          text: "Stats générées automatiquement"
        }
      };

      await axios.post(this.webhookUrl, {
        embeds: [embed],
        username: "SysELO Stats"
      });

      console.log('✅ Stats quotidiennes envoyées');
      return true;
    } catch (error) {
      console.error('❌ Erreur stats quotidiennes:', error.message);
      return false;
    }
  }
}

module.exports = new WebhookService(); 