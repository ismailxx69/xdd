const { Client, Guild, VoiceState, Message } = require('discord.js');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/istatistikler', { useNewUrlParser: true, useUnifiedTopology: true });

const kullanıcıSchema = new mongoose.Schema({
  userId: String,
  sesSüresi: Number,
  mesajSayısı: Number,
  sesKanalları: [{ type: String, ref: 'SesKanalı' }],
  metinKanalları: [{ type: String, ref: 'MetinKanalı' }]
});

const Kullanıcı = mongoose.model('Kullanıcı', kullanıcıSchema);

const sesKanalıSchema = new mongoose.Schema({
  kanalId: String,
  adı: String
});

const SesKanalı = mongoose.model('SesKanalı', sesKanalıSchema);

const metinKanalıSchema = new mongoose.Schema({
  kanalId: String,
  adı: String
});

const MetinKanalı = mongoose.model('MetinKanalı', metinKanalıSchema);

module.exports = {
  adı: 'istatistikler',
  async init(client) {
    client.on('ready', () => {
      console.log('İstatistik sistemi çalışmaya başladı!');
    });

    client.on('voiceStateUpdate', (eskiDurum, yeniDurum) => {
      if (!eskiDurum || !yeniDurum) return;

      const kullanıcı = yeniDurum.member.user;
      const sesKanalı = yeniDurum.channel;

      if (sesKanalı) {
        Kullanıcı.findOneAndUpdate({ userId: kullanıcı.id }, { $inc: { sesSüresi: 1 } }, { upsert: true }, (err, kullanıcı) => {
          if (err) console.error(err);
          else {
            kullanıcı.sesKanalları.push(sesKanalı.id);
            kullanıcı.save();
          }
        });
      }
    });

    client.on('message', (message) => {
      const kullanıcı = message.author;
      const metinKanalı = message.channel;

      Kullanıcı.findOneAndUpdate({ userId: kullanıcı.id }, { $inc: { mesajSayısı: 1 } }, { upsert: true }, (err, kullanıcı) => {
        if (err) console.error(err);
        else {
          kullanıcı.metinKanalları.push(metinKanalı.id);
          kullanıcı.save();
        }
      });
    });

    client.on('message', (message) => {
      if (message.content === '.istatistik') {
        Kullanıcı.find().sort({ sesSüresi: -1, mesajSayısı: -1 }).limit(5).exec((err, kullanıcılar) => {
          if (err) console.error(err);
          else {
            const tablo = [];
            kullanıcılar.forEach((kullanıcı) => {
              tablo.push([
                kullanıcı.userId,
                kullanıcı.sesSüresi,
                kullanıcı.mesajSayısı,
                kullanıcı.sesKanalları.map((kanal) => kanal.adı).join(', '),
                kullanıcı.metinKanalları.map((kanal) => kanal.adı).join(', ')
              ]);
            });

            const embed = new Discord.MessageEmbed()
              .setTitle('En Aktif 5 Kullanıcı')
              .setDescription(`**Ses Süresi** | **Mesaj Sayısı** | **Ses Kanalları** | **Metin Kanalları**`)
              .addField('**Kullanıcılar**', tablo.map((row) => row.join(' | ')).join('\n'));

            message.channel.send(embed);
          }
        });
      }
    });
  }
};