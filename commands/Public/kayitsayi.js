const { MessageEmbed } = require('discord.js');
const Kayit = require('../../models/kayit');

module.exports = {
  name: 'kayit-sayisi',
  description: 'Üyenin yaptığı kayıt sayısını gösterir',
  execute(message, args) {
    if (!message.member.roles.cache.has('1253151310245527632')) {
      message.channel.send('Bu komutu sadece yetkili kişiler kullanabilir!');
      return;
    }

    Kayit.countDocuments({ yetkili: message.author.id }, (err, count) => {
      if (err) {
        console.error(err);
        message.channel.send('Kayıt sayısını alırken hata oluştu!');
      } else {
        message.channel.send(`Kayıt sayınız: ${count}`);
      }
    });
  }
};