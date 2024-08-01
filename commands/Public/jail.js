const { MessageEmbed } = require('discord.js');
const mongoose = require('../mongoose');
const Jail = require('../models/jail');

module.exports = {
  name: 'jail',
  description: 'Üyeyi süreli olarak jaillenir',
  execute(message, args) {
    const yetkiliRol = '1253151301760716810';
    const jailRol = '1253153081030344744';

    if (!message.member.roles.cache.has(yetkiliRol)) {
      message.channel.send('Bu komutu sadece yetkili kişiler kullanabilir!');
      return;
    }

    const üye = message.mentions.members.first();
    if (!üye) {
      message.channel.send('Lütfen jaillenecek üyeyi etiketleyin!');
      return;
    }

    const süre = args[1];
    if (!süre) {
      message.channel.send('Lütfen süre belirtin!');
      return;
    }

    const eskiRoller = üye.roles.cache.array();
    üye.roles.set([jailRol]);

    const jailVerisi = new Jail({
      üyeId: üye.id,
      eskiRoller: eskiRoller,
      süre: süre,
      tarih: Date.now()
    });
    jailVerisi.save();

    message.channel.send(`Üye ${üye} süreli olarak jaillendi!`);

    setTimeout(() => {
      Jail.findOneAndDelete({ üyeId: üye.id }, (err, doc) => {
        if (err) {
          console.error(err);
        } else {
          üye.roles.set(doc.eskiRoller);
          message.channel.send(`Üye ${üye} süreli olarak serbest bırakıldı!`);
        }
      });
    }, süre * 1000);
  }
};