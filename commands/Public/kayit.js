const Discord = require('discord.js');

module.exports = {
  name: 'k',
  description: 'Üyeyi kaydeder',
  execute(message, args) {
    const kayitYapacakRol = '1253151310245527632';
    const kayitliUyeRol = '1253153083438010408';
    const kayitsizRol = '1253153083358445711';
    const genelSohbetKanali = '1250178358860447756';

    if (message.member.roles.cache.has(kayitYapacakRol)) {
      const kayitEdilecekKisi = message.mentions.members.first();

      kayitEdilecekKisi.roles.remove(kayitsizRol);
      kayitEdilecekKisi.roles.add(kayitliUyeRol);

      const kanal = message.guild.channels.cache.get(genelSohbetKanali);
      kanal.send(`Malikhaneye Hoş Geldin ${kayitEdilecekKisi}!`);

      // Kayıt verilerini MongoDB'ye kaydet
      const Kayit = require('../models/kayit');
      const kayitVerisi = new Kayit({
        yetkili: message.author.id,
        kayitEdilen: kayitEdilecekKisi.id,
        tarih: Date.now()
      });
      kayitVerisi.save();
    } else {
      message.channel.send('Kayıt yapacak rolünüz yok!');
    }
  }
};