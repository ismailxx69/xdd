const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Ban = require('../../models/banSchema');

module.exports = {
  name: 'ban',
  description: 'Üyeyi süresiz olarak yasaklar',
  execute(message, args) {
    const yetkiliRol = '1253151300858679330';
    const banLogKanali = '1253849082636668968';

    if (!message.member.roles.cache.has(yetkiliRol)) {
      message.channel.send('Bu komutu sadece yetkili kişiler kullanabilir!');
      return;
    }

    const üye = message.mentions.members.first();
    if (!üye) {
      message.channel.send('Lütfen yasaklanacak üyeyi etiketleyin!');
      return;
    }

    const sebep = args.slice(1).join(' ');
    if (!sebep) {
      message.channel.send('Lütfen yasaklanma sebebi belirtin!');
      return;
    }

    const banLimit = 3;
    const existingBans = Ban.countDocuments({ üyeId: üye.id });
    if (existingBans >= banLimit) {
      message.channel.send(`Üye ${üye} zaten ${banLimit} kez yasaklanmış!`);
      return;
    }

    üye.ban({ reason: sebep });

    const banVerisi = new Ban({
      üyeId: üye.id,
      sebep: sebep,
      tarih: Date.now()
    });
    banVerisi.save();

    const logKanali = message.guild.channels.cache.get(banLogKanali);
    logKanali.send(`Üye ${üye} yasaklandı! Sebep: ${sebep}`);
  }
};