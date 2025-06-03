require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

class DiscordService {
  constructor() {
    this.client = null;
    this.isReady = false;
    this.initializeBot();
  }

  async initializeBot() {
    try {
      this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds
          // Intents de base seulement pour éviter les erreurs de permissions
        ]
      });

      this.client.once('ready', () => {
        console.log(`✅ Discord Bot connecté : ${this.client.user.tag}`);
        this.isReady = true;
      });

      this.client.on('error', (error) => {
        console.error('❌ Erreur Discord Bot:', error);
        this.isReady = false;
      });

      if (process.env.DISCORD_BOT_TOKEN) {
        await this.client.login(process.env.DISCORD_BOT_TOKEN);
      } else {
        console.warn('⚠️ DISCORD_BOT_TOKEN non défini, fonctionnalités Discord désactivées');
      }
    } catch (error) {
      console.error('❌ Erreur initialisation Discord:', error.message);
      this.isReady = false;
    }
  }

  async sendMatchNotification(match, winner, loser) {
    if (!this.isReady || !process.env.DISCORD_CHANNEL_ID) {
      console.log('⚠️ Discord non disponible, notification ignorée');
      return false;
    }

    try {
      const channel = await this.client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
      
      const embed = new EmbedBuilder()
        .setTitle('🏆 Match Terminé !')
        .setColor(winner.eloChange > 0 ? 0x00ff00 : 0xff6b6b)
        .addFields([
          {
            name: '🥇 Vainqueur',
            value: `**${winner.username}**\nELO: ${winner.newElo} (+${winner.eloChange})\nRang: ${winner.rank || 'Non classé'}`,
            inline: true
          },
          {
            name: '🥈 Adversaire',
            value: `**${loser.username}**\nELO: ${loser.newElo} (${loser.eloChange})\nRang: ${loser.rank || 'Non classé'}`,
            inline: true
          },
          {
            name: '📊 Score',
            value: `${match.result_player1} - ${match.result_player2}`,
            inline: true
          },
          {
            name: '⏱️ Durée',
            value: match.duration || 'Non disponible',
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
          text: 'SysELO • Système de classement',
          iconURL: 'https://cdn.discordapp.com/embed/avatars/0.png'
        });

      const message = await channel.send({ embeds: [embed] });
      
      // Ajouter des réactions automatiques
      await message.react('🏆');
      await message.react('🎮');
      
      console.log('✅ Notification Discord match envoyée');
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi notification Discord:', error.message);
      return false;
    }
  }

  async sendEloMilestone(player, milestone) {
    if (!this.isReady || !process.env.DISCORD_CHANNEL_ID) {
      return false;
    }

    try {
      const channel = await this.client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
      
      const embed = new EmbedBuilder()
        .setTitle('🎯 Nouveau Palier Atteint !')
        .setDescription(`**${player.username}** vient d'atteindre **${milestone}** ELO !`)
        .setColor(0xffd700)
        .addFields([
          {
            name: '📈 Progression',
            value: `ELO actuel: **${player.elo}**\nRang: **${player.rank || 'Maître'}**`,
            inline: true
          }
        ])
        .setThumbnail(player.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png')
        .setTimestamp();

      const message = await channel.send({ embeds: [embed] });
      await message.react('🎯');
      await message.react('🔥');
      
      console.log(`✅ Milestone Discord envoyé pour ${player.username}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi milestone Discord:', error.message);
      return false;
    }
  }

  async sendDailyLeaderboard(topPlayers) {
    if (!this.isReady || !process.env.DISCORD_CHANNEL_ID) {
      return false;
    }

    try {
      const channel = await this.client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
      
      const leaderboardText = topPlayers
        .slice(0, 10)
        .map((player, index) => {
          const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
          return `${medal} **${player.username}** - ${player.elo} ELO`;
        })
        .join('\n');

      const embed = new EmbedBuilder()
        .setTitle('📊 Classement Quotidien')
        .setDescription(leaderboardText)
        .setColor(0x007fff)
        .setTimestamp()
        .setFooter({ text: 'Mis à jour quotidiennement à minuit' });

      const message = await channel.send({ embeds: [embed] });
      await message.react('📊');
      
      console.log('✅ Leaderboard quotidien envoyé');
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi leaderboard Discord:', error.message);
      return false;
    }
  }

  // Méthode utilitaire pour tester la connexion
  async testConnection() {
    if (!this.isReady) {
      throw new Error('Bot Discord non connecté');
    }

    const channel = await this.client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
    await channel.send('🧪 **Test de connexion SysELO** - Bot fonctionnel !');
    console.log('✅ Test de connexion Discord réussi');
  }

  // Graceful shutdown
  async destroy() {
    if (this.client) {
      await this.client.destroy();
      console.log('🔌 Discord Bot déconnecté');
    }
  }
}

module.exports = new DiscordService(); 