const { Client, Guild, VoiceState } = require('discord.js');

module.exports = {
  name: 'sesLog',
  async init(client) {
    const logKanali = client.channels.cache.get('1253848955251462296'); // Log kanalı ID'sini buraya yazın

    client.on('ready', () => {
      console.log('Ses log sistemi çalışmaya başladı!');
    });

    client.on('voiceStateUpdate', (eskiDurum, yeniDurum) => {
      if (!eskiDurum || !yeniDurum) return;

      const kullanici = yeniDurum.member.user;
      const sunucu = yeniDurum.guild;

      if (yeniDurum.channelID !== eskiDurum.channelID) {
        if (yeniDurum.channelID) {
          logKanali.send(`**${kullanici.username}** **${yeniDurum.channel.name}** kanalına katıldı`);
        } else {
          logKanali.send(`**${kullanici.username}** **${eskiDurum.channel.name}** kanalından ayrıldı`);
        }
      }

      if (yeniDurum.selfMute !== eskiDurum.selfMute) {
        if (yeniDurum.selfMute) {
          logKanali.send(`**${kullanici.username}** mikrofonunu susturdu`);
        } else {
          logKanali.send(`**${kullanici.username}** mikrofonunu açtı`);
        }
      }

      if (yeniDurum.selfDeaf !== eskiDurum.selfDeaf) {
        if (yeniDurum.selfDeaf) {
          logKanali.send(`**${kullanici.username}** kulaklığını kapattı`);
        } else {
          logKanali.send(`**${kullanici.username}** kulaklığını açtı`);
        }
      }

      if (yeniDurum.selfVideo !== eskiDurum.selfVideo) {
        if (yeniDurum.selfVideo) {
          logKanali.send(`**${kullanici.username}** kamerayı açtı`);
        } else {
          logKanali.send(`**${kullanici.username}** kamerayı kapattı`);
        }
      }
    });
  }
};